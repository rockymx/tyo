/**
 * Theme management for the TyO Directory
 */

import { storage, handleError } from './utils.js';

class ThemeManager {
  constructor() {
    this.currentTheme = storage.get('theme', 'dark');
    this.themeToggle = null;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }
  
  init() {
    try {
      this.bindElements();
      this.bindEvents();
      this.applyTheme(this.currentTheme);
    } catch (error) {
      handleError(error, 'ThemeManager.init');
    }
  }
  
  bindElements() {
    this.themeToggle = document.getElementById('themeToggle');
    
    if (!this.themeToggle) {
      throw new Error('Theme toggle element not found');
    }
  }
  
  bindEvents() {
    this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    
    // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }
  
  toggleTheme() {
    try {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    } catch (error) {
      handleError(error, 'ThemeManager.toggleTheme');
    }
  }
  
  setTheme(theme) {
    try {
      if (theme !== 'light' && theme !== 'dark') {
        throw new Error(`Invalid theme: ${theme}`);
      }
      
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.saveTheme(theme);
      
      // Dispatch custom event for other components
      document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme }
      }));
      
    } catch (error) {
      handleError(error, 'ThemeManager.setTheme');
    }
  }
  
  applyTheme(theme) {
    const body = document.body;
    
    if (theme === 'light') {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
    }
    
    // Update theme toggle button accessibility
    this.updateToggleButton(theme);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }
  
  updateToggleButton(theme) {
    if (this.themeToggle) {
      const title = theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
      this.themeToggle.title = title;
      this.themeToggle.setAttribute('aria-label', title);
    }
  }
  
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    const color = theme === 'light' ? '#F9FAFB' : '#0F172A';
    metaThemeColor.content = color;
  }
  
  saveTheme(theme) {
    storage.set('theme', theme);
  }
  
  handleSystemThemeChange(e) {
    // Only auto-switch if user hasn't manually set a preference
    const hasManualPreference = storage.get('theme') !== null;
    
    if (!hasManualPreference) {
      const systemTheme = e.matches ? 'dark' : 'light';
      this.setTheme(systemTheme);
    }
  }
  
  // Public API
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  isDarkMode() {
    return this.currentTheme === 'dark';
  }
  
  isLightMode() {
    return this.currentTheme === 'light';
  }
  
  getSystemTheme() {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }
  
  resetToSystemTheme() {
    const systemTheme = this.getSystemTheme();
    this.setTheme(systemTheme);
    storage.remove('theme'); // Remove manual preference
  }
}

export default ThemeManager;
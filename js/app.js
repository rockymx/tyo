/**
 * Main application file for TyO Directory
 * Coordinates all modules and handles initialization
 */

import { handleError, scrollToTop, requestIdleCallback } from './utils.js';
import SearchManager from './search.js';
import FavoritesManager from './favorites.js';
import ThemeManager from './theme.js';
import ModalManager from './modal.js';
import CardManager from './cards.js';

class TyOApp {
  constructor() {
    this.config = null;
    this.managers = {};
    this.isInitialized = false;
    
    this.init();
  }
  
  async init() {
    try {
      // Show loading state
      this.showLoadingState();
      
      // Load configuration
      await this.loadConfig();
      
      // Initialize managers
      await this.initializeManagers();
      
      // Set up global event listeners
      this.setupGlobalEvents();
      
      // Hide loading state and show content
      await this.hideLoadingState();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Dispatch ready event
      document.dispatchEvent(new CustomEvent('app:ready'));
      
    } catch (error) {
      handleError(error, 'TyOApp.init');
      this.showErrorState();
    }
  }
  
  async loadConfig() {
    try {
      const response = await fetch('./config/links.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load configuration: ${response.status}`);
      }
      
      this.config = await response.json();
      
    } catch (error) {
      handleError(error, 'TyOApp.loadConfig');
      // Fallback to empty config
      this.config = { categories: {} };
    }
  }
  
  async initializeManagers() {
    try {
      // Initialize theme manager first (affects visual appearance)
      this.managers.theme = new ThemeManager();
      
      // Initialize other managers
      this.managers.favorites = new FavoritesManager();
      this.managers.search = new SearchManager();
      this.managers.modal = new ModalManager();
      this.managers.cards = new CardManager(this.config);
      
      // Make managers globally available for backward compatibility
      window.themeManager = this.managers.theme;
      window.favoritesManager = this.managers.favorites;
      window.searchManager = this.managers.search;
      window.modalManager = this.managers.modal;
      window.cardManager = this.managers.cards;
      
    } catch (error) {
      handleError(error, 'TyOApp.initializeManagers');
    }
  }
  
  setupGlobalEvents() {
    // Scroll to top functionality
    const titleElement = document.querySelector('.clickable-title');
    if (titleElement) {
      titleElement.addEventListener('click', scrollToTop);
    }
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
    
    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Handle online/offline status
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }
  
  handleGlobalKeydown(e) {
    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          this.focusSearch();
          break;
        case '/':
          e.preventDefault();
          this.focusSearch();
          break;
        case 'Home':
          e.preventDefault();
          scrollToTop();
          break;
      }
    }
    
    // Arrow key navigation for cards
    if (document.activeElement?.classList.contains('card')) {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          this.managers.cards?.focusCard('next');
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.managers.cards?.focusCard('previous');
          break;
        case 'Home':
          e.preventDefault();
          this.managers.cards?.focusCard('first');
          break;
        case 'End':
          e.preventDefault();
          this.managers.cards?.focusCard('last');
          break;
      }
    }
  }
  
  handleResize() {
    // Handle responsive behavior
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
  }
  
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - pause any animations or timers
      document.body.classList.add('page-hidden');
    } else {
      // Page is visible - resume normal operation
      document.body.classList.remove('page-hidden');
    }
  }
  
  handleOnline() {
    document.body.classList.remove('offline');
    console.log('Connection restored');
  }
  
  handleOffline() {
    document.body.classList.add('offline');
    console.log('Connection lost');
  }
  
  focusSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      this.managers.search?.expandSearch();
      searchInput.focus();
    }
  }
  
  showLoadingState() {
    const skeletonContainer = document.getElementById('skeletonContainer');
    const cardsGrid = document.getElementById('cardsGrid');
    
    if (skeletonContainer && cardsGrid) {
      skeletonContainer.style.display = 'grid';
      cardsGrid.style.display = 'none';
    }
  }
  
  async hideLoadingState() {
    return new Promise((resolve) => {
      // Simulate minimum loading time for better UX
      setTimeout(() => {
        const skeletonContainer = document.getElementById('skeletonContainer');
        const cardsGrid = document.getElementById('cardsGrid');
        
        if (skeletonContainer && cardsGrid) {
          skeletonContainer.style.display = 'none';
          cardsGrid.style.display = 'grid';
          
          // Add staggered animation to cards
          const cards = document.querySelectorAll('.card');
          cards.forEach((card, index) => {
            requestIdleCallback(() => {
              setTimeout(() => {
                card.classList.add('loaded');
              }, index * 50);
            });
          });
        }
        
        resolve();
      }, 800);
    });
  }
  
  showErrorState() {
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Error al cargar la aplicación</h2>
          <p>Ha ocurrido un error al inicializar la aplicación. Por favor, recarga la página.</p>
          <button onclick="window.location.reload()" class="reload-button">
            <i class="fas fa-redo"></i>
            Recargar página
          </button>
        </div>
      `;
    }
  }
  
  // Public API
  getManager(name) {
    return this.managers[name];
  }
  
  getConfig() {
    return this.config;
  }
  
  isReady() {
    return this.isInitialized;
  }
  
  // Utility methods for external use
  search(term) {
    this.managers.search?.search(term);
  }
  
  toggleFavorites() {
    this.managers.favorites?.toggleFavoritesView();
  }
  
  toggleTheme() {
    this.managers.theme?.toggleTheme();
  }
  
  openModal(id) {
    this.managers.modal?.openModal(id);
  }
  
  closeModal(id) {
    this.managers.modal?.closeModal(id);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.tyoApp = new TyOApp();
  });
} else {
  window.tyoApp = new TyOApp();
}

// Export for module use
export default TyOApp;
// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = storage.get('theme', 'dark');
        this.themeToggle = null;
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.themeToggle = document.getElementById('themeToggle');
            if (this.themeToggle) {
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
            }
            this.updateThemeIcon();
        });
    }

    applyTheme(theme) {
        document.body.className = document.body.className.replace(/\b(light|dark)-theme\b/g, '');
        document.body.classList.add(`${theme}-theme`);
        this.currentTheme = theme;
        storage.set('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateThemeIcon();
        
        // Add a subtle animation to the toggle button
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.themeToggle.style.transform = '';
            }, 150);
        }
    }

    updateThemeIcon() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        const title = this.currentTheme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
        this.themeToggle.setAttribute('title', title);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Create global theme manager instance
window.themeManager = new ThemeManager();
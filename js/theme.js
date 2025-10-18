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
        this.updateThemeIcon();
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
        if (!this.themeToggle) {
            this.themeToggle = document.getElementById('themeToggle');
        }
        if (!this.themeToggle) return;

        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            // Show sun icon when dark theme (to switch to light)
            // Show moon icon when light theme (to switch to dark)
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        const title = this.currentTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        this.themeToggle.setAttribute('title', title);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Create global theme manager instance
window.themeManager = new ThemeManager();
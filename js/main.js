// Main Application
class TyOApp {
    constructor() {
        this.categories = {};
        this.filteredCategories = {};
        this.isLoading = true;
        this.init();
    }

    async init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
            this.loadData();
        });
    }

    bindEvents() {
        // Title click to scroll to top
        const titleBtn = document.getElementById('titleBtn');
        if (titleBtn) {
            titleBtn.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        // Listen for search events
        document.addEventListener('searchPerformed', (e) => {
            this.handleSearch(e.detail.searchTerm);
        });

        // Listen for favorites changes
        document.addEventListener('favoritesChanged', (e) => {
            this.handleFavoritesChange(e.detail);
        });

        // Card clicks
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card && !e.target.closest('.favorite-btn')) {
                this.handleCardClick(card);
            }
        });
    }

    async loadData() {
        try {
            // Try to fetch the JSON file
            const response = await fetch('data/links.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.categories = data.categories;
            this.filteredCategories = { ...this.categories };

            // Simulate loading delay for better UX
            setTimeout(() => {
                this.renderCards();
                this.hideLoading();
            }, 800);

        } catch (error) {
            console.warn('Error loading data from file, trying embedded data:', error);

            // Fallback: try to load from window.EMBEDDED_DATA if fetch fails (for file:// protocol)
            if (window.EMBEDDED_DATA && window.EMBEDDED_DATA.categories) {
                this.categories = window.EMBEDDED_DATA.categories;
                this.filteredCategories = { ...this.categories };

                setTimeout(() => {
                    this.renderCards();
                    this.hideLoading();
                }, 800);
            } else {
                console.error('Error loading data:', error);
                this.showError('Error al cargar los datos. Por favor, ejecuta la aplicación con un servidor local (npm run dev)');
                this.hideLoading();
            }
        }
    }

    renderCards() {
        const cardsGrid = document.getElementById('cardsGrid');
        if (!cardsGrid) return;

        cardsGrid.innerHTML = '';

        const categories = Object.entries(this.filteredCategories);
        
        if (categories.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        categories.forEach(([category, data]) => {
            const card = this.createCard(category, data);
            cardsGrid.appendChild(card);
        });

        // Update favorite buttons after rendering
        setTimeout(() => {
            if (window.favoritesManager) {
                window.favoritesManager.updateFavoriteButtons();
            }
        }, 100);

        cardsGrid.style.display = 'grid';
    }

    createCard(category, data) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-category', category);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${data.title}. ${data.description}`);

        card.innerHTML = `
            <div class="card-icon ${data.color}">
                <i class="${data.icon}"></i>
            </div>
            <div class="card-content">
                <h3 class="card-title">${data.title}</h3>
                <p class="card-description">${data.description}</p>
            </div>
            <button class="favorite-btn" title="Agregar a favoritos" aria-label="Agregar a favoritos">
                <i class="far fa-heart"></i>
            </button>
            <div class="card-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        `;

        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCardClick(card);
            }
        });

        return card;
    }

    handleCardClick(card) {
        const category = card.getAttribute('data-category');
        const data = this.categories[category];
        
        if (!data || !data.url) return;

        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Open link
        if (this.isValidUrl(data.url)) {
            window.open(data.url, '_blank', 'noopener,noreferrer');
        }
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredCategories = { ...this.categories };
        } else {
            this.filteredCategories = {};
            
            Object.entries(this.categories).forEach(([category, data]) => {
                if (
                    category.toLowerCase().includes(term) ||
                    data.title.toLowerCase().includes(term) ||
                    data.description.toLowerCase().includes(term)
                ) {
                    this.filteredCategories[category] = data;
                }
            });
        }

        // Apply favorites filter if active
        if (window.favoritesManager && window.favoritesManager.isShowingFavorites()) {
            this.applyFavoritesFilter();
        }

        this.renderCards();
    }

    handleFavoritesChange(detail) {
        if (detail.showingFavorites) {
            this.applyFavoritesFilter();
        } else {
            // Restore search results or all categories
            const searchTerm = window.searchManager ? window.searchManager.getCurrentSearchTerm() : '';
            this.handleSearch(searchTerm);
        }
        this.renderCards();
    }

    applyFavoritesFilter() {
        const favorites = window.favoritesManager ? window.favoritesManager.getFavorites() : [];
        const filtered = {};
        
        Object.entries(this.filteredCategories).forEach(([category, data]) => {
            if (favorites.includes(category)) {
                filtered[category] = data;
            }
        });
        
        this.filteredCategories = filtered;
    }

    showNoResults() {
        const noResults = document.getElementById('noResults');
        const noResultsTitle = document.getElementById('noResultsTitle');
        const noResultsDescription = document.getElementById('noResultsDescription');
        
        if (!noResults) return;

        let title, description, icon;
        
        const showingFavorites = window.favoritesManager && window.favoritesManager.isShowingFavorites();
        const searchTerm = window.searchManager ? window.searchManager.getCurrentSearchTerm() : '';
        const favorites = window.favoritesManager ? window.favoritesManager.getFavorites() : [];

        if (showingFavorites && favorites.length === 0) {
            title = 'No tienes favoritos';
            description = 'Agrega categorías a favoritos haciendo clic en el corazón';
            icon = 'fas fa-heart';
        } else if (showingFavorites && searchTerm) {
            title = 'No se encontraron favoritos';
            description = `No hay favoritos que coincidan con "${searchTerm}"`;
            icon = 'fas fa-search';
        } else {
            title = 'No se encontraron resultados';
            description = 'Intenta con otro término de búsqueda';
            icon = 'fas fa-search';
        }

        if (noResultsTitle) noResultsTitle.textContent = title;
        if (noResultsDescription) noResultsDescription.textContent = description;
        
        const iconElement = noResults.querySelector('.no-results-icon i');
        if (iconElement) iconElement.className = icon;

        noResults.style.display = 'block';
    }

    hideNoResults() {
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    hideLoading() {
        const skeleton = document.getElementById('skeletonContainer');
        const cardsGrid = document.getElementById('cardsGrid');
        
        if (skeleton) {
            skeleton.style.display = 'none';
        }
        
        this.isLoading = false;
    }

    showError(message) {
        console.error(message);
        // Could implement a toast notification here
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Initialize the application
window.tyoApp = new TyOApp();

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export for global access
window.utils = {
    debounce,
    throttle
};
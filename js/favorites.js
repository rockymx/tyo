// Favorites Management
class FavoritesManager {
    constructor() {
        this.favorites = storage.get('favorites', []);
        this.favoritesToggle = null;
        this.favoritesCount = null;
        this.showingFavorites = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindElements();
            this.bindEvents();
            this.updateFavoritesCount();
        });
    }

    bindElements() {
        this.favoritesToggle = document.getElementById('favoritesToggle');
        this.favoritesCount = document.getElementById('favoritesCount');
    }

    bindEvents() {
        if (this.favoritesToggle) {
            this.favoritesToggle.addEventListener('click', () => {
                this.toggleFavoritesView();
            });
        }

        // Listen for favorite button clicks on cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                e.stopPropagation();
                const card = e.target.closest('.card');
                if (card) {
                    const category = card.getAttribute('data-category');
                    this.toggleFavorite(category);
                    this.animateFavoriteButton(e.target.closest('.favorite-btn'));
                }
            }
        });
    }

    addFavorite(category) {
        if (!this.favorites.includes(category)) {
            this.favorites.push(category);
            this.saveFavorites();
            this.updateFavoritesCount();
            this.updateFavoriteButtons();
        }
    }

    removeFavorite(category) {
        this.favorites = this.favorites.filter(fav => fav !== category);
        this.saveFavorites();
        this.updateFavoritesCount();
        this.updateFavoriteButtons();
        
        // If showing favorites and this was the last one, refresh the view
        if (this.showingFavorites) {
            this.dispatchFavoritesChanged();
        }
    }

    toggleFavorite(category) {
        if (this.isFavorite(category)) {
            this.removeFavorite(category);
        } else {
            this.addFavorite(category);
        }
    }

    isFavorite(category) {
        return this.favorites.includes(category);
    }

    toggleFavoritesView() {
        this.showingFavorites = !this.showingFavorites;
        
        // Update button appearance
        if (this.favoritesToggle) {
            this.favoritesToggle.style.color = this.showingFavorites ? 'var(--danger)' : '';
            this.favoritesToggle.setAttribute('title', 
                this.showingFavorites ? 'Mostrar todos' : 'Ver favoritos'
            );
        }
        
        // Dispatch event to update cards display
        this.dispatchFavoritesChanged();
    }

    dispatchFavoritesChanged() {
        const event = new CustomEvent('favoritesChanged', {
            detail: { 
                favorites: this.favorites,
                showingFavorites: this.showingFavorites
            }
        });
        document.dispatchEvent(event);
    }

    updateFavoritesCount() {
        if (this.favoritesCount) {
            if (this.favorites.length > 0) {
                this.favoritesCount.textContent = this.favorites.length;
                this.favoritesCount.style.display = 'flex';
            } else {
                this.favoritesCount.style.display = 'none';
            }
        }
    }

    updateFavoriteButtons() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const favoriteBtn = card.querySelector('.favorite-btn');
            const icon = favoriteBtn?.querySelector('i');
            
            if (favoriteBtn && icon) {
                const isFav = this.isFavorite(category);
                favoriteBtn.classList.toggle('favorited', isFav);
                icon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
                favoriteBtn.setAttribute('title', 
                    isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'
                );
            }
        });
    }

    animateFavoriteButton(button) {
        if (!button) return;
        
        // Add heartbeat animation
        button.style.animation = 'heartbeat 0.3s ease-in-out';
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }

    saveFavorites() {
        storage.set('favorites', this.favorites);
    }

    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
        this.updateFavoritesCount();
        this.updateFavoriteButtons();
        this.dispatchFavoritesChanged();
    }

    getFavorites() {
        return [...this.favorites];
    }

    isShowingFavorites() {
        return this.showingFavorites;
    }
}

// Create global favorites manager instance
window.favoritesManager = new FavoritesManager();
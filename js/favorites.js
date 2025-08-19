/**
 * Favorites management for the TyO Directory
 */

import { storage, handleError, addAnimation } from './utils.js';

class FavoritesManager {
  constructor() {
    this.favorites = storage.get('favorites', []);
    this.showingFavorites = false;
    this.favoritesToggle = null;
    this.favoritesCount = null;
    this.cards = [];
    
    this.init();
  }
  
  init() {
    try {
      this.bindElements();
      this.bindEvents();
      this.updateDisplay();
    } catch (error) {
      handleError(error, 'FavoritesManager.init');
    }
  }
  
  bindElements() {
    this.favoritesToggle = document.getElementById('favoritesToggle');
    this.favoritesCount = document.getElementById('favoritesCount');
    this.cards = document.querySelectorAll('.card');
    
    if (!this.favoritesToggle) {
      throw new Error('Favorites toggle element not found');
    }
  }
  
  bindEvents() {
    this.favoritesToggle.addEventListener('click', this.toggleFavoritesView.bind(this));
    
    // Add click handlers to favorite buttons
    this.cards.forEach(card => {
      const favoriteBtn = card.querySelector('.favorite-btn');
      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleFavorite(favoriteBtn);
        });
      }
    });
  }
  
  toggleFavorite(button) {
    try {
      const card = button.closest('.card');
      const category = card.getAttribute('data-category');
      const icon = button.querySelector('i');
      
      if (this.favorites.includes(category)) {
        // Remove from favorites
        this.favorites = this.favorites.filter(fav => fav !== category);
        icon.className = 'far fa-heart';
        button.classList.remove('favorited');
        button.title = 'Agregar a favoritos';
      } else {
        // Add to favorites
        this.favorites.push(category);
        icon.className = 'fas fa-heart';
        button.classList.add('favorited');
        button.title = 'Quitar de favoritos';
        
        // Heart animation
        addAnimation(button, 'heartbeat', 300);
      }
      
      this.saveFavorites();
      this.updateFavoritesCount();
      
      // Refresh search if showing favorites
      if (this.showingFavorites) {
        window.searchManager?.refresh();
      }
      
    } catch (error) {
      handleError(error, 'FavoritesManager.toggleFavorite');
    }
  }
  
  toggleFavoritesView() {
    try {
      this.showingFavorites = !this.showingFavorites;
      
      if (this.showingFavorites) {
        this.showFavoritesOnly();
      } else {
        this.showAllCards();
      }
      
      this.updateToggleButton();
      
      // Refresh search to maintain current search term
      window.searchManager?.refresh();
      
    } catch (error) {
      handleError(error, 'FavoritesManager.toggleFavoritesView');
    }
  }
  
  showFavoritesOnly() {
    this.favoritesToggle.style.color = 'var(--danger)';
    this.favoritesToggle.title = 'Mostrar todos';
    
    this.cards.forEach(card => {
      const category = card.getAttribute('data-category');
      card.style.display = this.favorites.includes(category) ? 'flex' : 'none';
    });
    
    if (this.favorites.length === 0) {
      this.showNoFavoritesMessage();
    }
  }
  
  showAllCards() {
    this.favoritesToggle.style.color = '';
    this.favoritesToggle.title = 'Ver favoritos';
    
    this.cards.forEach(card => {
      card.style.display = 'flex';
    });
    
    this.hideNoResultsMessage();
  }
  
  showNoFavoritesMessage() {
    const noResults = document.getElementById('noResults');
    const cardsGrid = document.getElementById('cardsGrid');
    
    if (noResults && cardsGrid) {
      noResults.innerHTML = `
        <div class="no-results-icon">
          <i class="fas fa-heart"></i>
        </div>
        <h3>No tienes favoritos</h3>
        <p>Agrega categorías a favoritos haciendo clic en el corazón</p>
      `;
      noResults.style.display = 'block';
      cardsGrid.style.display = 'none';
    }
  }
  
  hideNoResultsMessage() {
    const noResults = document.getElementById('noResults');
    const cardsGrid = document.getElementById('cardsGrid');
    
    if (noResults && cardsGrid) {
      noResults.style.display = 'none';
      cardsGrid.style.display = 'grid';
    }
  }
  
  updateToggleButton() {
    if (this.showingFavorites) {
      this.favoritesToggle.style.color = 'var(--danger)';
      this.favoritesToggle.title = 'Mostrar todos';
    } else {
      this.favoritesToggle.style.color = '';
      this.favoritesToggle.title = 'Ver favoritos';
    }
  }
  
  updateFavoritesCount() {
    const count = this.favorites.length;
    
    if (this.favoritesCount) {
      if (count > 0) {
        this.favoritesCount.textContent = count;
        this.favoritesCount.style.display = 'flex';
      } else {
        this.favoritesCount.style.display = 'none';
      }
    }
  }
  
  updateDisplay() {
    this.updateFavoritesCount();
    
    this.cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const favoriteBtn = card.querySelector('.favorite-btn');
      
      if (favoriteBtn && this.favorites.includes(category)) {
        favoriteBtn.classList.add('favorited');
        favoriteBtn.querySelector('i').className = 'fas fa-heart';
        favoriteBtn.title = 'Quitar de favoritos';
      }
    });
  }
  
  saveFavorites() {
    storage.set('favorites', this.favorites);
  }
  
  // Public API
  getFavorites() {
    return [...this.favorites];
  }
  
  isFavorite(category) {
    return this.favorites.includes(category);
  }
  
  isShowingFavorites() {
    return this.showingFavorites;
  }
  
  addFavorite(category) {
    if (!this.favorites.includes(category)) {
      this.favorites.push(category);
      this.saveFavorites();
      this.updateDisplay();
      return true;
    }
    return false;
  }
  
  removeFavorite(category) {
    const index = this.favorites.indexOf(category);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      this.updateDisplay();
      return true;
    }
    return false;
  }
  
  clearFavorites() {
    this.favorites = [];
    this.saveFavorites();
    this.updateDisplay();
  }
  
  exportFavorites() {
    return {
      favorites: this.favorites,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }
  
  importFavorites(data) {
    try {
      if (data.favorites && Array.isArray(data.favorites)) {
        this.favorites = data.favorites;
        this.saveFavorites();
        this.updateDisplay();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, 'FavoritesManager.importFavorites');
      return false;
    }
  }
  
  refresh() {
    this.cards = document.querySelectorAll('.card');
    this.bindEvents();
    this.updateDisplay();
  }
}

export default FavoritesManager;
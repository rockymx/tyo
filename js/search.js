/**
 * Search functionality for the TyO Directory
 */

import { debounce, storage, handleError } from './utils.js';

class SearchManager {
  constructor() {
    this.searchInput = null;
    this.clearButton = null;
    this.headerSearch = null;
    this.cardsGrid = null;
    this.noResults = null;
    this.cards = [];
    this.searchHistory = storage.get('searchHistory', []);
    this.maxHistoryItems = 10;
    
    // Debounced search function
    this.debouncedSearch = debounce(this.performSearch.bind(this), 300);
    
    this.init();
  }
  
  init() {
    try {
      this.bindElements();
      this.bindEvents();
      this.loadSearchHistory();
    } catch (error) {
      handleError(error, 'SearchManager.init');
    }
  }
  
  bindElements() {
    this.searchInput = document.getElementById('searchInput');
    this.clearButton = document.getElementById('clearSearch');
    this.headerSearch = document.getElementById('headerSearch');
    this.cardsGrid = document.getElementById('cardsGrid');
    this.noResults = document.getElementById('noResults');
    this.cards = document.querySelectorAll('.card');
    
    if (!this.searchInput) {
      throw new Error('Search input element not found');
    }
  }
  
  bindEvents() {
    // Search input events
    this.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
    this.searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
    this.searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
    this.searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
    
    // Clear button event
    this.clearButton?.addEventListener('click', this.clearSearch.bind(this));
    
    // Click outside to collapse search
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }
  
  handleSearchInput(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Expand search if typing
    if (searchTerm && this.headerSearch?.classList.contains('collapsed')) {
      this.expandSearch();
    }
    
    // Show/hide clear button
    if (this.clearButton) {
      this.clearButton.style.display = searchTerm ? 'block' : 'none';
    }
    
    // Perform debounced search
    this.debouncedSearch(searchTerm);
  }
  
  handleSearchFocus() {
    this.expandSearch();
  }
  
  handleSearchBlur() {
    // Don't collapse immediately to allow for clear button clicks
    setTimeout(() => {
      if (!this.searchInput.value && document.activeElement !== this.clearButton) {
        this.collapseSearch();
      }
    }, 150);
  }
  
  handleSearchKeydown(e) {
    switch (e.key) {
      case 'Escape':
        this.clearSearch();
        this.searchInput.blur();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.focusFirstVisibleCard();
        break;
      case 'Enter':
        e.preventDefault();
        this.addToHistory(this.searchInput.value.trim());
        break;
    }
  }
  
  handleDocumentClick(e) {
    if (!this.headerSearch?.contains(e.target) && !this.searchInput.value) {
      this.collapseSearch();
    }
  }
  
  performSearch(searchTerm) {
    try {
      let visibleCards = 0;
      const showingFavorites = window.favoritesManager?.isShowingFavorites() || false;
      const favorites = window.favoritesManager?.getFavorites() || [];
      
      this.cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
        
        const matchesSearch = !searchTerm || 
          category.includes(searchTerm) || 
          title.includes(searchTerm) || 
          description.includes(searchTerm);
          
        const shouldShow = showingFavorites 
          ? (matchesSearch && favorites.includes(category))
          : matchesSearch;
        
        if (shouldShow) {
          card.style.display = 'flex';
          card.style.animationDelay = `${index * 0.05}s`;
          card.classList.add('fade-in');
          visibleCards++;
        } else {
          card.style.display = 'none';
          card.classList.remove('fade-in');
        }
      });
      
      this.updateResultsDisplay(visibleCards, searchTerm, showingFavorites, favorites.length);
      
    } catch (error) {
      handleError(error, 'SearchManager.performSearch');
    }
  }
  
  updateResultsDisplay(visibleCards, searchTerm, showingFavorites, favoritesCount) {
    if (visibleCards === 0 && (searchTerm || showingFavorites)) {
      let message;
      
      if (showingFavorites && favoritesCount === 0) {
        message = {
          icon: 'fas fa-heart',
          title: 'No tienes favoritos',
          description: 'Agrega categorías a favoritos haciendo clic en el corazón'
        };
      } else if (showingFavorites && searchTerm) {
        message = {
          icon: 'fas fa-search',
          title: 'No se encontraron favoritos',
          description: `No hay favoritos que coincidan con "${searchTerm}"`
        };
      } else {
        message = {
          icon: 'fas fa-search',
          title: 'No se encontraron resultados',
          description: 'Intenta con otro término de búsqueda'
        };
      }
      
      this.showNoResults(message);
    } else {
      this.hideNoResults();
    }
  }
  
  showNoResults(message) {
    if (this.noResults) {
      this.noResults.innerHTML = `
        <div class="no-results-icon">
          <i class="${message.icon}"></i>
        </div>
        <h3>${message.title}</h3>
        <p>${message.description}</p>
      `;
      this.noResults.style.display = 'block';
    }
    
    if (this.cardsGrid) {
      this.cardsGrid.style.display = 'none';
    }
  }
  
  hideNoResults() {
    if (this.noResults) {
      this.noResults.style.display = 'none';
    }
    
    if (this.cardsGrid) {
      this.cardsGrid.style.display = 'grid';
    }
  }
  
  clearSearch() {
    try {
      this.searchInput.value = '';
      
      if (this.clearButton) {
        this.clearButton.style.display = 'none';
      }
      
      this.hideNoResults();
      
      const showingFavorites = window.favoritesManager?.isShowingFavorites() || false;
      const favorites = window.favoritesManager?.getFavorites() || [];
      
      if (showingFavorites) {
        // Show only favorited cards
        this.cards.forEach(card => {
          const category = card.getAttribute('data-category');
          card.style.display = favorites.includes(category) ? 'flex' : 'none';
          card.classList.remove('fade-in');
        });
        
        if (favorites.length === 0) {
          this.showNoResults({
            icon: 'fas fa-heart',
            title: 'No tienes favoritos',
            description: 'Agrega categorías a favoritos haciendo clic en el corazón'
          });
        }
      } else {
        // Show all cards
        this.cards.forEach(card => {
          card.style.display = 'flex';
          card.classList.remove('fade-in');
        });
      }
      
      this.collapseSearch();
      this.searchInput.focus();
      
    } catch (error) {
      handleError(error, 'SearchManager.clearSearch');
    }
  }
  
  expandSearch() {
    if (this.headerSearch?.classList.contains('collapsed')) {
      this.headerSearch.classList.remove('collapsed');
      this.headerSearch.classList.add('expanded');
      
      setTimeout(() => {
        this.searchInput?.focus();
      }, 300);
    }
  }
  
  collapseSearch() {
    if (this.searchInput?.value === '' && !window.favoritesManager?.isShowingFavorites()) {
      this.headerSearch?.classList.remove('expanded');
      this.headerSearch?.classList.add('collapsed');
    }
  }
  
  focusFirstVisibleCard() {
    const firstVisibleCard = document.querySelector('.card:not([style*="display: none"])');
    firstVisibleCard?.focus();
  }
  
  // Search history management
  addToHistory(term) {
    if (!term || this.searchHistory.includes(term)) return;
    
    this.searchHistory.unshift(term);
    this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    storage.set('searchHistory', this.searchHistory);
  }
  
  loadSearchHistory() {
    this.searchHistory = storage.get('searchHistory', []);
  }
  
  getSearchHistory() {
    return this.searchHistory;
  }
  
  clearSearchHistory() {
    this.searchHistory = [];
    storage.remove('searchHistory');
  }
  
  // Public API
  search(term) {
    this.searchInput.value = term;
    this.performSearch(term.toLowerCase().trim());
  }
  
  refresh() {
    this.cards = document.querySelectorAll('.card');
    this.performSearch(this.searchInput?.value.toLowerCase().trim() || '');
  }
}

// Export for use in main script
export default SearchManager;
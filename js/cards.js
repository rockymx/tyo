/**
 * Card management and navigation for the TyO Directory
 */

import { handleError, isValidUrl } from './utils.js';

class CardManager {
  constructor(linksConfig) {
    this.linksConfig = linksConfig;
    this.cards = [];
    this.cardsGrid = null;
    
    this.init();
  }
  
  init() {
    try {
      this.bindElements();
      this.bindEvents();
      this.setupAccessibility();
    } catch (error) {
      handleError(error, 'CardManager.init');
    }
  }
  
  bindElements() {
    this.cardsGrid = document.getElementById('cardsGrid');
    this.cards = document.querySelectorAll('.card');
    
    if (!this.cardsGrid) {
      throw new Error('Cards grid element not found');
    }
  }
  
  bindEvents() {
    this.cards.forEach(card => {
      card.addEventListener('click', this.handleCardClick.bind(this));
      card.addEventListener('keydown', this.handleCardKeydown.bind(this));
    });
  }
  
  setupAccessibility() {
    this.cards.forEach(card => {
      // Make cards focusable
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      
      // Add ARIA labels
      const title = card.querySelector('.card-title')?.textContent;
      const description = card.querySelector('.card-description')?.textContent;
      
      if (title) {
        card.setAttribute('aria-label', `${title}. ${description || ''}`);
      }
    });
  }
  
  handleCardClick(e) {
    try {
      e.preventDefault();
      
      const card = e.currentTarget;
      const category = card.getAttribute('data-category');
      
      if (!category) {
        throw new Error('Card category not found');
      }
      
      // Add click animation
      this.animateCardClick(card);
      
      // Navigate to link
      this.navigateToCategory(category, card);
      
    } catch (error) {
      handleError(error, 'CardManager.handleCardClick');
    }
  }
  
  handleCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleCardClick(e);
    }
  }
  
  animateCardClick(card) {
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  }
  
  navigateToCategory(category, cardElement) {
    try {
      const categoryData = this.linksConfig.categories[category.toLowerCase()];
      
      if (!categoryData) {
        console.warn(`No configuration found for category: ${category}`);
        return;
      }
      
      const url = categoryData.url;
      
      if (!url) {
        console.warn(`No URL found for category: ${category}`);
        return;
      }
      
      if (!isValidUrl(url)) {
        console.warn(`Invalid URL for category ${category}: ${url}`);
        return;
      }
      
      // Open link with proper security attributes
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      
      // Dispatch custom event for analytics/tracking
      document.dispatchEvent(new CustomEvent('cardNavigation', {
        detail: {
          category,
          url,
          title: categoryData.title,
          element: cardElement
        }
      }));
      
    } catch (error) {
      handleError(error, 'CardManager.navigateToCategory');
    }
  }
  
  // Dynamic card creation
  createCard(categoryKey, categoryData) {
    try {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-category', categoryKey);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${categoryData.title}. ${categoryData.description}`);
      
      card.innerHTML = `
        <div class="card-icon ${categoryData.color}">
          <i class="${categoryData.icon}"></i>
        </div>
        <div class="card-content">
          <h3 class="card-title">${categoryData.title}</h3>
          <p class="card-description">${categoryData.description}</p>
        </div>
        <button class="favorite-btn" title="Agregar a favoritos">
          <i class="far fa-heart"></i>
        </button>
        <div class="card-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      `;
      
      // Add event listeners
      card.addEventListener('click', this.handleCardClick.bind(this));
      card.addEventListener('keydown', this.handleCardKeydown.bind(this));
      
      // Add favorite button handler
      const favoriteBtn = card.querySelector('.favorite-btn');
      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.favoritesManager?.toggleFavorite(favoriteBtn);
        });
      }
      
      return card;
      
    } catch (error) {
      handleError(error, 'CardManager.createCard');
      return null;
    }
  }
  
  addCard(categoryKey, categoryData) {
    try {
      const card = this.createCard(categoryKey, categoryData);
      
      if (card && this.cardsGrid) {
        this.cardsGrid.appendChild(card);
        this.cards = document.querySelectorAll('.card');
        
        // Refresh other managers
        window.favoritesManager?.refresh();
        window.searchManager?.refresh();
        
        return card;
      }
      
      return null;
      
    } catch (error) {
      handleError(error, 'CardManager.addCard');
      return null;
    }
  }
  
  removeCard(categoryKey) {
    try {
      const card = document.querySelector(`[data-category="${categoryKey}"]`);
      
      if (card) {
        card.remove();
        this.cards = document.querySelectorAll('.card');
        
        // Refresh other managers
        window.favoritesManager?.refresh();
        window.searchManager?.refresh();
        
        return true;
      }
      
      return false;
      
    } catch (error) {
      handleError(error, 'CardManager.removeCard');
      return false;
    }
  }
  
  // Keyboard navigation
  focusCard(direction) {
    const focusedCard = document.activeElement;
    
    if (!focusedCard || !focusedCard.classList.contains('card')) {
      // Focus first visible card
      const firstCard = document.querySelector('.card:not([style*="display: none"])');
      firstCard?.focus();
      return;
    }
    
    const visibleCards = Array.from(document.querySelectorAll('.card:not([style*="display: none"])'));
    const currentIndex = visibleCards.indexOf(focusedCard);
    
    let nextIndex;
    
    switch (direction) {
      case 'next':
        nextIndex = (currentIndex + 1) % visibleCards.length;
        break;
      case 'previous':
        nextIndex = currentIndex === 0 ? visibleCards.length - 1 : currentIndex - 1;
        break;
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = visibleCards.length - 1;
        break;
      default:
        return;
    }
    
    visibleCards[nextIndex]?.focus();
  }
  
  // Public API
  getCards() {
    return Array.from(this.cards);
  }
  
  getVisibleCards() {
    return Array.from(document.querySelectorAll('.card:not([style*="display: none"])'));
  }
  
  getCardByCategory(category) {
    return document.querySelector(`[data-category="${category}"]`);
  }
  
  refresh() {
    this.cards = document.querySelectorAll('.card');
    this.bindEvents();
    this.setupAccessibility();
  }
}

export default CardManager;
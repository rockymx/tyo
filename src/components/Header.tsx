'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useSearch } from '@/contexts/SearchContext';
import { useDebounce } from '@/hooks/useDebounce';
import { scrollToTop } from '@/lib/utils';

interface HeaderProps {
  onPromoClick: () => void;
}

export default function Header({ onPromoClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { searchTerm, setSearchTerm } = useSearch();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showingFavorites, setShowingFavorites] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchExpanded(false);
  };

  const toggleFavoritesView = () => {
    setShowingFavorites(!showingFavorites);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 
            className="title clickable-title" 
            onClick={scrollToTop}
            title="Volver al inicio"
          >
            TyO
          </h1>
        </div>
        
        <div className="header-center">
          {/* Search Bar in Header */}
          <div className={`header-search ${isSearchExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="search-box" onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}>
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Buscar categorías..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              {searchTerm && (
                <button 
                  className="clear-btn" 
                  onClick={clearSearch}
                  type="button"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          
          {/* Social Links */}
          <div className="social-links">
            <a 
              href="#" 
              className="social-link facebook" 
              title="Facebook" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://wa.link/s5xddq" 
              className="social-link whatsapp" 
              title="WhatsApp" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
        
        <div className="header-right">
          {/* Promotion Button */}
          <button 
            className="promo-button" 
            onClick={onPromoClick}
            title="¡Oferta Especial!"
          >
            <i className="fas fa-gift"></i>
            <span className="promo-text">Promoción</span>
          </button>
          
          {/* Favorites Button */}
          <button 
            className="favorites-toggle" 
            onClick={toggleFavoritesView}
            title={showingFavorites ? "Mostrar todos" : "Ver favoritos"}
            style={{ color: showingFavorites ? 'var(--danger)' : '' }}
          >
            <i className="fas fa-heart"></i>
            {favorites.length > 0 && (
              <span className="favorites-count">
                {favorites.length}
              </span>
            )}
          </button>
          
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
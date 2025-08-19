'use client';

import React from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { CategoryData } from '@/types';
import { isValidUrl, addAnimation } from '@/lib/utils';

interface CardProps {
  category: string;
  data: CategoryData;
}

export default function Card({ category, data }: CardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isCardFavorite = isFavorite(category);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isValidUrl(data.url)) {
      console.warn(`Invalid URL for category ${category}: ${data.url}`);
      return;
    }

    // Add click animation
    const card = e.currentTarget as HTMLElement;
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);

    // Open link with proper security attributes
    window.open(data.url, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const button = e.currentTarget as HTMLElement;
    
    // Add heart animation
    if (!isCardFavorite) {
      await addAnimation(button, 'heartbeat', 300);
    }
    
    toggleFavorite(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e as any);
    }
  };

  return (
    <div 
      className={`card ${category === 'solicitar acceso' ? 'cta-card' : ''}`}
      data-category={category}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${data.title}. ${data.description}`}
    >
      <div className={`card-icon ${data.color}`}>
        <i className={data.icon}></i>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{data.title}</h3>
        <p className="card-description">{data.description}</p>
      </div>
      
      <button 
        className={`favorite-btn ${isCardFavorite ? 'favorited' : ''}`}
        onClick={handleFavoriteClick}
        title={isCardFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-label={isCardFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <i className={isCardFavorite ? 'fas fa-heart' : 'far fa-heart'}></i>
      </button>
      
      <div className="card-arrow">
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
  );
}
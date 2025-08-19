'use client';

import React, { useMemo } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useDebounce } from '@/hooks/useDebounce';
import Card from './Card';
import NoResults from './NoResults';
import { LinksConfig } from '@/types';

interface CardsGridProps {
  linksConfig: LinksConfig;
  showingFavorites: boolean;
}

export default function CardsGrid({ linksConfig, showingFavorites }: CardsGridProps) {
  const { searchTerm } = useSearch();
  const { favorites } = useFavorites();
  const debouncedSearchTerm = useDebounce(searchTerm.toLowerCase().trim(), 300);

  const filteredCategories = useMemo(() => {
    const categories = Object.entries(linksConfig.categories);
    
    let filtered = categories;

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(([category, data]) => {
        return (
          category.toLowerCase().includes(debouncedSearchTerm) ||
          data.title.toLowerCase().includes(debouncedSearchTerm) ||
          data.description.toLowerCase().includes(debouncedSearchTerm)
        );
      });
    }

    // Apply favorites filter
    if (showingFavorites) {
      filtered = filtered.filter(([category]) => favorites.includes(category));
    }

    return filtered;
  }, [linksConfig.categories, debouncedSearchTerm, showingFavorites, favorites]);

  const shouldShowNoResults = filteredCategories.length === 0 && (debouncedSearchTerm || showingFavorites);

  if (shouldShowNoResults) {
    let message;
    
    if (showingFavorites && favorites.length === 0) {
      message = {
        icon: 'fas fa-heart',
        title: 'No tienes favoritos',
        description: 'Agrega categorías a favoritos haciendo clic en el corazón'
      };
    } else if (showingFavorites && debouncedSearchTerm) {
      message = {
        icon: 'fas fa-search',
        title: 'No se encontraron favoritos',
        description: `No hay favoritos que coincidan con "${debouncedSearchTerm}"`
      };
    } else {
      message = {
        icon: 'fas fa-search',
        title: 'No se encontraron resultados',
        description: 'Intenta con otro término de búsqueda'
      };
    }
    
    return <NoResults {...message} />;
  }

  return (
    <div className="cards-grid" id="cardsGrid">
      {filteredCategories.map(([category, data], index) => (
        <Card
          key={category}
          category={category}
          data={data}
        />
      ))}
    </div>
  );
}
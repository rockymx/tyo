'use client';

import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FavoritesContextType } from '@/types';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  const addFavorite = (category: string) => {
    if (!favorites.includes(category)) {
      setFavorites([...favorites, category]);
    }
  };

  const removeFavorite = (category: string) => {
    setFavorites(favorites.filter(fav => fav !== category));
  };

  const isFavorite = (category: string) => {
    return favorites.includes(category);
  };

  const toggleFavorite = (category: string) => {
    if (isFavorite(category)) {
      removeFavorite(category);
    } else {
      addFavorite(category);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
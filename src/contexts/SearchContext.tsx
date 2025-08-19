'use client';

import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SearchContextType, SearchHistoryItem } from '@/types';

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>('searchHistory', []);

  const addToHistory = (term: string) => {
    if (!term.trim()) return;
    
    const newItem: SearchHistoryItem = {
      term: term.trim(),
      timestamp: Date.now()
    };
    
    // Remove existing entry if it exists
    const filteredHistory = searchHistory.filter(item => item.term !== newItem.term);
    
    // Add to beginning and limit to 10 items
    const updatedHistory = [newItem, ...filteredHistory].slice(0, 10);
    setSearchHistory(updatedHistory);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchHistory,
      addToHistory,
      clearHistory
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
export interface CategoryData {
  title: string;
  description: string;
  icon: string;
  color: string;
  url: string;
}

export interface LinksConfig {
  categories: Record<string, CategoryData>;
}

export interface FavoriteItem {
  category: string;
  timestamp: number;
}

export interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface FavoritesContextType {
  favorites: string[];
  addFavorite: (category: string) => void;
  removeFavorite: (category: string) => void;
  isFavorite: (category: string) => boolean;
  toggleFavorite: (category: string) => void;
  clearFavorites: () => void;
}

export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchHistory: SearchHistoryItem[];
  addToHistory: (term: string) => void;
  clearHistory: () => void;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultCategory?: string;
  quotesPerPage: number;
}

export interface Quote {
  id: string;
  userId: string;
  text: string;
  author: string;
  source?: string;
  chapter?: string;
  page?: string;
  dateCaptured: string;
  lesson?: string;
  reflection?: string;
  categoryId?: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  visibility: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  quoteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface QuoteFilters {
  search: string;
  author: string;
  source: string;
  categoryId: string;
  tags: string[];
  dateFrom: string;
  dateTo: string;
  favoritesOnly: boolean;
  archivedOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'author' | 'source';
}

export interface DashboardStats {
  totalQuotes: number;
  totalFavorites: number;
  totalCategories: number;
  totalTags: number;
  totalAuthors: number;
  totalSources: number;
  quotesThisMonth: number;
  quotesThisWeek: number;
}

export type AuthView = 'welcome' | 'login' | 'signup' | 'forgot-password' | 'verify-email';

export type AppView = 'dashboard' | 'quotes' | 'quote-detail' | 'quote-form' | 'categories' | 'tags' | 'search' | 'profile' | 'settings';

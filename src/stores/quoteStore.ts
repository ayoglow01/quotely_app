import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Quote, Category, Tag, QuoteFilters, DashboardStats } from '../types';

const DEFAULT_CATEGORIES: Omit<Category, 'userId'>[] = [
  { id: 'cat-1', name: 'Leadership', color: '#4c6ef5', quoteCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Philosophy', color: '#7950f2', quoteCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Personal Growth', color: '#10b981', quoteCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Business', color: '#f59e0b', quoteCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Faith', color: '#ec4899', quoteCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Technology', color: '#06b6d4', quoteCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-7', name: 'Relationships', color: '#f43f5e', quoteCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

interface QuoteState {
  quotes: Quote[];
  categories: Category[];
  tags: Tag[];
  filters: QuoteFilters;
  selectedQuoteId: string | null;
  initialized: Record<string, boolean>;

  // Actions
  initializeForUser: (userId: string) => void;
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;

  addCategory: (userId: string, name: string, color: string) => string;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addTag: (userId: string, name: string) => string;
  deleteTag: (id: string) => void;

  setFilters: (filters: Partial<QuoteFilters>) => void;
  resetFilters: () => void;
  setSelectedQuote: (id: string | null) => void;

  // Computed
  getFilteredQuotes: (userId: string) => Quote[];
  getUserCategories: (userId: string) => Category[];
  getUserTags: (userId: string) => Tag[];
  getStats: (userId: string) => DashboardStats;
  getRecentQuotes: (userId: string, limit?: number) => Quote[];
  getFavoriteQuotes: (userId: string, limit?: number) => Quote[];
  getQuoteById: (id: string) => Quote | undefined;
  getUniqueAuthors: (userId: string) => string[];
  getUniqueSources: (userId: string) => string[];
}

const defaultFilters: QuoteFilters = {
  search: '',
  author: '',
  source: '',
  categoryId: '',
  tags: [],
  dateFrom: '',
  dateTo: '',
  favoritesOnly: false,
  archivedOnly: false,
  sortBy: 'newest',
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      quotes: [],
      categories: [],
      tags: [],
      filters: { ...defaultFilters },
      selectedQuoteId: null,
      initialized: {},

      initializeForUser: (userId: string) => {
        const { initialized, categories } = get();
        if (initialized[userId]) return;

        const userCats = categories.filter((c) => c.userId === userId);
        if (userCats.length === 0) {
          const newCats = DEFAULT_CATEGORIES.map((c) => ({ ...c, userId }));
          set({
            categories: [...categories, ...newCats],
            initialized: { ...initialized, [userId]: true },
          });
        } else {
          set({ initialized: { ...initialized, [userId]: true } });
        }
      },

      addQuote: (quote) => {
        const id = nanoid();
        const now = new Date().toISOString();
        const newQuote: Quote = { ...quote, id, createdAt: now, updatedAt: now };
        set((s) => ({ quotes: [newQuote, ...s.quotes] }));
        return id;
      },

      updateQuote: (id, updates) => {
        set((s) => ({
          quotes: s.quotes.map((q) =>
            q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },

      deleteQuote: (id) => {
        set((s) => ({ quotes: s.quotes.filter((q) => q.id !== id) }));
      },

      toggleFavorite: (id) => {
        set((s) => ({
          quotes: s.quotes.map((q) =>
            q.id === id ? { ...q, isFavorite: !q.isFavorite, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },

      toggleArchive: (id) => {
        set((s) => ({
          quotes: s.quotes.map((q) =>
            q.id === id ? { ...q, isArchived: !q.isArchived, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },

      addCategory: (userId, name, color) => {
        const id = nanoid();
        const now = new Date().toISOString();
        const cat: Category = { id, userId, name, color, quoteCount: 0, createdAt: now, updatedAt: now };
        set((s) => ({ categories: [...s.categories, cat] }));
        return id;
      },

      updateCategory: (id, updates) => {
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          quotes: s.quotes.map((q) => (q.categoryId === id ? { ...q, categoryId: undefined } : q)),
        }));
      },

      addTag: (userId, name) => {
        const { tags } = get();
        const existing = tags.find(
          (t) => t.userId === userId && t.name.toLowerCase() === name.toLowerCase()
        );
        if (existing) return existing.id;

        const id = nanoid();
        const tag: Tag = { id, userId, name: name.toLowerCase(), createdAt: new Date().toISOString() };
        set((s) => ({ tags: [...s.tags, tag] }));
        return id;
      },

      deleteTag: (id) => {
        const { tags } = get();
        const tag = tags.find((t) => t.id === id);
        if (!tag) return;
        set((s) => ({
          tags: s.tags.filter((t) => t.id !== id),
          quotes: s.quotes.map((q) => ({
            ...q,
            tags: q.tags.filter((t) => t !== tag.name),
          })),
        }));
      },

      setFilters: (filters) => {
        set((s) => ({ filters: { ...s.filters, ...filters } }));
      },

      resetFilters: () => {
        set({ filters: { ...defaultFilters } });
      },

      setSelectedQuote: (id) => set({ selectedQuoteId: id }),

      getFilteredQuotes: (userId) => {
        const { quotes, filters } = get();
        let result = quotes.filter((q) => q.userId === userId);

        if (filters.archivedOnly) {
          result = result.filter((q) => q.isArchived);
        } else {
          result = result.filter((q) => !q.isArchived);
        }

        if (filters.favoritesOnly) {
          result = result.filter((q) => q.isFavorite);
        }

        if (filters.search) {
          const s = filters.search.toLowerCase();
          result = result.filter(
            (q) =>
              q.text.toLowerCase().includes(s) ||
              q.author.toLowerCase().includes(s) ||
              (q.source && q.source.toLowerCase().includes(s)) ||
              (q.lesson && q.lesson.toLowerCase().includes(s)) ||
              (q.reflection && q.reflection.toLowerCase().includes(s)) ||
              q.tags.some((t) => t.toLowerCase().includes(s))
          );
        }

        if (filters.author) {
          result = result.filter((q) => q.author === filters.author);
        }

        if (filters.source) {
          result = result.filter((q) => q.source === filters.source);
        }

        if (filters.categoryId) {
          result = result.filter((q) => q.categoryId === filters.categoryId);
        }

        if (filters.tags.length > 0) {
          result = result.filter((q) =>
            filters.tags.some((ft) => q.tags.includes(ft))
          );
        }

        if (filters.dateFrom) {
          result = result.filter((q) => q.dateCaptured >= filters.dateFrom);
        }

        if (filters.dateTo) {
          result = result.filter((q) => q.dateCaptured <= filters.dateTo);
        }

        switch (filters.sortBy) {
          case 'newest':
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'oldest':
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'author':
            result.sort((a, b) => a.author.localeCompare(b.author));
            break;
          case 'source':
            result.sort((a, b) => (a.source || '').localeCompare(b.source || ''));
            break;
        }

        return result;
      },

      getUserCategories: (userId) => {
        const { categories, quotes } = get();
        return categories
          .filter((c) => c.userId === userId)
          .map((c) => ({
            ...c,
            quoteCount: quotes.filter((q) => q.categoryId === c.id && !q.isArchived).length,
          }));
      },

      getUserTags: (userId) => {
        return get().tags.filter((t) => t.userId === userId);
      },

      getStats: (userId) => {
        const { quotes, categories, tags } = get();
        const userQuotes = quotes.filter((q) => q.userId === userId && !q.isArchived);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const authors = new Set(userQuotes.map((q) => q.author));
        const sources = new Set(userQuotes.filter((q) => q.source).map((q) => q.source));

        return {
          totalQuotes: userQuotes.length,
          totalFavorites: userQuotes.filter((q) => q.isFavorite).length,
          totalCategories: categories.filter((c) => c.userId === userId).length,
          totalTags: tags.filter((t) => t.userId === userId).length,
          totalAuthors: authors.size,
          totalSources: sources.size,
          quotesThisMonth: userQuotes.filter((q) => new Date(q.createdAt) >= startOfMonth).length,
          quotesThisWeek: userQuotes.filter((q) => new Date(q.createdAt) >= startOfWeek).length,
        };
      },

      getRecentQuotes: (userId, limit = 5) => {
        return get()
          .quotes.filter((q) => q.userId === userId && !q.isArchived)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },

      getFavoriteQuotes: (userId, limit = 5) => {
        return get()
          .quotes.filter((q) => q.userId === userId && q.isFavorite && !q.isArchived)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, limit);
      },

      getQuoteById: (id) => {
        return get().quotes.find((q) => q.id === id);
      },

      getUniqueAuthors: (userId) => {
        const authors = new Set(
          get()
            .quotes.filter((q) => q.userId === userId && !q.isArchived)
            .map((q) => q.author)
        );
        return Array.from(authors).sort();
      },

      getUniqueSources: (userId) => {
        const sources = new Set(
          get()
            .quotes.filter((q) => q.userId === userId && !q.isArchived && q.source)
            .map((q) => q.source!)
        );
        return Array.from(sources).sort();
      },
    }),
    {
      name: 'quotely-quotes',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppView } from '../types';

type Theme = 'light' | 'dark';

interface AppState {
  currentView: AppView;
  editingQuoteId: string | null;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  theme: Theme;

  setView: (view: AppView) => void;
  setEditingQuote: (id: string | null) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setSearchOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: 'dashboard',
      editingQuoteId: null,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      toast: null,
      theme: 'light',

      setView: (view) => set({ currentView: view, isMobileMenuOpen: false, editingQuoteId: null }),
      setEditingQuote: (id) => set({ editingQuoteId: id, currentView: 'quote-form' }),
      toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3000);
      },
      clearToast: () => set({ toast: null }),
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'quotely-app',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

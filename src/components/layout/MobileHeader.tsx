import { BookOpen, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import type { AppView } from '../../types';

const VIEW_TITLES: Record<AppView, string> = {
  dashboard: 'Quotely',
  quotes: 'Quotes',
  'quote-detail': 'Quote',
  'quote-form': 'New Quote',
  categories: 'Categories',
  tags: 'Tags',
  search: 'Search',
  profile: 'Profile',
  settings: 'Settings',
};

const BACK_VIEWS: Partial<Record<AppView, AppView>> = {
  'quote-detail': 'quotes',
  'quote-form': 'quotes',
  profile: 'dashboard',
};

export function MobileHeader() {
  const { currentView, setView, theme, toggleTheme } = useAppStore();
  const { user } = useAuthStore();

  const title = VIEW_TITLES[currentView] || 'Quotely';
  const backView = BACK_VIEWS[currentView];
  const isHome = currentView === 'dashboard';

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {backView ? (
          <button
            onClick={() => setView(backView)}
            className="p-1 -ml-1 rounded-lg text-surface-500"
          >
            <ArrowLeft size={20} />
          </button>
        ) : isHome ? (
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
        ) : null}
        <span className="text-base font-bold text-surface-900">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center text-surface-500 hover:bg-surface-100 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          onClick={() => setView('profile')}
          className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm"
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </button>
      </div>
    </header>
  );
}

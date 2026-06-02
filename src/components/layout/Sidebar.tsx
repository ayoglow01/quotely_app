import {
  LayoutDashboard,
  Quote,
  FolderOpen,
  Tags,
  Search,
  Settings,
  LogOut,
  BookOpen,
  Plus,
  Moon,
  Sun,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils/cn';
import type { AppView } from '../../types';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  view: AppView;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
  { icon: Quote, label: 'Quotes', view: 'quotes' },
  { icon: FolderOpen, label: 'Categories', view: 'categories' },
  { icon: Tags, label: 'Tags', view: 'tags' },
  { icon: Search, label: 'Search', view: 'search' },
];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', view: 'settings' },
];

export function Sidebar() {
  const { currentView, setView, theme, toggleTheme } = useAppStore();
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-surface-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-surface-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-surface-900 tracking-tight">Quotely</span>
      </div>

      {/* Quick Add */}
      <div className="px-4 py-4">
        <button
          onClick={() => setView('quote-form')}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Quote
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-surface-100 space-y-0.5">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-surface-100">
        <button
          onClick={() => setView('profile')}
          className="flex items-center gap-3 w-full"
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
            <p className="text-xs text-surface-500 truncate">{user?.email}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

import {
  LayoutDashboard,
  Quote,
  Plus,
  Search,
  Settings,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { cn } from '../../utils/cn';
import type { AppView } from '../../types';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  view: AppView;
}

const mobileNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Home', view: 'dashboard' },
  { icon: Quote, label: 'Quotes', view: 'quotes' },
  { icon: Search, label: 'Search', view: 'search' },
  { icon: Settings, label: 'Settings', view: 'settings' },
];

export function MobileNav() {
  const { currentView, setView } = useAppStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {mobileNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          // Insert the FAB in the middle
          if (index === 2) {
            return (
              <div key="fab-and-item" className="contents">
                <button
                  key="fab"
                  onClick={() => setView('quote-form')}
                  className="w-12 h-12 -mt-5 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-600/30 active:scale-95 transition-transform"
                >
                  <Plus size={22} />
                </button>
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 py-2 px-3 transition-colors',
                    isActive ? 'text-brand-600' : 'text-surface-400'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 px-3 transition-colors',
                isActive ? 'text-brand-600' : 'text-surface-400'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

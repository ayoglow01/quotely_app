import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import {
  User,
  FolderOpen,
  Tags,
  LogOut,
  Trash2,
  Shield,
  Info,
  ChevronRight,
  BookOpen,
  Moon,
  Sun,
} from 'lucide-react';

export function SettingsView() {
  const { user, logout } = useAuthStore();
  const { quotes } = useQuoteStore();
  const { setView, showToast, theme, setTheme } = useAppStore();

  const userQuotes = quotes.filter((q) => q.userId === user?.id);

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: { name: user?.name, email: user?.email },
      quotes: userQuotes,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotely-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure you want to delete ALL your quotes? This cannot be undone.'
      )
    ) {
      userQuotes.forEach((q) => useQuoteStore.getState().deleteQuote(q.id));
      showToast('All quotes deleted', 'info');
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      description: 'Manage your account details',
      onClick: () => setView('profile'),
    },
    {
      icon: FolderOpen,
      label: 'Categories',
      description: 'Organize your quotes by topic',
      onClick: () => setView('categories'),
    },
    {
      icon: Tags,
      label: 'Tags',
      description: 'Manage your tag library',
      onClick: () => setView('tags'),
    },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-500">Manage your Quotely experience</p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-xl border border-surface-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-xl font-bold text-brand-700">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-surface-900">{user?.name}</p>
            <p className="text-sm text-surface-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl border border-surface-200 divide-y divide-surface-100">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center text-surface-600">
                <Icon size={17} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-surface-900">{item.label}</p>
                <p className="text-xs text-surface-500">{item.description}</p>
              </div>
              <ChevronRight size={16} className="text-surface-300" />
            </button>
          );
        })}
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-semibold text-surface-900">Appearance</h3>
        <p className="text-xs text-surface-500">Choose your preferred theme</p>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'border-brand-500 bg-brand-50'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <Sun size={20} className={theme === 'light' ? 'text-brand-600' : 'text-surface-400'} />
            <div className="text-center sm:text-left">
              <p className={`text-sm font-medium ${theme === 'light' ? 'text-brand-700' : 'text-surface-700'}`}>
                Light
              </p>
              <p className="text-xs text-surface-500 hidden sm:block">Default theme</p>
            </div>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'border-brand-500 bg-brand-50'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <Moon size={20} className={theme === 'dark' ? 'text-brand-600' : 'text-surface-400'} />
            <div className="text-center sm:text-left">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-brand-700' : 'text-surface-700'}`}>
                Dark
              </p>
              <p className="text-xs text-surface-500 hidden sm:block">Easy on eyes</p>
            </div>
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl border border-surface-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-surface-900">Data</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleExportData}
            icon={<BookOpen size={15} />}
          >
            Export All Data (JSON)
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleClearData}
            icon={<Trash2 size={15} />}
          >
            Delete All Quotes
          </Button>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-white rounded-xl border border-surface-200 p-5">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-surface-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-1">Privacy & Security</h3>
            <p className="text-xs text-surface-500 leading-relaxed">
              All your data is stored locally in your browser. Your quotes, reflections, and personal
              wisdom remain completely private. No data is sent to external servers.
            </p>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="space-y-3 pb-20 md:pb-4">
        <Button
          variant="outline"
          className="w-full"
          icon={<LogOut size={16} />}
          onClick={logout}
        >
          Sign Out
        </Button>

        {/* App Info */}
        <div className="text-center pt-4">
          <div className="flex items-center justify-center gap-2 text-surface-400 mb-1">
            <Info size={14} />
            <span className="text-xs">Quotely v1.0.0</span>
          </div>
          <p className="text-xs text-surface-400">Your Personal Wisdom Archive</p>
        </div>
      </div>
    </div>
  );
}

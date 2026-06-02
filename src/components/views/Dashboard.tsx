import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import {
  Quote,
  Heart,
  FolderOpen,
  Tags,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { QuoteCard } from '../quotes/QuoteCard';

export function Dashboard() {
  const { user } = useAuthStore();
  const { getStats, getRecentQuotes, getFavoriteQuotes } = useQuoteStore();
  const { setView } = useAppStore();

  const userId = user?.id || '';
  const stats = getStats(userId);
  const recentQuotes = getRecentQuotes(userId, 3);
  const favoriteQuotes = getFavoriteQuotes(userId, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    { label: 'Total Quotes', value: stats.totalQuotes, icon: Quote, color: 'bg-brand-50 text-brand-600' },
    { label: 'Favorites', value: stats.totalFavorites, icon: Heart, color: 'bg-rose-50 text-rose-600' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: 'bg-amber-50 text-amber-600' },
    { label: 'Authors', value: stats.totalAuthors, icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Sources', value: stats.totalSources, icon: BookOpen, color: 'bg-violet-50 text-violet-600' },
    { label: 'Tags', value: stats.totalTags, icon: Tags, color: 'bg-cyan-50 text-cyan-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            {stats.totalQuotes === 0
              ? 'Start capturing wisdom from your readings and experiences.'
              : `You've collected ${stats.totalQuotes} piece${stats.totalQuotes !== 1 ? 's' : ''} of wisdom so far.`}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setView('quote-form')}>
          New Quote
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-surface-200 p-3 sm:p-4 hover:shadow-sm transition-shadow"
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${stat.color} flex items-center justify-center mb-2 sm:mb-3`}>
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-surface-900">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-surface-500 mt-0.5 truncate">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Activity Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-surface-700">This Week</span>
          </div>
          <p className="text-3xl font-bold text-surface-900">{stats.quotesThisWeek}</p>
          <p className="text-xs text-surface-500 mt-0.5">quotes captured</p>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-brand-500" />
            <span className="text-sm font-medium text-surface-700">This Month</span>
          </div>
          <p className="text-3xl font-bold text-surface-900">{stats.quotesThisMonth}</p>
          <p className="text-xs text-surface-500 mt-0.5">quotes captured</p>
        </div>
      </div>

      {/* Empty State */}
      {stats.totalQuotes === 0 && (
        <div className="bg-gradient-to-br from-brand-50 to-violet-50 rounded-2xl p-8 text-center border border-brand-100">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-7 h-7 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            Start Your Wisdom Journey
          </h3>
          <p className="text-sm text-surface-600 max-w-md mx-auto mb-6">
            Capture your first quote along with your personal reflections and lessons learned. 
            Every great collection starts with a single insight.
          </p>
          <Button onClick={() => setView('quote-form')} icon={<Plus size={16} />}>
            Add Your First Quote
          </Button>
        </div>
      )}

      {/* Recent Quotes */}
      {recentQuotes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Recent Quotes</h2>
            <button
              onClick={() => setView('quotes')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} compact />
            ))}
          </div>
        </section>
      )}

      {/* Favorite Quotes */}
      {favoriteQuotes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">
              <Heart size={16} className="inline mr-1.5 text-rose-500" />
              Favorites
            </h2>
          </div>
          <div className="space-y-3">
            {favoriteQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

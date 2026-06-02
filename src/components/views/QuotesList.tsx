import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { QuoteCard } from '../quotes/QuoteCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Quote,
  X,
} from 'lucide-react';

export function QuotesList() {
  const { user } = useAuthStore();
  const { getFilteredQuotes, filters, setFilters, resetFilters, getUserCategories, getUniqueAuthors, getUniqueSources } =
    useQuoteStore();
  const { setView } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  const userId = user?.id || '';
  const quotes = getFilteredQuotes(userId);
  const categories = getUserCategories(userId);
  const authors = getUniqueAuthors(userId);
  const sources = getUniqueSources(userId);

  const hasActiveFilters =
    filters.author || filters.source || filters.categoryId || filters.favoritesOnly || filters.archivedOnly;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900">
            {filters.archivedOnly ? 'Archived Quotes' : filters.favoritesOnly ? 'Favorite Quotes' : 'All Quotes'}
          </h1>
          <p className="text-sm text-surface-500">
            {quotes.length} quote{quotes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setView('quote-form')}>
          New Quote
        </Button>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search quotes, authors, sources, lessons..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-300 bg-white text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'border-brand-300 bg-brand-50 text-brand-600'
              : 'border-surface-300 bg-white text-surface-500 hover:text-surface-700'
          }`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-surface-200 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Author"
              options={[{ value: '', label: 'All Authors' }, ...authors.map((a) => ({ value: a, label: a }))]}
              value={filters.author}
              onChange={(e) => setFilters({ author: e.target.value })}
            />
            <Select
              label="Source"
              options={[{ value: '', label: 'All Sources' }, ...sources.map((s) => ({ value: s, label: s }))]}
              value={filters.source}
              onChange={(e) => setFilters({ source: e.target.value })}
            />
            <Select
              label="Category"
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={filters.categoryId}
              onChange={(e) => setFilters({ categoryId: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Sort By"
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'author', label: 'Author A-Z' },
                { value: 'source', label: 'Source A-Z' },
              ]}
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value as 'newest' | 'oldest' | 'author' | 'source' })}
            />
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.favoritesOnly}
                  onChange={(e) => setFilters({ favoritesOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-surface-700">Favorites only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.archivedOnly}
                  onChange={(e) => setFilters({ archivedOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-surface-700">Archived</span>
              </label>
            </div>
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quotes List */}
      {quotes.length === 0 ? (
        <EmptyState
          icon={filters.search || hasActiveFilters ? <Search size={28} /> : <Quote size={28} />}
          title={filters.search || hasActiveFilters ? 'No quotes found' : 'No quotes yet'}
          description={
            filters.search || hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Start building your wisdom archive by adding your first quote.'
          }
          action={
            filters.search || hasActiveFilters
              ? { label: 'Clear Filters', onClick: resetFilters }
              : { label: 'Add Quote', onClick: () => setView('quote-form') }
          }
        />
      ) : (
        <div className="space-y-3 pb-20 md:pb-4">
          {quotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
}

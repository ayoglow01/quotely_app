import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { QuoteCard } from '../quotes/QuoteCard';
import { EmptyState } from '../ui/EmptyState';
import { Search, X } from 'lucide-react';

export function SearchView() {
  const { user } = useAuthStore();
  const { quotes } = useQuoteStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const userId = user?.id || '';

  const results = query.trim()
    ? quotes.filter((q) => {
        if (q.userId !== userId || q.isArchived) return false;
        const s = query.toLowerCase();
        return (
          q.text.toLowerCase().includes(s) ||
          q.author.toLowerCase().includes(s) ||
          (q.source && q.source.toLowerCase().includes(s)) ||
          (q.lesson && q.lesson.toLowerCase().includes(s)) ||
          (q.reflection && q.reflection.toLowerCase().includes(s)) ||
          q.tags.some((t) => t.toLowerCase().includes(s))
        );
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Search</h1>
        <p className="text-sm text-surface-500">Find quotes across your entire collection</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by text, author, source, lesson, reflection, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-surface-300 bg-white text-base placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results */}
      {query.trim() ? (
        results.length > 0 ? (
          <div className="space-y-3 pb-20 md:pb-4">
            <p className="text-sm text-surface-500">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            {results.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search size={28} />}
            title="No results found"
            description={`No quotes match "${query}". Try a different search term.`}
          />
        )
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-surface-300" />
          </div>
          <p className="text-sm text-surface-500">
            Start typing to search your wisdom archive
          </p>
        </div>
      )}
    </div>
  );
}

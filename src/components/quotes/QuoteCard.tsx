import { Heart, MoreHorizontal, Archive, Trash2, Edit, Eye, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import type { Quote } from '../../types';
import { format } from 'date-fns';

interface QuoteCardProps {
  quote: Quote;
  compact?: boolean;
}

export function QuoteCard({ quote, compact = false }: QuoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { toggleFavorite, toggleArchive, deleteQuote, getUserCategories } = useQuoteStore();
  const { setView, setEditingQuote, showToast } = useAppStore();

  const categories = getUserCategories(quote.userId);
  const category = categories.find((c) => c.id === quote.categoryId);

  const handleView = () => {
    useQuoteStore.getState().setSelectedQuote(quote.id);
    setView('quote-detail');
  };

  const handleEdit = () => {
    setEditingQuote(quote.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      deleteQuote(quote.id);
      showToast('Quote deleted');
    }
    setShowMenu(false);
  };

  const handleToggleArchive = () => {
    toggleArchive(quote.id);
    showToast(quote.isArchived ? 'Quote restored' : 'Quote archived');
    setShowMenu(false);
  };

  return (
    <div
      className={cn(
        'group bg-white rounded-xl border border-surface-200 hover:border-surface-300 hover:shadow-sm transition-all duration-200',
        compact ? 'p-4' : 'p-5'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {category && (
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
          )}
          <span className="text-sm font-medium text-surface-900 truncate">{quote.author}</span>
          {quote.source && (
            <span className="text-xs text-surface-500 truncate hidden sm:flex items-center gap-1">
              <span className="text-surface-300">·</span>
              <BookOpen size={12} />
              {quote.source}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => {
              toggleFavorite(quote.id);
            }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              quote.isFavorite
                ? 'text-rose-500 hover:bg-rose-50'
                : 'text-surface-400 hover:text-rose-500 hover:bg-rose-50 md:opacity-0 md:group-hover:opacity-100'
            )}
          >
            <Heart size={18} fill={quote.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
            >
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-surface-200 rounded-lg shadow-lg py-1 w-40">
                  <button
                    onClick={handleView}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={handleToggleArchive}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                  >
                    <Archive size={14} /> {quote.isArchived ? 'Restore' : 'Archive'}
                  </button>
                  <hr className="my-1 border-surface-100" />
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quote Text */}
      <button onClick={handleView} className="text-left w-full">
        <p
          className={cn(
            'quote-text text-surface-800 leading-relaxed',
            compact ? 'text-base line-clamp-2' : 'text-lg line-clamp-4'
          )}
        >
          "{quote.text}"
        </p>
      </button>

      {/* Lesson (if exists and not compact) */}
      {!compact && quote.lesson && (
        <div className="mt-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
          <p className="text-xs font-medium text-amber-700 mb-1">💡 Lesson</p>
          <p className="text-sm text-amber-900 line-clamp-2">{quote.lesson}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-surface-100">
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          {quote.tags.slice(0, compact ? 2 : 3).map((tag) => (
            <Badge key={tag} size="sm">{tag}</Badge>
          ))}
          {quote.tags.length > (compact ? 2 : 3) && (
            <Badge size="sm" variant="brand">+{quote.tags.length - (compact ? 2 : 3)}</Badge>
          )}
        </div>
        <span className="text-xs text-surface-400 flex-shrink-0">
          {format(new Date(quote.dateCaptured), 'MMM d')}
        </span>
      </div>
    </div>
  );
}

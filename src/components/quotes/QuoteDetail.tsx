import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import {
  ArrowLeft,
  Heart,
  Edit,
  Archive,
  Trash2,
  BookOpen,
  Calendar,
  Hash,
  FolderOpen,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

export function QuoteDetail() {
  const { selectedQuoteId, getQuoteById, toggleFavorite, toggleArchive, deleteQuote, getUserCategories } =
    useQuoteStore();
  const { setView, setEditingQuote, showToast } = useAppStore();
  const { user } = useAuthStore();

  const quote = selectedQuoteId ? getQuoteById(selectedQuoteId) : null;
  const categories = getUserCategories(user?.id || '');
  const category = categories.find((c) => c.id === quote?.categoryId);

  if (!quote) {
    return (
      <div className="text-center py-20">
        <p className="text-surface-500">Quote not found</p>
        <Button variant="ghost" onClick={() => setView('quotes')} className="mt-4">
          Back to Quotes
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quote permanently?')) {
      deleteQuote(quote.id);
      showToast('Quote deleted');
      setView('quotes');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => setView('quotes')}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors p-1 -ml-1"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => toggleFavorite(quote.id)}
            className={`p-2.5 sm:p-2 rounded-lg transition-colors ${
              quote.isFavorite ? 'text-rose-500 bg-rose-50' : 'text-surface-400 hover:text-rose-500 hover:bg-rose-50'
            }`}
          >
            <Heart size={20} fill={quote.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => setEditingQuote(quote.id)}
            className="p-2.5 sm:p-2 rounded-lg text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => {
              toggleArchive(quote.id);
              showToast(quote.isArchived ? 'Quote restored' : 'Quote archived');
            }}
            className="p-2.5 sm:p-2 rounded-lg text-surface-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Archive size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 sm:p-2 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Quote */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 mb-6">
        <blockquote className="quote-text text-xl sm:text-2xl text-surface-800 leading-relaxed italic mb-6">
          "{quote.text}"
        </blockquote>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 font-semibold">
            {quote.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-surface-900">{quote.author}</p>
            {quote.source && (
              <p className="text-sm text-surface-500 flex items-center gap-1">
                <BookOpen size={13} />
                {quote.source}
                {quote.chapter && `, ${quote.chapter}`}
                {quote.page && ` (p. ${quote.page})`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lesson & Reflection */}
      {(quote.lesson || quote.reflection) && (
        <div className="space-y-4 mb-6">
          {quote.lesson && (
            <div className="bg-white rounded-xl border border-surface-200 p-5 border-l-4 border-l-amber-400">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-amber-500" />
                <h3 className="text-sm font-semibold text-surface-900">Lesson Learned</h3>
              </div>
              <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">{quote.lesson}</p>
            </div>
          )}

          {quote.reflection && (
            <div className="bg-white rounded-xl border border-surface-200 p-5 border-l-4 border-l-brand-400">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🪞</span>
                <h3 className="text-sm font-semibold text-surface-900">Personal Reflection</h3>
              </div>
              <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">{quote.reflection}</p>
            </div>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-xl border border-surface-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-surface-900 mb-3">Details</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={15} className="text-surface-400" />
            <span className="text-surface-500">Captured:</span>
            <span className="text-surface-700">{format(new Date(quote.dateCaptured), 'MMMM d, yyyy')}</span>
          </div>
          {category && (
            <div className="flex items-center gap-3 text-sm">
              <FolderOpen size={15} className="text-surface-400" />
              <span className="text-surface-500">Category:</span>
              <Badge>
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: category.color }} />
                {category.name}
              </Badge>
            </div>
          )}
          {quote.tags.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Hash size={15} className="text-surface-400 mt-0.5" />
              <span className="text-surface-500">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {quote.tags.map((tag) => (
                  <Badge key={tag} variant="brand">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-surface-400 w-[15px] text-center">🔒</span>
            <span className="text-surface-500">Visibility:</span>
            <span className="text-surface-700 capitalize">{quote.visibility}</span>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="text-xs text-surface-400 text-center pb-20 md:pb-4">
        Created {format(new Date(quote.createdAt), 'MMM d, yyyy · h:mm a')}
        {quote.updatedAt !== quote.createdAt && (
          <> · Updated {format(new Date(quote.updatedAt), 'MMM d, yyyy · h:mm a')}</>
        )}
      </div>
    </div>
  );
}

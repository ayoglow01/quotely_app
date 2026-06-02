import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowLeft } from 'lucide-react';

const quoteSchema = z.object({
  text: z.string().min(1, 'Quote text is required').max(2000, 'Quote is too long'),
  author: z.string().min(1, 'Author is required').max(200),
  source: z.string().max(300).optional(),
  chapter: z.string().max(200).optional(),
  page: z.string().max(20).optional(),
  dateCaptured: z.string().min(1, 'Date is required'),
  lesson: z.string().max(2000).optional(),
  reflection: z.string().max(2000).optional(),
  categoryId: z.string().optional(),
  visibility: z.enum(['private', 'public']),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export function QuoteForm() {
  const { user } = useAuthStore();
  const { addQuote, updateQuote, getQuoteById, getUserCategories, addTag, getUserTags } = useQuoteStore();
  const { editingQuoteId, setView, showToast } = useAppStore();
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const existingQuote = editingQuoteId ? getQuoteById(editingQuoteId) : null;
  const categories = getUserCategories(user?.id || '');
  const userTags = getUserTags(user?.id || '');
  const isEditing = !!existingQuote;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      text: existingQuote?.text || '',
      author: existingQuote?.author || '',
      source: existingQuote?.source || '',
      chapter: existingQuote?.chapter || '',
      page: existingQuote?.page || '',
      dateCaptured: existingQuote?.dateCaptured || new Date().toISOString().split('T')[0],
      lesson: existingQuote?.lesson || '',
      reflection: existingQuote?.reflection || '',
      categoryId: existingQuote?.categoryId || '',
      visibility: existingQuote?.visibility || 'private',
    },
  });

  useEffect(() => {
    if (existingQuote) {
      setSelectedTags(existingQuote.tags);
    }
  }, [existingQuote]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      if (user) addTag(user.id, tag);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = (data: QuoteFormData) => {
    if (!user) return;

    if (isEditing && existingQuote) {
      updateQuote(existingQuote.id, {
        ...data,
        source: data.source || undefined,
        chapter: data.chapter || undefined,
        page: data.page || undefined,
        lesson: data.lesson || undefined,
        reflection: data.reflection || undefined,
        categoryId: data.categoryId || undefined,
        tags: selectedTags,
      });
      showToast('Quote updated successfully');
    } else {
      addQuote({
        ...data,
        userId: user.id,
        source: data.source || undefined,
        chapter: data.chapter || undefined,
        page: data.page || undefined,
        lesson: data.lesson || undefined,
        reflection: data.reflection || undefined,
        categoryId: data.categoryId || undefined,
        tags: selectedTags,
        isFavorite: false,
        isArchived: false,
      });
      showToast('Quote added to your collection');
    }

    setView('quotes');
  };

  const suggestedTags = userTags
    .filter((t) => !selectedTags.includes(t.name))
    .slice(0, 8);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setView(isEditing ? 'quote-detail' : 'quotes')}
          className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-surface-900">
            {isEditing ? 'Edit Quote' : 'New Quote'}
          </h1>
          <p className="text-sm text-surface-500">
            {isEditing ? 'Update your wisdom entry' : 'Capture a piece of wisdom'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Quote Text */}
        <div className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Quote</h3>
          <Textarea
            label="Quote Text"
            placeholder="Enter the quote that resonated with you..."
            rows={4}
            error={errors.text?.message}
            {...register('text')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input
              label="Author"
              placeholder="Who said or wrote this?"
              error={errors.author?.message}
              {...register('author')}
            />
            <Input
              label="Date Captured"
              type="date"
              error={errors.dateCaptured?.message}
              {...register('dateCaptured')}
            />
          </div>
        </div>

        {/* Source Details */}
        <div className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Source Details</h3>
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
            <Input
              label="Source / Book"
              placeholder="Book, article, podcast..."
              {...register('source')}
            />
            <div className="grid grid-cols-2 gap-3 sm:contents">
              <Input
                label="Chapter"
                placeholder="Chapter name"
                {...register('chapter')}
              />
              <Input
                label="Page"
                placeholder="Page #"
                {...register('page')}
              />
            </div>
          </div>
        </div>

        {/* Wisdom Section — The Heart */}
        <div className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5 border-l-4 border-l-brand-500">
          <h3 className="text-sm font-semibold text-surface-900 mb-1">Wisdom & Reflection</h3>
          <p className="text-xs text-surface-500 mb-4">
            This is what makes Quotely different — capture what you learned and how it made you think.
          </p>
          <div className="space-y-4">
            <Textarea
              label="💡 Lesson Learned"
              placeholder="What key insight or lesson does this quote teach you?"
              rows={3}
              hint="What did you learn from this?"
              {...register('lesson')}
            />
            <Textarea
              label="🪞 Personal Reflection"
              placeholder="How does this quote connect to your life, work, or beliefs?"
              rows={3}
              hint="How does this relate to your experience?"
              {...register('reflection')}
            />
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Organization</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Select
              label="Category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select a category"
              {...register('categoryId')}
            />
            <Select
              label="Visibility"
              options={[
                { value: 'private', label: 'Private' },
                { value: 'public', label: 'Public' },
              ]}
              {...register('visibility')}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-surface-700">Tags</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="brand" removable onRemove={() => handleRemoveTag(tag)}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {suggestedTags.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-surface-500 mb-1.5">Suggested:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setSelectedTags([...selectedTags, tag.name])}
                      className="text-xs px-2 py-0.5 rounded-full bg-surface-100 text-surface-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      + {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-20 md:pb-4">
          <Button type="submit" size="lg" className="flex-1 sm:flex-none">
            {isEditing ? 'Save Changes' : 'Save Quote'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => setView(isEditing ? 'quote-detail' : 'quotes')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

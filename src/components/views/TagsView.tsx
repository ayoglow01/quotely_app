import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EmptyState } from '../ui/EmptyState';
import { Plus, Trash2, Tags, Hash } from 'lucide-react';

export function TagsView() {
  const { user } = useAuthStore();
  const { getUserTags, addTag, deleteTag, quotes } = useQuoteStore();
  const { showToast } = useAppStore();
  const [newTag, setNewTag] = useState('');

  const userId = user?.id || '';
  const tags = getUserTags(userId);

  const getTagCount = (tagName: string) =>
    quotes.filter((q) => q.userId === userId && q.tags.includes(tagName) && !q.isArchived).length;

  const handleAdd = () => {
    const name = newTag.trim().toLowerCase();
    if (!name) return;
    addTag(userId, name);
    setNewTag('');
    showToast('Tag created');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this tag? It will be removed from all quotes.')) {
      deleteTag(id);
      showToast('Tag deleted');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Tags</h1>
        <p className="text-sm text-surface-500">{tags.length} tags</p>
      </div>

      {/* Add Tag */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a new tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button icon={<Plus size={16} />} onClick={handleAdd} disabled={!newTag.trim()}>
          Add
        </Button>
      </div>

      {tags.length === 0 ? (
        <EmptyState
          icon={<Tags size={28} />}
          title="No tags yet"
          description="Tags help you find and organize quotes across categories. Add tags when creating quotes, or create them here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-surface-200 divide-y divide-surface-100">
          {tags
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag) => {
              const count = getTagCount(tag.name);
              return (
                <div
                  key={tag.id}
                  className="flex items-center justify-between px-4 py-3 group hover:bg-surface-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500">
                      <Hash size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{tag.name}</p>
                      <p className="text-xs text-surface-500">{count} quote{count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-2 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 md:opacity-0 md:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

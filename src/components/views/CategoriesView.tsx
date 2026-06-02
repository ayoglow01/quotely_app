import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { Plus, Trash2, Edit, FolderOpen } from 'lucide-react';

const COLORS = [
  '#4c6ef5', '#7950f2', '#10b981', '#f59e0b', '#ec4899',
  '#06b6d4', '#f43f5e', '#8b5cf6', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16',
];

export function CategoriesView() {
  const { user } = useAuthStore();
  const { getUserCategories, addCategory, updateCategory, deleteCategory } = useQuoteStore();
  const { showToast, setView } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const userId = user?.id || '';
  const categories = getUserCategories(userId);

  const handleOpen = (catId?: string) => {
    if (catId) {
      const cat = categories.find((c) => c.id === catId);
      if (cat) {
        setEditingId(catId);
        setName(cat.name);
        setColor(cat.color);
      }
    } else {
      setEditingId(null);
      setName('');
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateCategory(editingId, { name: name.trim(), color });
      showToast('Category updated');
    } else {
      addCategory(userId, name.trim(), color);
      showToast('Category created');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this category? Quotes in this category will be uncategorized.')) {
      deleteCategory(id);
      showToast('Category deleted');
    }
  };

  const handleFilterByCategory = (catId: string) => {
    useQuoteStore.getState().setFilters({ categoryId: catId });
    setView('quotes');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Categories</h1>
          <p className="text-sm text-surface-500">{categories.length} categories</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => handleOpen()}>
          New Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={28} />}
          title="No categories yet"
          description="Create categories to organize your quotes by topic."
          action={{ label: 'Create Category', onClick: () => handleOpen() }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white rounded-xl border border-surface-200 p-4 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => handleFilterByCategory(cat.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: cat.color + '20', color: cat.color }}
                  >
                    <FolderOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-surface-900">{cat.name}</h3>
                    <p className="text-xs text-surface-500">{cat.quoteCount} quotes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen(cat.id);
                    }}
                    className="p-2 rounded-lg text-surface-400 hover:text-brand-600 hover:bg-brand-50"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cat.id);
                    }}
                    className="p-2 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Category' : 'New Category'}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g., Leadership"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={!name.trim()} className="flex-1">
              {editingId ? 'Save Changes' : 'Create'}
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

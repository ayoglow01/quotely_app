import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useQuoteStore } from '../../stores/quoteStore';
import { useAppStore } from '../../stores/appStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowLeft, User, Mail, Calendar, BookOpen, Heart, Quote } from 'lucide-react';
import { format } from 'date-fns';

export function ProfileView() {
  const { user, updateProfile } = useAuthStore();
  const { getStats } = useQuoteStore();
  const { setView, showToast } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const stats = getStats(user?.id || '');

  const handleSave = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
      showToast('Profile updated');
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView('dashboard')}
          className="p-2 rounded-lg hover:bg-surface-100 text-surface-500"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-surface-900">Profile</h1>
      </div>

      {/* Avatar & Name */}
      <div className="bg-white rounded-xl border border-surface-200 p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-brand-700">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        {isEditing ? (
          <div className="max-w-xs mx-auto space-y-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
            />
            <div className="flex gap-2 justify-center">
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-surface-900">{user?.name}</h2>
            <p className="text-sm text-surface-500 mt-1">{user?.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-surface-200 p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mx-auto mb-2">
              <Quote size={18} className="text-brand-600" />
            </div>
            <p className="text-2xl font-bold text-surface-900">{stats.totalQuotes}</p>
            <p className="text-xs text-surface-500">Quotes</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center mx-auto mb-2">
              <Heart size={18} className="text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-surface-900">{stats.totalFavorites}</p>
            <p className="text-xs text-surface-500">Favorites</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-2">
              <BookOpen size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-surface-900">{stats.totalSources}</p>
            <p className="text-xs text-surface-500">Sources</p>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl border border-surface-200 p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Account</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User size={15} className="text-surface-400" />
            <span className="text-surface-500 w-20">Name</span>
            <span className="text-surface-700">{user?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={15} className="text-surface-400" />
            <span className="text-surface-500 w-20">Email</span>
            <span className="text-surface-700">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={15} className="text-surface-400" />
            <span className="text-surface-500 w-20">Joined</span>
            <span className="text-surface-700">
              {user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

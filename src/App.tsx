import { useEffect, useRef } from 'react';
import { useAuthStore } from './stores/authStore';
import { useQuoteStore } from './stores/quoteStore';
import { useAppStore } from './stores/appStore';
import { generateSampleQuotes } from './data/sampleQuotes';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MobileHeader } from './components/layout/MobileHeader';
import { Toast } from './components/ui/Toast';
import { Dashboard } from './components/views/Dashboard';
import { QuotesList } from './components/views/QuotesList';
import { QuoteForm } from './components/quotes/QuoteForm';
import { QuoteDetail } from './components/quotes/QuoteDetail';
import { CategoriesView } from './components/views/CategoriesView';
import { TagsView } from './components/views/TagsView';
import { SearchView } from './components/views/SearchView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';

function AppContent() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'quotes':
        return <QuotesList />;
      case 'quote-form':
        return <QuoteForm />;
      case 'quote-detail':
        return <QuoteDetail />;
      case 'categories':
        return <CategoriesView />;
      case 'tags':
        return <TagsView />;
      case 'search':
        return <SearchView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8 overflow-auto">
          {renderView()}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { initializeForUser, addQuote, quotes, addTag } = useQuoteStore();
  const seededRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeForUser(user.id);
      
      // Seed sample data for new users
      const userQuotes = quotes.filter((q) => q.userId === user.id);
      if (userQuotes.length === 0 && !seededRef.current.has(user.id)) {
        seededRef.current.add(user.id);
        const samples = generateSampleQuotes(user.id);
        samples.forEach((sample) => {
          addQuote(sample);
          sample.tags.forEach((tag) => addTag(user.id, tag));
        });
      }
    }
  }, [isAuthenticated, user, initializeForUser]);

  if (!isAuthenticated) {
    return (
      <>
        <WelcomeScreen />
        <Toast />
      </>
    );
  }

  return (
    <>
      <AppContent />
      <Toast />
    </>
  );
}

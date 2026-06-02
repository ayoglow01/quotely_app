import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { BookOpen, Lightbulb, Heart, Search } from 'lucide-react';
import { Button } from '../ui/Button';

type AuthMode = 'welcome' | 'login' | 'signup';

export function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>('welcome');

  if (mode === 'login') {
    return <LoginForm onSwitchToSignup={() => setMode('signup')} onBack={() => setMode('welcome')} />;
  }

  if (mode === 'signup') {
    return <SignupForm onSwitchToLogin={() => setMode('login')} onBack={() => setMode('welcome')} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight mb-1">
            Quotely
          </h1>
          <p className="text-surface-500 text-sm mb-8">
            Your Personal Wisdom Archive
          </p>

          {/* Quote Display */}
          <div className="bg-surface-50 rounded-2xl p-6 mb-10 border border-surface-100">
            <p className="quote-text text-xl text-surface-800 italic leading-relaxed mb-3">
              "The only true wisdom is in knowing you know nothing."
            </p>
            <p className="text-sm text-surface-500 font-medium">— Socrates</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-2">
                <Lightbulb className="w-5 h-5 text-brand-600" />
              </div>
              <p className="text-xs text-surface-600 font-medium">Capture<br />Wisdom</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs text-surface-600 font-medium">Reflect &<br />Learn</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-xs text-surface-600 font-medium">Organize &<br />Find</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setMode('signup')}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setMode('login')}
            >
              I Already Have an Account
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-surface-400">
        Built for readers, thinkers, and lifelong learners.
      </div>
    </div>
  );
}

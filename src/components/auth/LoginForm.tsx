import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowLeft, BookOpen, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onBack: () => void;
}

export function LoginForm({ onSwitchToSignup, onBack }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900">Quotely</span>
        </div>

        <h1 className="text-2xl font-bold text-surface-900 mb-1">Welcome back</h1>
        <p className="text-sm text-surface-500 mb-8">
          Sign in to access your wisdom archive
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={16} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="w-full" size="lg" loading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-500">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-brand-600 font-medium hover:text-brand-700"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginInput } from '@/schemas/auth.schema';
import { extractApiError } from '@/api/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function Login(): React.JSX.Element {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput): Promise<void> => {
    setApiError(null);
    try {
      await login(data);
      void navigate('/leads', { replace: true });
    } catch (err: unknown) {
      setApiError(extractApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-obsidian-950 bg-grid-pattern-light dark:bg-grid-pattern px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 dark:bg-amber-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[360px] animate-slide-up">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-amber-glow">
              <ZapIcon />
            </div>
            <span className="text-xl font-bold font-display text-stone-900 dark:text-obsidian-50 tracking-tight">
              GigFlow
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-obsidian-800 border border-stone-200 dark:border-obsidian-600 rounded-2xl shadow-obsidian p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold font-display text-stone-900 dark:text-obsidian-50">
              Welcome back
            </h1>
            <p className="text-sm text-stone-500 dark:text-obsidian-400 mt-1 font-display">
              Sign in to your account to continue
            </p>
          </div>

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
              <p className="text-sm text-red-400 font-display">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={14} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock size={14} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-500 dark:text-obsidian-400 font-display">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-stone-400 dark:text-obsidian-600 mt-6 font-mono-data">
          GIGFLOW LEADS &copy; 2024
        </p>
      </div>
    </div>
  );
}

function ZapIcon(): React.JSX.Element {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-obsidian-900"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

import { Moon, Sun, LogOut, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark'),
  );

  const toggle = (): void => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return [isDark, toggle];
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/leads/') && pathname.length > 7) return 'Lead Detail';
  if (pathname === '/leads') return 'Leads';
  if (pathname === '/analytics') return 'Analytics';
  return 'Dashboard';
}

function getPageIcon(pathname: string): React.ReactNode {
  if (pathname.startsWith('/leads')) return <Users size={16} />;
  return null;
}

export default function Topbar(): React.JSX.Element {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDark, toggleDark] = useDarkMode();

  const title = getPageTitle(location.pathname);
  const icon = getPageIcon(location.pathname);

  return (
    <header className="h-14 shrink-0 flex items-center gap-4 px-5 bg-white dark:bg-obsidian-900 border-b border-stone-200 dark:border-obsidian-700">
      {/* Page title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {icon && (
          <span className="text-stone-400 dark:text-obsidian-500">{icon}</span>
        )}
        <h1 className="text-sm font-semibold font-display text-stone-900 dark:text-obsidian-100 truncate">
          {title}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleDark}
          className={cn(
            'p-2 rounded-lg transition-all duration-200',
            'text-stone-500 dark:text-obsidian-400',
            'hover:bg-stone-100 dark:hover:bg-obsidian-750',
            'hover:text-stone-800 dark:hover:text-obsidian-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
          )}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-stone-200 dark:bg-obsidian-700 mx-1" />

        {/* User */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold font-display text-stone-800 dark:text-obsidian-100 leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-obsidian-500 font-mono-data capitalize mt-0.5">
                {user.role}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                'text-stone-500 dark:text-obsidian-400',
                'hover:bg-red-50 dark:hover:bg-red-500/10',
                'hover:text-red-500 dark:hover:text-red-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
              )}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

import { NavLink } from 'react-router-dom';
import { Users, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    to: '/leads',
    label: 'Leads',
    icon: <Users size={17} />,
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 size={17} />,
  },
];

export default function Sidebar(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col',
        'w-[220px] shrink-0',
        'bg-white dark:bg-obsidian-900',
        'border-r border-stone-200 dark:border-obsidian-700',
        'transition-all duration-300',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-14 px-5 border-b border-stone-100 dark:border-obsidian-750">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 shadow-amber-glow shrink-0">
          <Zap size={14} className="text-obsidian-900" />
        </div>
        <span className="text-sm font-bold font-display tracking-tight text-stone-900 dark:text-obsidian-50">
          GigFlow
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Primary navigation">
        <p className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-stone-400 dark:text-obsidian-500">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium font-display',
                'transition-all duration-150 group',
                isActive
                  ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
                  : 'text-stone-600 dark:text-obsidian-300 hover:bg-stone-100 dark:hover:bg-obsidian-750 hover:text-stone-900 dark:hover:text-obsidian-100',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'transition-colors duration-150',
                    isActive
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-stone-400 dark:text-obsidian-500 group-hover:text-stone-600 dark:group-hover:text-obsidian-300',
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1 h-1 rounded-full bg-amber-500 dark:bg-amber-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {user && (
        <div className="px-3 py-4 border-t border-stone-100 dark:border-obsidian-750">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-obsidian-800">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono-data">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold font-display text-stone-800 dark:text-obsidian-100 truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield size={9} className="text-stone-400 dark:text-obsidian-500" />
                <span className="text-[10px] text-stone-400 dark:text-obsidian-500 font-mono-data capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// Inline Zap to avoid re-import
function Zap({
  size,
  className,
}: {
  size: number;
  className?: string;
}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

import { Pencil, Trash2 } from 'lucide-react';
import { LeadStatusBadge } from './LeadStatusBadge';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types/api';

interface MobileLeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onClick: (lead: Lead) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function MobileLeadCard({
  lead,
  onEdit,
  onDelete,
  onClick,
}: MobileLeadCardProps): React.JSX.Element {
  const handleEdit = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onEdit(lead);
  };

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onDelete(lead);
  };

  return (
    <div
      onClick={() => onClick(lead)}
      className={cn(
        'flex flex-col gap-3 p-4',
        'bg-white dark:bg-obsidian-800',
        'border border-stone-200 dark:border-obsidian-600',
        'rounded-xl cursor-pointer',
        'hover:border-amber-400/50 dark:hover:border-amber-500/30',
        'hover:bg-amber-50/30 dark:hover:bg-amber-500/[0.03]',
        'transition-all duration-150',
      )}
    >
      {/* Top row: name + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold font-display text-stone-900 dark:text-obsidian-100 truncate">
            {lead.name}
          </p>
          <p className="text-xs font-mono-data text-stone-500 dark:text-obsidian-400 truncate mt-0.5">
            {lead.email}
          </p>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      {/* Bottom row: source + date + actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-display text-stone-500 dark:text-obsidian-400">
            {lead.source}
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-obsidian-600" />
          <span className="text-xs font-mono-data text-stone-400 dark:text-obsidian-500">
            {formatDate(lead.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleEdit}
            aria-label={`Edit ${lead.name}`}
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-lg',
              'text-stone-400 dark:text-obsidian-400',
              'hover:bg-stone-100 dark:hover:bg-obsidian-700',
              'hover:text-stone-700 dark:hover:text-obsidian-100',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
            )}
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Delete ${lead.name}`}
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-lg',
              'text-stone-400 dark:text-obsidian-400',
              'hover:bg-red-50 dark:hover:bg-red-500/10',
              'hover:text-red-500 dark:hover:text-red-400',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50',
            )}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

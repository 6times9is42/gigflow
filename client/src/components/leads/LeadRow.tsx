import { Pencil, Trash2 } from 'lucide-react';
import { LeadStatusBadge } from './LeadStatusBadge';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types/api';

interface LeadRowProps {
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

export function LeadRow({
  lead,
  onEdit,
  onDelete,
  onClick,
}: LeadRowProps): React.JSX.Element {
  const handleRowClick = (): void => {
    onClick(lead);
  };

  const handleEdit = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onEdit(lead);
  };

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onDelete(lead);
  };

  return (
    <tr
      onClick={handleRowClick}
      className={cn(
        'group border-b border-stone-100 dark:border-obsidian-700 last:border-b-0',
        'hover:bg-amber-50/40 dark:hover:bg-amber-500/[0.03]',
        'transition-colors duration-100 cursor-pointer',
      )}
    >
      {/* Name */}
      <td className="px-5 py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold font-display text-stone-900 dark:text-obsidian-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-100">
            {lead.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-5 py-3.5 hidden md:table-cell">
        <span className="text-sm font-mono-data text-stone-500 dark:text-obsidian-400">
          {lead.email}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5 hidden sm:table-cell">
        <LeadStatusBadge status={lead.status} />
      </td>

      {/* Source */}
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <span className="text-sm font-display text-stone-600 dark:text-obsidian-300">
          {lead.source}
        </span>
      </td>

      {/* Created */}
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <span className="text-sm font-mono-data text-stone-400 dark:text-obsidian-500 whitespace-nowrap">
          {formatDate(lead.createdAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <ActionButton
            onClick={handleEdit}
            aria-label={`Edit ${lead.name}`}
            title="Edit lead"
            variant="edit"
          >
            <Pencil size={13} />
          </ActionButton>
          <ActionButton
            onClick={handleDelete}
            aria-label={`Delete ${lead.name}`}
            title="Delete lead"
            variant="delete"
          >
            <Trash2 size={13} />
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}

/* ── Internal ActionButton ─────────────────────────────────────── */
interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  'aria-label': string;
  title: string;
  variant: 'edit' | 'delete';
}

function ActionButton({
  onClick,
  children,
  'aria-label': ariaLabel,
  title,
  variant,
}: ActionButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      className={cn(
        'flex items-center justify-center w-7 h-7 rounded-lg',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
        variant === 'edit' &&
          'text-stone-400 dark:text-obsidian-400 hover:bg-stone-100 dark:hover:bg-obsidian-700 hover:text-stone-700 dark:hover:text-obsidian-100',
        variant === 'delete' &&
          'text-stone-400 dark:text-obsidian-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400',
      )}
    >
      {children}
    </button>
  );
}

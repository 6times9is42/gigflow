import { Users, SearchX, Pencil, Trash2 } from 'lucide-react';
import { LeadRow } from './LeadRow';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types/api';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onNavigate: (lead: Lead) => void;
}

const HEADERS = [
  { label: 'Name', className: '' },
  { label: 'Email', className: 'hidden md:table-cell' },
  { label: 'Status', className: 'hidden sm:table-cell' },
  { label: 'Source', className: 'hidden lg:table-cell' },
  { label: 'Created', className: 'hidden lg:table-cell' },
  { label: '', className: '' }, // Actions
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── MobileLeadCard ─────────────────────────────────────────────── */
interface MobileLeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onClick: (lead: Lead) => void;
}

function MobileLeadCard({
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

/* ── LeadsTable ─────────────────────────────────────────────────── */
export function LeadsTable({
  leads,
  isLoading,
  hasActiveFilters,
  onEdit,
  onDelete,
  onNavigate,
}: LeadsTableProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-obsidian-800 border border-stone-200 dark:border-obsidian-600 rounded-2xl overflow-hidden">
        <LoadingSkeleton variant="table" rows={10} />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-obsidian-800 border border-stone-200 dark:border-obsidian-600 rounded-2xl overflow-hidden">
        {hasActiveFilters ? (
          <EmptyState
            icon={<SearchX size={28} />}
            title="No results found"
            description="No leads match your current filters. Try adjusting your search or clearing the filters."
          />
        ) : (
          <EmptyState
            icon={<Users size={28} />}
            title="No leads yet"
            description="Add your first lead to start tracking your pipeline."
          />
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile card list (hidden on md+) */}
      <div className="md:hidden flex flex-col gap-3">
        {leads.map((lead) => (
          <MobileLeadCard
            key={lead._id}
            lead={lead}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={onNavigate}
          />
        ))}
      </div>

      {/* Desktop table (hidden below md) */}
      <div className="hidden md:block bg-white dark:bg-obsidian-800 border border-stone-200 dark:border-obsidian-600 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-stone-100 dark:border-obsidian-700">
                {HEADERS.map((header, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3 text-left text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-obsidian-500 bg-stone-50 dark:bg-obsidian-850 ${header.className}`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <LeadRow
                  key={lead._id}
                  lead={lead}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onClick={onNavigate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

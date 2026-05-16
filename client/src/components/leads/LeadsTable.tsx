import { Users, SearchX } from 'lucide-react';
import { LeadRow } from './LeadRow';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
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
    <div className="bg-white dark:bg-obsidian-800 border border-stone-200 dark:border-obsidian-600 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 dark:border-obsidian-700">
              {HEADERS.map((header, i) => (
                <th
                  key={i}
                  className={`px-5 py-3 text-left text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-obsidian-500 ${header.className}`}
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
  );
}

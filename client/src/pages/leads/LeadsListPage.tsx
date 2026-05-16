import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useLeads } from '@/hooks/useLeads';
import { useFilters } from '@/hooks/useFilters';
import { exportLeadsApi } from '@/api/leads.api';
import { extractApiError } from '@/api/client';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadForm } from '@/components/leads/LeadForm';
import { DeleteConfirmModal } from '@/components/leads/DeleteConfirmModal';
import { Pagination } from '@/components/leads/Pagination';
import { ErrorState } from '@/components/feedback/ErrorState';
import type { Lead } from '@/types/api';

/* ── LeadsListPage ─────────────────────────────────────────────── */
export default function LeadsListPage(): React.JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { search, status, source, sort, page, setFilter, setPage } = useFilters();

  // Debounce search so API isn't hit on every keystroke
  const debouncedSearch = useDebounce(search, 400);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Build query — use debounced search
  const query = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
    sort,
    page,
    limit: 10,
  };

  const { data: leads, pagination, isLoading, error, refetch } = useLeads(query);

  const hasActiveFilters = Boolean(search || status || source);

  // Navigate to detail page
  const handleNavigate = (lead: Lead): void => {
    void navigate(`/leads/${lead._id}`);
  };

  // CSV export
  const handleExport = async (): Promise<void> => {
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await exportLeadsApi({
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(status ? { status } : {}),
        ...(source ? { source } : {}),
        sort,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setExportError(extractApiError(err));
    } finally {
      setIsExporting(false);
    }
  };

  // Refetch after mutations
  const handleMutationSuccess = (): void => {
    refetch();
  };

  return (
    <div className="flex flex-col gap-5 max-w-screen-xl mx-auto animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold font-display text-stone-900 dark:text-obsidian-50 tracking-tight">
          Leads
        </h1>
        <p className="text-sm text-stone-500 dark:text-obsidian-400 mt-0.5 font-display">
          {pagination && !isLoading
            ? `${pagination.total} lead${pagination.total !== 1 ? 's' : ''} in your pipeline`
            : 'Manage your sales pipeline'}
        </p>
      </div>

      {/* Export error */}
      {exportError && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
          <p className="text-sm text-red-400 font-display">{exportError}</p>
        </div>
      )}

      {/* Filters bar */}
      <LeadFilters
        filters={{ search, status, source, sort }}
        onFilterChange={setFilter}
        onAdd={() => setShowAddModal(true)}
        onExport={() => void handleExport()}
        isExporting={isExporting}
        canExport={user?.role === 'admin'}
      />

      {/* Error state */}
      {error && !isLoading && (
        <ErrorState error={error} onRetry={refetch} />
      )}

      {/* Table */}
      {!error && (
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onEdit={(lead) => setEditLead(lead)}
          onDelete={(lead) => setDeleteLead(lead)}
          onNavigate={handleNavigate}
        />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && !isLoading && !error && (
        <Pagination pagination={pagination} onPageChange={setPage} />
      )}

      {/* Add modal */}
      {showAddModal && (
        <LeadForm
          onSuccess={handleMutationSuccess}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editLead && (
        <LeadForm
          lead={editLead}
          onSuccess={handleMutationSuccess}
          onClose={() => setEditLead(null)}
        />
      )}

      {/* Delete confirm modal */}
      {deleteLead && (
        <DeleteConfirmModal
          lead={deleteLead}
          onConfirm={handleMutationSuccess}
          onClose={() => setDeleteLead(null)}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Mail,
  Globe,
  Calendar,
  Clock,
  ShieldOff,
  Pencil,
  Trash2,
} from 'lucide-react';
import { getLeadApi } from '@/api/leads.api';
import { extractApiError } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { LeadForm } from '@/components/leads/LeadForm';
import { DeleteConfirmModal } from '@/components/leads/DeleteConfirmModal';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import type { Lead } from '@/types/api';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ── Detail Field ──────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, icon, children }: FieldProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-stone-400 dark:text-obsidian-500">{icon}</span>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-obsidian-500 font-display">
          {label}
        </span>
      </div>
      <div className="text-sm font-display text-stone-800 dark:text-obsidian-200 pl-5">
        {children}
      </div>
    </div>
  );
}

/* ── LeadDetailPage ─────────────────────────────────────────────── */
export default function LeadDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is403, setIs403] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchLead = (): void => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setIs403(false);

    getLeadApi(id)
      .then((data) => {
        setLead(data);
      })
      .catch((err: unknown) => {
        // Detect 403 → show "not authorized" state instead of generic error
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setIs403(true);
        } else {
          setError(extractApiError(err));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchLead();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteSuccess = (): void => {
    void navigate('/leads', { replace: true });
  };

  const handleEditSuccess = (): void => {
    fetchLead();
  };

  // Determine if current user can edit/delete
  const canMutate =
    user?.role === 'admin' || (lead !== null && lead.ownerId === user?._id);

  /* ── Render states ─────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <BackLink />
        <Card className="mt-5">
          <LoadingSkeleton variant="detail" />
        </Card>
      </div>
    );
  }

  if (is403) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <BackLink />
        <div className="mt-10">
          <EmptyState
            icon={<ShieldOff size={28} />}
            title="Not authorized"
            description="You don't have permission to view this lead."
            action={
              <Link to="/leads">
                <Button variant="secondary" size="sm">
                  Back to Leads
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <BackLink />
        <div className="mt-10">
          <ErrorState error={error} onRetry={fetchLead} />
        </div>
      </div>
    );
  }

  if (!lead) return <></>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <BackLink />

      <div className="mt-5 flex flex-col gap-5">
        {/* Header card */}
        <Card>
          <div className="flex items-start justify-between gap-4">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold font-display text-amber-600 dark:text-amber-400">
                  {lead.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold font-display text-stone-900 dark:text-obsidian-50 leading-tight">
                  {lead.name}
                </h1>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm font-mono-data text-stone-500 dark:text-obsidian-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-150"
                >
                  {lead.email}
                </a>
              </div>
            </div>

            {/* Status badge */}
            <div className="shrink-0 mt-0.5">
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
        </Card>

        {/* Detail fields card */}
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email" icon={<Mail size={13} />}>
              <a
                href={`mailto:${lead.email}`}
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {lead.email}
              </a>
            </Field>

            <Field label="Source" icon={<Globe size={13} />}>
              {lead.source}
            </Field>

            <Field label="Status" icon={<span className="text-xs">●</span>}>
              <LeadStatusBadge status={lead.status} />
            </Field>

            <Field label="Created" icon={<Calendar size={13} />}>
              {formatDate(lead.createdAt)}
            </Field>

            <Field label="Last Updated" icon={<Clock size={13} />}>
              {formatDateTime(lead.updatedAt)}
            </Field>

            <Field label="Lead ID" icon={<span className="text-xs">#</span>}>
              <span className="font-mono-data text-xs text-stone-400 dark:text-obsidian-500 break-all">
                {lead._id}
              </span>
            </Field>
          </div>
        </Card>

        {/* Actions card */}
        {canMutate && (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold font-display text-stone-800 dark:text-obsidian-200">
                  Actions
                </h2>
                <p className="text-xs text-stone-400 dark:text-obsidian-500 mt-0.5 font-display">
                  Manage this lead record
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                >
                  <Pencil size={13} />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={13} />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <LeadForm
          lead={lead}
          onSuccess={handleEditSuccess}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete confirm modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          lead={lead}
          onConfirm={handleDeleteSuccess}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

/* ── BackLink ───────────────────────────────────────────────────── */
function BackLink(): React.JSX.Element {
  return (
    <Link
      to="/leads"
      className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-obsidian-400 hover:text-stone-900 dark:hover:text-obsidian-100 transition-colors duration-150 font-display group"
    >
      <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
      Back to Leads
    </Link>
  );
}

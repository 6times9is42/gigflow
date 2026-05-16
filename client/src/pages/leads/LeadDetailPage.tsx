import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldOff } from 'lucide-react';
import { getLeadApi } from '@/api/leads.api';
import { extractApiError } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadForm } from '@/components/leads/LeadForm';
import { DeleteConfirmModal } from '@/components/leads/DeleteConfirmModal';
import { LeadDetailCard, ActionsCard, BackLink } from '@/components/leads/LeadDetailCard';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import type { Lead } from '@/types/api';

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

  const fetchLead = useCallback((): void => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setIs403(false);

    getLeadApi(id)
      .then((data) => {
        setLead(data);
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setIs403(true);
        } else {
          setError(extractApiError(err));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleDeleteSuccess = (): void => {
    void navigate('/leads', { replace: true });
  };

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
        <LeadDetailCard lead={lead} />
        {canMutate && (
          <ActionsCard
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}
      </div>

      {showEditModal && (
        <LeadForm
          lead={lead}
          onSuccess={fetchLead}
          onClose={() => setShowEditModal(false)}
        />
      )}

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

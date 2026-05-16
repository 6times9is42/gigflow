import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { deleteLeadApi } from '@/api/leads.api';
import { extractApiError } from '@/api/client';
import type { Lead } from '@/types/api';

interface DeleteConfirmModalProps {
  lead: Lead;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({
  lead,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps): React.JSX.Element {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteLeadApi(lead._id);
      onConfirm();
      onClose();
    } catch (err: unknown) {
      setError(extractApiError(err));
      setIsDeleting(false);
    }
  };

  const footer = (
    <>
      <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isDeleting}>
        Cancel
      </Button>
      <Button
        type="button"
        variant="danger"
        size="sm"
        isLoading={isDeleting}
        onClick={() => void handleDelete()}
      >
        {isDeleting ? 'Deleting…' : 'Delete Lead'}
      </Button>
    </>
  );

  return (
    <Modal isOpen onClose={onClose} title="Delete Lead" size="sm" footer={footer}>
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
          <AlertTriangle size={28} />
        </div>

        <div>
          <p className="text-sm font-display text-stone-700 dark:text-obsidian-200 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-stone-900 dark:text-obsidian-100">
              {lead.name}
            </span>
            ?
          </p>
          <p className="text-xs text-stone-400 dark:text-obsidian-500 mt-1.5 font-display">
            This action cannot be undone.
          </p>
        </div>

        {error && (
          <div className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
            <p className="text-sm text-red-400 font-display">{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Tag, Globe } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormSelect } from './FormSelect';
import { createLeadApi, updateLeadApi } from '@/api/leads.api';
import { extractApiError } from '@/api/client';
import {
  createLeadSchema,
  updateLeadSchema,
  STATUS_VALUES,
  SOURCE_VALUES,
  type CreateLeadInput,
  type UpdateLeadInput,
} from '@/schemas/leads.schema';
import type { Lead } from '@/types/api';

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onClose: () => void;
}

/* ── LeadForm ──────────────────────────────────────────────────── */
export function LeadForm({ lead, onSuccess, onClose }: LeadFormProps): React.JSX.Element {
  const isEdit = lead !== undefined;
  const [apiError, setApiError] = useState<string | null>(null);

  // Use appropriate schema based on mode
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput | UpdateLeadInput>({
    resolver: zodResolver(isEdit ? updateLeadSchema : createLeadSchema),
    defaultValues: isEdit
      ? {
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
        }
      : {
          status: 'New',
          source: SOURCE_VALUES[0],
        },
  });

  const currentStatus = watch('status') ?? 'New';
  const currentSource = watch('source') ?? SOURCE_VALUES[0];

  const onSubmit = async (data: CreateLeadInput | UpdateLeadInput): Promise<void> => {
    setApiError(null);
    try {
      if (isEdit && lead) {
        await updateLeadApi(lead._id, data);
      } else {
        await createLeadApi(data as CreateLeadInput);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setApiError(extractApiError(err));
    }
  };

  const footer = (
    <>
      <Button type="button" variant="secondary" size="sm" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" form="lead-form" variant="primary" size="sm" isLoading={isSubmitting}>
        {isSubmitting
          ? isEdit
            ? 'Saving…'
            : 'Adding…'
          : isEdit
            ? 'Save Changes'
            : 'Add Lead'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Lead' : 'Add Lead'}
      size="md"
      footer={footer}
    >
      {apiError && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
          <p className="text-sm text-red-400 font-display">{apiError}</p>
        </div>
      )}

      <form
        id="lead-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          label="Name"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          leftIcon={<User size={14} />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          leftIcon={<Mail size={14} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-3">
          {/* Source is always visible */}
          <FormSelect
            label="Source"
            id="lead-source"
            options={SOURCE_VALUES.map((s) => ({ value: s, label: s }))}
            value={currentSource ?? SOURCE_VALUES[0] ?? 'Website'}
            onChange={(v) => setValue('source', v as typeof SOURCE_VALUES[number])}
            disabled={isSubmitting}
            icon={<Globe size={14} />}
            error={errors.source?.message}
          />

          {/* Status only in edit mode */}
          {isEdit && (
            <FormSelect
              label="Status"
              id="lead-status"
              options={STATUS_VALUES.map((s) => ({ value: s, label: s }))}
              value={currentStatus ?? 'New'}
              onChange={(v) => setValue('status', v as typeof STATUS_VALUES[number])}
              disabled={isSubmitting}
              icon={<Tag size={14} />}
              error={errors.status?.message}
            />
          )}
        </div>
      </form>
    </Modal>
  );
}

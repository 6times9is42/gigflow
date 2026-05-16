import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Globe, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import type { Lead } from '@/types/api';

/* ── Helpers ────────────────────────────────────────────────────── */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ── BackLink ───────────────────────────────────────────────────── */
export function BackLink(): React.JSX.Element {
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

/* ── Field ──────────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function Field({ label, icon, children }: FieldProps): React.JSX.Element {
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

/* ── LeadDetailCard ─────────────────────────────────────────────── */
interface LeadDetailCardProps {
  lead: Lead;
}

export function LeadDetailCard({ lead }: LeadDetailCardProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5">
      {/* Header card */}
      <Card>
        <div className="flex items-start justify-between gap-4">
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
    </div>
  );
}

/* ── ActionsCard ────────────────────────────────────────────────── */
interface ActionsCardProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionsCard({ onEdit, onDelete }: ActionsCardProps): React.JSX.Element {
  return (
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
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

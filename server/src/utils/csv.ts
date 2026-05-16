import type { ILead } from '../models/Lead.model';

function escapeCsv(value: unknown): string {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function leadsToCsv(leads: ILead[]): string {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.status,
    l.source,
    l.createdAt.toISOString(),
  ]);
  return [headers, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
}

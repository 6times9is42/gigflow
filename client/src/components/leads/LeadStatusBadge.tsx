import { Badge, StatusDot } from '@/components/ui/Badge';
import type { Lead } from '@/types/api';

interface LeadStatusBadgeProps {
  status: Lead['status'];
  showDot?: boolean;
}

export function LeadStatusBadge({
  status,
  showDot = true,
}: LeadStatusBadgeProps): React.JSX.Element {
  return (
    <Badge variant={status}>
      {showDot && <StatusDot status={status} />}
      {status}
    </Badge>
  );
}

import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function LeadDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
        <FileText size={32} />
      </div>
      <h2 className="text-lg font-semibold font-display text-stone-800 dark:text-obsidian-100">
        Lead Detail
      </h2>
      <p className="text-sm text-stone-500 dark:text-obsidian-400 mt-1 font-mono-data">
        ID: {id}
      </p>
      <p className="text-sm text-stone-400 dark:text-obsidian-500 mt-1 font-display">
        Coming in Phase 5
      </p>
    </div>
  );
}

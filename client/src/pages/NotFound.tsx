import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-obsidian-950 px-4">
      <div className="text-center animate-slide-up">
        {/* Big 404 */}
        <p className="text-[120px] leading-none font-bold font-mono-data text-stone-200 dark:text-obsidian-800 select-none">
          404
        </p>
        <div className="-mt-4">
          <h1 className="text-2xl font-bold font-display text-stone-900 dark:text-obsidian-100">
            Page not found
          </h1>
          <p className="text-stone-500 dark:text-obsidian-400 mt-2 text-sm font-display max-w-xs mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="mt-8">
          <Link to="/leads">
            <Button variant="primary" size="md">
              <ArrowLeft size={14} />
              Back to Leads
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

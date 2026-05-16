import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import LeadsListPage from '@/pages/leads/LeadsListPage';
import LeadDetailPage from '@/pages/leads/LeadDetailPage';
import NotFound from '@/pages/NotFound';
import Shell from '@/components/layout/Shell';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

function ProtectedRoute({ children }: { children: ReactNode }): React.JSX.Element {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50 dark:bg-obsidian-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Shell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/leads" replace /> },
      { path: 'leads', element: <LeadsListPage /> },
      { path: 'leads/:id', element: <LeadDetailPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export function AppRouter(): React.JSX.Element {
  return <RouterProvider router={router} />;
}

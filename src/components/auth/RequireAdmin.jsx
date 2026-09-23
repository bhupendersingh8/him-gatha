import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function RequireAdmin({ children }) {
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans" aria-busy="true">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm tracking-wider uppercase opacity-80 text-[var(--text-secondary)]">Checking access…</p>
        </div>
      </main>
    );
  }

  if (!user) return <Navigate to="/him-admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 md:px-8">
      <SEOHead 
        title="Record Not Found | HIM GATHA"
        description="The requested cultural record or path does not exist in the archive."
      />

      <div className="max-w-md w-full text-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(142,40,0,0.08)] text-[var(--accent-color)] mb-4 font-serif text-2xl font-bold">
          404
        </div>

        <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-3">
          Sacred Path Not Found
        </h1>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
          The deity record, festival page, or sacred path you requested does not exist in the HIM GATHA digital archive or may have been relocated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-color)] text-white font-medium text-sm hover:opacity-95 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return to Sanctuary</span>
          </Link>

          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-medium text-sm hover:border-[var(--accent-color)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
          >
            <Compass className="w-4 h-4 text-[var(--accent-gold)]" aria-hidden="true" />
            <span>Explore Archive</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

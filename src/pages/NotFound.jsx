import { Link } from 'react-router-dom';
import { Compass, Home, Mountain } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      <SEOHead 
        title="Sacred Trail Lost | HIM GATHA"
        description="The requested cultural record or trail does not exist in the digital archive."
      />

      <div className="max-w-lg w-full text-center archival-plate border border-[var(--border-gold-subtle)] p-8 md:p-12 shadow-luxury relative overflow-hidden">
        {/* Subtle Himalayan Mountain Peak Emblem */}
        <div className="w-16 h-16 rounded-full bg-[var(--accent-color)]/10 border border-[var(--border-gold-subtle)] mx-auto flex items-center justify-center mb-5 text-[var(--accent-color)] shadow-sm">
          <Mountain className="w-8 h-8 text-[var(--accent-gold)]" aria-hidden="true" />
        </div>

        <span className="archival-stamp mb-3">
          Error 404 • Lost in the Pir Panjal Mist
        </span>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-3 mt-2">
          Sacred Path Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-8 max-w-sm mx-auto font-sans">
          The deity record, festival folio, or mountain pass you sought does not exist in the HIM GATHA archive, or may have been re-catalogued by our curators.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return to Sanctuary</span>
          </Link>

          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold text-xs tracking-wide hover:border-[var(--accent-gold)] transition-colors shadow-sm cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[var(--accent-gold)]" aria-hidden="true" />
            <span>Explore 222 Deities</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

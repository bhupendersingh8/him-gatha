import { Link } from 'react-router-dom';
import { Shield, Sparkles, BookOpen, Compass, Calendar, HeartHandshake } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer 
      aria-label="Cultural Archive Footer"
      className="w-full bg-[var(--bg-secondary)]/90 border-t border-[var(--border-gold-subtle)] mt-auto py-14 px-4 sm:px-6 lg:px-8 text-[var(--text-secondary)] font-sans transition-colors duration-200 shadow-luxury"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        
        {/* Mission Statement */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link 
            to="/" 
            className="w-fit flex items-center gap-2.5 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-sm"
          >
            <span className="text-2xl font-serif font-bold text-gradient-gold">
              हिम गाथा
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--accent-gold)] font-mono font-bold border-l border-[var(--border-gold-subtle)] pl-2.5">
              HIM GATHA ARCHIVE
            </span>
          </Link>

          <p className="text-sm leading-relaxed text-[var(--text-secondary)] max-w-md font-sans">
            A digital cultural archive dedicated to preserving the living traditions, sacred deities, village oracles (<span className="italic font-serif text-[var(--text-primary)]">Gur</span>), temple custodians (<span className="italic font-serif text-[var(--text-primary)]">Kardar</span>), and vernacular timber architecture of Himachal Pradesh. Core cultural records and event calendars are bundled for resilient offline browsing.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] pt-2 font-mono">
            <span className="inline-flex items-center gap-1.5 text-[var(--accent-gold)] font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
              <span>222 Deity Records</span>
            </span>
            <span className="text-[var(--border-color)]">•</span>
            <span>12 Sacred Districts</span>
            <span className="text-[var(--border-color)]">•</span>
            <span>Living Oral Histories</span>
          </div>
        </div>

        {/* Explore Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono">
            {t('explore') || 'Explore'}
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link 
                to="/" 
                className="hover:text-[var(--accent-crimson)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-sm"
              >
                <span>{t('home')}</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/explore" 
                className="hover:text-[var(--accent-crimson)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-sm"
              >
                <Compass className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                <span>Sacred Atlas & Archive</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/calendar" 
                className="hover:text-[var(--accent-crimson)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                <span>{t('dev_melas')}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contribute & Archival Governance */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono">
            {t('contribute')}
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link 
                to="/contribute" 
                className="hover:text-[var(--accent-crimson)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-sm"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                <span>Submit Deity Record</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/contribute" 
                className="hover:text-[var(--accent-crimson)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-sm"
              >
                <span>Submission Guidelines</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/him-admin/login" 
                className="hover:text-[var(--accent-crimson)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-sm"
              >
                <Shield className="w-3.5 h-3.5 text-[var(--accent-color)]" aria-hidden="true" />
                <span>Kardar / Admin Portal</span>
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Archival Notice */}
      <div className="max-w-7xl mx-auto border-t border-[var(--border-gold-subtle)] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
        <div>
          © {currentYear} HIM GATHA Digital Cultural Archive. Preserving the living Dev-Sanskriti of Himachal Pradesh.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[var(--accent-gold)] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
            <span>Community Curated & Field Verified</span>
          </span>
          <span>•</span>
          <span>100% Offline-Resilient</span>
        </div>
      </div>
    </footer>
  );
}

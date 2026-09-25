import SEOHead from '../components/SEOHead';
import ContributionForm from '../components/ContributionForm';
import { useTranslation } from '../context/LanguageContext';
import { ScrollText, ShieldCheck } from 'lucide-react';

export default function Contribute() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 pt-24 pb-20 px-4 md:px-8 font-sans">
      <SEOHead 
        title="Contribute Cultural Record | HIM GATHA"
        description="Help document the living Dev-Sanskriti of Himachal Pradesh. Submit verified deity lore, coordinates, and photographic records."
      />

      {/* Editorial Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--border-gold-subtle)] text-[var(--accent-gold)] text-[11px] font-bold uppercase tracking-widest mb-4 font-mono shadow-sm">
          <ScrollText className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Dev-Sanskriti Living Registry • Folk Lore Archival</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4 tracking-tight">
          {t('contribute_title')}
        </h1>

        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-sans">
          {t('contribute_desc')}
        </p>

        {/* Archival Moderation Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-muted)] bg-[var(--bg-card)]/80 py-2.5 px-6 rounded-full border border-[var(--border-color)] max-w-2xl mx-auto shadow-sm">
          <span className="flex items-center gap-1.5 font-medium text-[var(--accent-gold)]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Moderated by Temple Kardars & Scholars
          </span>
          <span>•</span>
          <span>Verified Himachal Bounds (30°N–33.5°N)</span>
          <span>•</span>
          <span>Max 5MB Authentic Imagery</span>
        </div>
      </div>

      {/* Embedded Submission Form */}
      <div className="max-w-4xl mx-auto">
        <ContributionForm />
      </div>
    </div>
  );
}

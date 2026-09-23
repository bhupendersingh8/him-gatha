import SEOHead from '../components/SEOHead';
import ContributionForm from '../components/ContributionForm';
import { useTranslation } from '../context/LanguageContext';
import { ScrollText, ShieldCheck } from 'lucide-react';

export default function Contribute() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <SEOHead 
        title="Contribute Cultural Record | HIM GATHA"
        description="Help document the living Dev-Sanskriti of Himachal Pradesh. Submit verified deity lore, coordinates, and photographic records."
      />

      {/* Editorial Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(142,40,0,0.08)] border border-[rgba(142,40,0,0.15)] text-[var(--accent-color)] text-xs font-semibold mb-4">
          <ScrollText className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Community Cultural Registry</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-3">
          {t('contribute_title')}
        </h1>

        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
          {t('contribute_desc')}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" aria-hidden="true" />
            Moderated by traditional Kardars & researchers
          </span>
          <span>•</span>
          <span>Verified village bounds only (HP)</span>
          <span>•</span>
          <span>Max 5MB per authentic photograph</span>
        </div>
      </div>

      {/* Embedded Submission Form (Untouched logic) */}
      <div className="max-w-4xl mx-auto">
        <ContributionForm />
      </div>
    </div>
  );
}

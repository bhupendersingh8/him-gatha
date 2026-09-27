import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

export default function DeityCard({ deity }) {
  const { lang, t } = useTranslation();
  const [imgError, setImgError] = useState(false);

  // Detect architectural style from description for an editorial badge
  const architectureStyle = useMemo(() => {
    if (!deity?.description) return null;
    const desc = deity.description.toLowerCase();
    if (desc.includes('kath-kuni') || desc.includes('kath kuni')) return 'Kath-Kuni';
    if (desc.includes('pagoda')) return 'Pagoda';
    if (desc.includes('pent-roof') || desc.includes('pent roof')) return 'Pent-Roof';
    if (desc.includes('shikhara')) return 'Shikhara';
    if (desc.includes('roofless') || desc.includes('open-air')) return 'Open-Air';
    return null;
  }, [deity]);

  if (!deity) return null;

  const displayName = lang === 'hi' && deity.name_hi ? deity.name_hi : deity.name;
  const secondaryName = lang === 'hi' ? deity.name : deity.name_hi;
  const displayDistrict = lang === 'hi' && deity.district_hi ? deity.district_hi : deity.district;
  const displayDesc = lang === 'hi' && deity.description_hi ? deity.description_hi : (deity.description || "A sacred entity of Dev-Sanskriti.");

  const imgSrc = deity.imageUrl || (deity.images && deity.images.length > 0 ? deity.images[0] : null);

  const fullLocation = deity.village 
    ? `${deity.village}, ${displayDistrict}` 
    : (deity.region ? `${deity.region}, ${displayDistrict}` : displayDistrict);

  return (
    <Link 
      to={`/deity/${deity.slug || deity.id}`}
      className="group no-underline block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-2xl"
    >
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -5 }}
        className="bg-[var(--bg-card)] border border-[var(--border-color)] group-hover:border-[var(--accent-gold)]/60 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-luxury-hover transition-all duration-300 relative"
      >
        {/* Top Accent Rim on Hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-color)] via-[var(--accent-gold)] to-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

        {/* Card Image Frame */}
        <div className="h-52 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-card)] flex items-center justify-center relative overflow-hidden border-b border-[var(--border-color)]">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={deity.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-[var(--bg-secondary)] to-stone-950 flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="w-16 h-16 rounded-2xl border border-[var(--accent-gold)]/40 flex flex-col items-center justify-center bg-[var(--accent-gold)]/10 shadow-inner mb-2 group-hover:scale-105 group-hover:border-[var(--accent-gold)] transition-all duration-300 relative">
                <Landmark className="w-7 h-7 text-[var(--accent-gold)] mb-0.5" />
                <span className="text-[11px] font-serif text-[var(--accent-gold)] font-bold">
                  {deity.name?.charAt(0) || 'ॐ'}
                </span>
              </div>
              <span className="text-xs text-[var(--accent-gold)] font-mono font-bold uppercase tracking-wider z-10">
                {displayDistrict} • देव स्थान
              </span>
            </div>
          )}

          {/* District & Architecture Floating Badges */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-sm">
              {displayDistrict}
            </span>
            {architectureStyle && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-amber-950/80 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow-sm hidden sm:inline-block">
                {architectureStyle}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded-md text-xs font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-stone-300 border border-white/10 font-bold">
              #{deity.id}
            </span>
          </div>
        </div>
        
        {/* Body Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between relative z-10 bg-[var(--bg-card)]">
          <div>
            <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-2 leading-snug">
              {displayName}
            </h3>
            {secondaryName && secondaryName !== displayName && (
              <p className="text-xs text-[var(--text-muted)] font-serif italic mb-2 line-clamp-1">
                {secondaryName}
              </p>
            )}
            
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed mt-2 font-sans">
              {displayDesc}
            </p>
          </div>
          
          <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
            <div 
              className="flex items-center text-xs text-[var(--text-muted)] gap-1.5 font-medium min-w-0 flex-1"
              title={fullLocation}
            >
              <MapPin className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" aria-hidden="true" />
              <span className="truncate">{fullLocation}</span>
            </div>
            
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-color)] uppercase tracking-wider font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>{t('view_lore') || 'Explore'}</span>
              <ArrowRight className="w-3 h-3 text-[var(--accent-gold)]" aria-hidden="true" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

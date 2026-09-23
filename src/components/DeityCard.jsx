import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

export default function DeityCard({ deity }) {
  const { lang, t } = useTranslation();
  const [imgError, setImgError] = useState(false);

  if (!deity) return null;

  const displayName = lang === 'hi' && deity.name_hi ? deity.name_hi : deity.name;
  const displayDistrict = lang === 'hi' && deity.district_hi ? deity.district_hi : deity.district;
  const displayDesc = lang === 'hi' && deity.description_hi ? deity.description_hi : (deity.description || "A sacred entity of Dev-Sanskriti.");

  const imgSrc = deity.imageUrl || (deity.images && deity.images.length > 0 ? deity.images[0] : null);

  return (
    <Link 
      to={`/deity/${deity.id}`}
      className="vengeance-card glowing-border overflow-hidden flex flex-col h-full border border-[var(--border-color)] group no-underline block"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col h-full w-full"
      >
        {/* Card Image Header with fallback placeholder */}
        <div className="h-44 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] flex items-center justify-center relative overflow-hidden border-b border-[var(--border-color)]">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={deity.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-card)] flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#b8860b_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-14 h-14 rounded-full border border-[var(--accent-color)]/30 flex items-center justify-center bg-[var(--accent-color)]/5 shadow-inner mb-1 group-hover:scale-110 group-hover:border-[var(--accent-color)] transition-all duration-500">
                <span className="text-[var(--accent-color)] font-serif italic text-3xl font-bold tracking-widest drop-shadow-sm">
                  {deity.name?.charAt(0) || 'ॐ'}
                </span>
              </div>
              <span className="text-[10px] text-[var(--accent-color)] font-bold uppercase tracking-widest opacity-80 font-sans z-10">
                {displayDistrict} • देव स्थान
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col relative z-10 bg-[var(--bg-card)] pt-6">
          <h3 className="text-lg font-serif text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-color)] transition-colors line-clamp-2 min-h-[3.25rem]">{displayName}</h3>
          <p className="text-xs text-[var(--accent-color)] font-bold uppercase tracking-wider mb-3">{displayDistrict}</p>
          
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-6 flex-1 leading-relaxed">
            {displayDesc}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center text-xs text-[var(--text-muted)] gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              {deity.region || displayDistrict}
            </div>
            
            <span className="flex items-center gap-1 text-xs text-[var(--text-primary)] font-bold tracking-wider uppercase group-hover:text-[var(--accent-color)] transition-colors">
              {t('view_lore')} <Info className="w-3.5 h-3.5 text-[var(--accent-color)] ml-0.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}


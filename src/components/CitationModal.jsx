import { useState } from 'react';
import { X, Copy, Check, BookOpen } from 'lucide-react';

export default function CitationModal({ isOpen, onClose, deity }) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  if (!isOpen || !deity) return null;

  const year = new Date().getFullYear();
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const pageUrl = window.location.href;

  const citations = {
    iks: `HIM GATHA Digital Heritage Repository. (${year}). Record: ${deity.name} [Dev-Sanskriti Cultural Archive]. ${deity.district} District, Himachal Pradesh. Retrieved ${dateStr}, from ${pageUrl}`,
    apa: `HIM GATHA Archive. (${year}). ${deity.name} profile. HIM GATHA: Sacred Digital Atlas of Himachal Pradesh. ${pageUrl}`,
    ieee: `"${deity.name}," HIM GATHA Cultural Archive, ${deity.district} District, Himachal Pradesh, ${year}. [Online]. Available: ${pageUrl}. [Accessed: ${dateStr}].`
  };

  const handleCopy = (formatKey, text) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatKey);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="archival-plate w-full max-w-2xl rounded-3xl p-6 md:p-8 border border-[var(--border-gold-subtle)] relative shadow-luxury overflow-hidden">
        {/* Top Gold Rim */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-color)] via-[var(--accent-gold)] to-[var(--accent-color)]" />

        <button
          onClick={onClose}
          aria-label="Close Citation Modal"
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)] border border-[var(--border-gold-subtle)] shadow-sm">
            <BookOpen className="w-5 h-5 text-[var(--accent-gold)]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]">Academic &amp; Archival Citation</h2>
            <p className="text-xs text-[var(--text-secondary)] font-sans">Cite this Dev-Sanskriti archive record in IKS, APA 7th, or IEEE format for scholarly publications.</p>
          </div>
        </div>

        <div className="space-y-4 font-sans">
          {/* IKS Format */}
          <div className="p-4 bg-[var(--bg-secondary)]/70 rounded-2xl border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-color)]">IKS (Indian Knowledge Systems) Format</span>
              <button
                onClick={() => handleCopy('iks', citations.iks)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] hover:text-white text-[var(--accent-color)] rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedFormat === 'iks' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === 'iks' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed select-all font-mono bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] shadow-sm">
              {citations.iks}
            </p>
          </div>

          {/* APA 7th Format */}
          <div className="p-4 bg-[var(--bg-secondary)]/70 rounded-2xl border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)]">APA 7th Edition</span>
              <button
                onClick={() => handleCopy('apa', citations.apa)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] hover:text-white text-[var(--accent-color)] rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedFormat === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === 'apa' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed select-all font-mono bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] shadow-sm">
              {citations.apa}
            </p>
          </div>

          {/* IEEE Format */}
          <div className="p-4 bg-[var(--bg-secondary)]/70 rounded-2xl border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">IEEE Format</span>
              <button
                onClick={() => handleCopy('ieee', citations.ieee)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] hover:text-white text-[var(--accent-color)] rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedFormat === 'ieee' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === 'ieee' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed select-all font-mono bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] shadow-sm">
              {citations.ieee}
            </p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="btn-primary text-xs font-semibold cursor-pointer shadow-sm"
          >
            Close Citation
          </button>
        </div>
      </div>
    </div>
  );
}

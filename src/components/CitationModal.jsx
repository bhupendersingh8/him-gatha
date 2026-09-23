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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-2xl rounded-2xl p-6 md:p-8 border border-[var(--border-color)] relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Academic & Research Citation</h2>
            <p className="text-xs text-[var(--text-secondary)] font-sans">Cite this Dev-Sanskriti archive record in IKS, APA 7th, or IEEE format for conference papers.</p>
          </div>
        </div>

        <div className="space-y-4 font-sans">
          {/* IKS Format */}
          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">IKS (Indian Knowledge Systems) Format</span>
              <button
                onClick={() => handleCopy('iks', citations.iks)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] hover:text-white text-[var(--accent-color)] rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedFormat === 'iks' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === 'iks' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed select-all font-mono bg-[var(--bg-card)] p-2.5 rounded border border-[var(--border-color)]/50">
              {citations.iks}
            </p>
          </div>

          {/* APA 7th Format */}
          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">APA 7th Edition</span>
              <button
                onClick={() => handleCopy('apa', citations.apa)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] hover:text-white text-[var(--accent-color)] rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedFormat === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === 'apa' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed select-all font-mono bg-[var(--bg-card)] p-2.5 rounded border border-[var(--border-color)]/50">
              {citations.apa}
            </p>
          </div>

          {/* IEEE Format */}
          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">IEEE Format</span>
              <button
                onClick={() => handleCopy('ieee', citations.ieee)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] hover:text-white text-[var(--accent-color)] rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedFormat === 'ieee' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === 'ieee' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed select-all font-mono bg-[var(--bg-card)] p-2.5 rounded border border-[var(--border-color)]/50">
              {citations.ieee}
            </p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[var(--accent-color)] text-white rounded-lg text-xs font-bold hover:bg-[var(--accent-crimson)] transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

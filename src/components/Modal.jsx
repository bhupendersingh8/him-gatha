import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative glass rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in shadow-2xl border border-[var(--border-color)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
          <h2 className="text-xl font-serif text-[var(--text-primary)]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-[var(--text-primary)]">
          {children}
        </div>
      </div>
    </div>
  );
}

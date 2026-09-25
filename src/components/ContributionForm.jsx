import { useState } from 'react';
import { Send, Upload, X, Loader2 } from 'lucide-react';
import { useSubmissions } from '../hooks/useSubmissions';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { isFirebaseMock } from '../hooks/useAuth';
import { useTranslation } from '../context/LanguageContext';
import useSanitizeInput from '../hooks/useSanitizeInput';

export default function ContributionForm() {
  const { submitDeity } = useSubmissions();
  const { t } = useTranslation();
  const { sanitizeInput } = useSanitizeInput();
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    village: '',
    description: '',
    submitterName: '',
    submitterEmail: '',
    mapsLink: ''
  });
  
  const [attachments, setAttachments] = useState([]); // Array of strings (URLs)
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [validationError, setValidationError] = useState('');

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_TOTAL_FILES = 5;

  const isValidHttpUrl = (str) => {
    if (!str) return true;
    try {
      const parsed = new URL(str.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setValidationError('');

    if (attachments.length + files.length > MAX_TOTAL_FILES) {
      setValidationError(`Maximum ${MAX_TOTAL_FILES} image attachments allowed.`);
      return;
    }

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        setValidationError(`Invalid file type (${file.name}). Only JPG, PNG, and WEBP images are supported.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setValidationError(`File exceeds 5MB limit (${file.name}). Please choose a smaller image.`);
        return;
      }
    }

    setUploading(true);
    const mockActive = isFirebaseMock();

    try {
      const urls = [];
      for (const file of files) {
        if (mockActive) {
          // Simulate local mock upload
          const reader = new FileReader();
          const base64Url = await new Promise((resolve) => {
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(file);
          });
          urls.push(base64Url);
        } else {
          // Live Storage Upload path
          const storageRef = ref(storage, `submissions/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          urls.push(downloadUrl);
        }
      }
      setAttachments(prev => [...prev, ...urls]);
    } catch (err) {
      console.error(err);
      setValidationError("Failed to upload assets: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (formData.mapsLink && !isValidHttpUrl(formData.mapsLink)) {
      setValidationError("Invalid URL: Google Maps location must be a valid link starting with http:// or https://");
      return;
    }

    const sanitizedForm = sanitizeInput(formData);

    if (!sanitizedForm.name || !sanitizedForm.district || !sanitizedForm.village || !sanitizedForm.description) {
      setValidationError("Required fields must not contain pure HTML markup or be empty after input sanitization.");
      return;
    }

    setStatus('submitting');
    try {
      const payload = {
        name: sanitizedForm.name,
        district: sanitizedForm.district,
        village: sanitizedForm.village,
        description: sanitizedForm.description,
        submitterName: sanitizedForm.submitterName,
        submitterEmail: sanitizedForm.submitterEmail,
        mapsLink: sanitizedForm.mapsLink,
        images: attachments
      };

      await submitDeity(payload);
      setStatus('success');
      setFormData({
        name: '',
        district: '',
        village: '',
        description: '',
        submitterName: '',
        submitterEmail: '',
        mapsLink: ''
      });
      setAttachments([]);
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 font-sans">
      <div className="archival-plate rounded-3xl p-8 md:p-12 border border-[var(--border-gold-subtle)] shadow-luxury relative overflow-hidden">
        {/* Subtle Himalayan decorative watermarks */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--accent-gold)]/5 to-transparent rounded-bl-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-color)] via-[var(--accent-gold)] to-[var(--accent-color)]"></div>
        
        <div className="text-center mb-10">
          <span className="archival-stamp mb-3">
            {t('registry_contributions') || 'Archival Submission Folio'}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-3">
            {t('contribute_title')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed font-sans">
            {t('contribute_desc')}
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-12 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 animate-fade-in">
            <span className="text-4xl mb-4 block">🕉️</span>
            <h3 className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400 mb-2">Contribution Submitted Successfully</h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Your submission has been safely recorded in our local heritage queue. Traditional Kardars and coordinators will review the data details before publication.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {validationError && (
              <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                <span className="text-sm">⚠️</span> {validationError}
              </div>
            )}

            {/* Section I: Sacred Geography & Deity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]">
                <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">I. Sacred Geography &amp; Deity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="field-deity-name" className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] uppercase tracking-wider">{t('deity_name')} *</label>
                  <input 
                    id="field-deity-name"
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm shadow-sm"
                    placeholder="e.g. Shirgul Mahadev"
                  />
                </div>
                <div>
                  <label htmlFor="field-district" className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] uppercase tracking-wider">{t('district_region')} *</label>
                  <input 
                    id="field-district"
                    type="text" 
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm shadow-sm"
                    placeholder="e.g. Sirmaur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="field-village" className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] uppercase tracking-wider">{t('village_location')} *</label>
                  <input 
                    id="field-village"
                    type="text" 
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm shadow-sm"
                    placeholder="e.g. Sholai Valley"
                  />
                </div>
                <div>
                  <label htmlFor="field-maps-link" className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] uppercase tracking-wider">Google Maps Link (गूगल मैप्स लिंक) *</label>
                  <input 
                    id="field-maps-link"
                    type="url" 
                    name="mapsLink"
                    value={formData.mapsLink}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm shadow-sm"
                    placeholder="e.g. https://maps.app.goo.gl/..."
                  />
                </div>
              </div>
            </div>

            {/* Section II: Submitter Provenance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]">
                <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">II. Submitter Provenance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="field-submitter-name" className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] uppercase tracking-wider">{t('your_name')}</label>
                  <input 
                    id="field-submitter-name"
                    type="text" 
                    name="submitterName"
                    value={formData.submitterName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm shadow-sm"
                    placeholder="e.g. Devendra Sharma"
                  />
                </div>
                <div>
                  <label htmlFor="field-submitter-email" className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] uppercase tracking-wider">{t('email_address')}</label>
                  <input 
                    id="field-submitter-email"
                    type="email" 
                    name="submitterEmail"
                    value={formData.submitterEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm shadow-sm"
                    placeholder="e.g. devendra@heritage.hp"
                  />
                </div>
              </div>
            </div>

            {/* Section III: Lore Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]">
                <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">III. Oral Lore &amp; Architectural Heritage</span>
              </div>

              <div>
                <label htmlFor="field-description" className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] uppercase tracking-wider">{t('lore_details')}</label>
                <textarea 
                  id="field-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all font-sans text-sm shadow-sm resize-y leading-relaxed"
                  placeholder="Share the history, rituals, lineage details, Kath-Kuni architectural traits, or specific sacred files associated with the deity..."
                />
              </div>
            </div>

            {/* Section IV: Media Upload Component */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]">
                <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">IV. Visual Archive &amp; Photographic Evidence</span>
              </div>

              <div className="border-2 border-dashed border-[var(--border-gold-subtle)] rounded-2xl p-6 bg-[var(--bg-secondary)]/40 text-center">
                <span className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">{t('upload_visuals')}</span>
                <p className="text-[11px] text-[var(--text-muted)] mb-4 font-sans">Support JPG, PNG, WEBP images under 5MB representing the temple or sacred landscape.</p>
                
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-xs border border-[var(--border-color)] hover:border-[var(--accent-gold)] rounded-xl text-[var(--text-primary)] font-semibold cursor-pointer transition-all shadow-sm">
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-color)]" /> Uploading files...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-[var(--accent-color)]" /> {t('choose_files')}
                    </>
                  )}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden" 
                  />
                </label>

                {/* Attachments preview list */}
                {attachments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3 justify-center">
                    {attachments.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 border border-[var(--border-gold-subtle)] rounded-xl overflow-hidden group shadow-sm">
                        <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeAttachment(i)}
                          className="absolute inset-0 bg-red-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
              <button 
                type="submit" 
                disabled={status === 'submitting' || uploading}
                className="btn-primary px-8 py-3 rounded-xl text-sm font-semibold cursor-pointer shadow-luxury hover:shadow-luxury-hover"
              >
                {status === 'submitting' ? 'Recording in Archive...' : t('submit_entry')}
                <Send className="w-4 h-4" />
              </button>
            </div>
            {status === 'error' && (
              <p className="text-red-500 text-xs mt-2 text-right font-sans">An error occurred during submission. Please check inputs and try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

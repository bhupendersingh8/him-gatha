import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Scroll, 
  Users, 
  Map as MapIcon, 
  Loader2, 
  Plane, 
  Train, 
  Bus, 
  Footprints, 
  GitFork, 
  AlertCircle, 
  Play, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useDeities } from '../hooks/useDeities';
import LineageVisualizer from '../components/LineageVisualizer';
import CitationModal from '../components/CitationModal';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../context/LanguageContext';
import lineagesData from '../data/lineages.json';
import AudioNarrativePlayer from '../components/AudioNarrativePlayer';

const districtMapHi = {
  'Chamba': 'चम्बा',
  'Kangra': 'काँगड़ा',
  'Mandi': 'मंडी',
  'Kullu': 'कुल्लू',
  'Shimla': 'शिमला',
  'Kinnaur': 'किन्नौर',
  'Lahaul and Spiti': 'लाहौल और स्पीति',
  'Lahaul & Spiti': 'लाहौल और स्पीति',
  'Solan': 'सोलन',
  'Sirmaur': 'सिरमौर',
  'Bilaspur': 'बिलासपुर',
  'Hamirpur': 'हमीरपुर',
  'Una': 'ऊना'
};

const isSafeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      parsed.protocol === 'https:' &&
      (host === 'www.youtube.com' || host === 'youtube.com' || host === 'www.youtube-nocookie.com' || host === 'youtu.be')
    );
  } catch {
    return false;
  }
};

const deityNameMapHi = {
  'Shri Lakshana Devi (Lakhna Devi)': 'श्री लक्षणा देवी (लखना देवी)',
  'Devi Hidimba (Mata Hadimba)': 'देवी हिडिम्बा (माता हिडिम्बा)',
  'Kamrunag (Barbarika / Rain God)': 'कमरुनाग (बर्बरीक / वर्षा के देवता)',
  'Bijli Mahadev': 'बिजली महादेव',
  'Parashar Rishi': 'पराशर ऋषि',
  'Shri Markandeya Ji': 'श्री मार्कण्डेय जी',
  'Mahun Nag': 'माहूँ नाग',
  'Shri Shirgul Mahadev': 'श्री शिरगुल महादेव'
};

const descriptionMapHi = {
  'CH-001': 'राजा मेरु वर्मन द्वारा लगभग 700 ईस्वी में स्थापित। मुख्य कारीगर गुग्गा द्वारा लकड़ी की काठ-कुणी शैली में निर्मित यह मंदिर 1300+ वर्षों से हिमपात और भूकंपों के बीच सुरक्षित खड़ा है। यह चम्बा साम्राज्य के प्राचीन इतिहास और कलात्मकता का अद्वितीय उदाहरण है।',
  'KU-001': 'महाभारत कालीन भीम की पत्नी और घटोत्कच की माता हिडिम्बा देवी को समर्पित। यह मनाली के ढूंगरी देवदार जंगल में स्थित 1553 ईस्वी में राजा बहादुर सिंह द्वारा निर्मित चार मंजिला पैगोडा शैली का ऐतिहासिक लकड़ी का मंदिर है। यहाँ हर वर्ष मई में ढूंगरी मेला आयोजित किया जाता है।',
  'kamrunag-barbarika-rain-god': 'महाभारत के महान योद्धा वीर बर्बरीक (भीम के पौत्र) का प्रतीक, जिन्होंने भगवान कृष्ण को अपना शीश दान दिया था। रोहांडा के घने जंगलों में 3,334 मीटर की ऊंचाई पर स्थित पवित्र कमरुनाग झील के किनारे यह साधारण मंदिर स्थित है। इन्हें वर्षा के देवता के रूप में पूजा जाता है। श्रद्धालु अपनी मनोकामना पूर्ति पर झील में सोने-चांदी के सिक्के अर्पित करते हैं।'
};

export default function DeityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deities, loading, error } = useDeities();
  const [activeTab, setActiveTab] = useState('lore');
  const { t, lang } = useTranslation();

  const deity = deities?.find(d => d.id === id || d.slug === id);
  const [imgError, setImgError] = useState(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);

  const translateText = (text, field) => {
    if (!text) return '';
    if (lang === 'hi') {
      // 1. Check for pre-translated _hi fields in deity data
      if (field === 'name' && deity?.name_hi) return deity.name_hi;
      if (field === 'district' && deity?.district_hi) return deity.district_hi;
      if (field === 'description' && deity?.description_hi) return deity.description_hi;
      if (field === 'origin_story' && deity?.origin_story_hi) return deity.origin_story_hi;
      // 2. Fall back to hardcoded maps
      if (field === 'name' && deityNameMapHi[deity.name]) return deityNameMapHi[deity.name];
      if (field === 'district' && districtMapHi[deity.district]) return districtMapHi[deity.district];
      if (field === 'description') {
        if (deity && descriptionMapHi[deity.id]) return descriptionMapHi[deity.id];
        if (deity && descriptionMapHi[deity.slug]) return descriptionMapHi[deity.slug];
      }
      // 3. Return original English (no ugly prefix)
    }
    return text;
  };

  const hasLineage = deity
    ? lineagesData.some(rel => rel.deityId1 === deity.id || rel.deityId2 === deity.id)
    : false;

  const hasAdminFramework = deity
    ? Boolean(deity.gur_name || deity.kardar_name || deity.audio_url)
    : false;

  const visibleActiveTab =
    (activeTab === 'framework' && !hasAdminFramework) ||
    (activeTab === 'lineage' && !hasLineage)
      ? 'lore'
      : activeTab;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-[var(--text-secondary)]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[var(--accent-gold)]" />
        <p className="font-serif text-lg tracking-wide">{t('retrieving_records')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center text-red-500 bg-[var(--bg-card)] p-8 rounded-2xl border border-red-500/20 max-w-md shadow-lg">
          <p>Error: {error.message || String(error)}</p>
          <button onClick={() => navigate('/explore')} className="mt-4 text-[var(--accent-color)] hover:underline">Return to Sacred Atlas</button>
        </div>
      </div>
    );
  }

  if (!deity) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center bg-[var(--bg-card)] p-10 rounded-2xl border border-[var(--border-color)] max-w-md shadow-lg">
          <p className="text-xl font-serif text-[var(--text-primary)] mb-4">Deity not found in the archive.</p>
          <button onClick={() => navigate('/explore')} className="text-[var(--accent-color)] hover:underline font-semibold">Return to Sacred Atlas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 bg-[var(--bg-primary)] transition-colors duration-300">
      <SEOHead title={translateText(deity.name, 'name')} description={translateText(deity.description, 'description')} deityData={deity} />

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Cultural Breadcrumb Navigation */}
        <nav aria-label="Cultural Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-sans mb-6 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-[var(--accent-color)] transition-colors font-medium">Himachal</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-gold)]/60 shrink-0" aria-hidden="true" />
          <Link to="/explore" className="hover:text-[var(--accent-color)] transition-colors font-medium">Sacred Atlas</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-gold)]/60 shrink-0" aria-hidden="true" />
          <span className="text-[var(--text-secondary)]">{translateText(deity.district, 'district')}</span>
          {deity.village && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-gold)]/60 shrink-0" aria-hidden="true" />
              <span className="text-[var(--text-secondary)]">{deity.village}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-gold)]/60 shrink-0" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold truncate max-w-[200px]">{translateText(deity.name, 'name')}</span>
        </nav>

        {/* Back Action Button */}
        <button 
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/explore');
            }
          }}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors mb-6 text-xs uppercase font-bold tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {t('back_to_archive')}
        </button>

        {/* Hero Section — Luxury Archival Dossier */}
        <div className="bg-[var(--bg-card)] rounded-3xl overflow-hidden mb-10 border border-[var(--border-gold-subtle)] shadow-luxury relative">
          <div className="h-72 md:h-96 bg-[var(--bg-secondary)] relative flex items-center justify-center border-b border-[var(--border-gold-subtle)] overflow-hidden">
             {(deity.imageUrl || deity.images?.[0]) && !imgError ? (
               <img 
                 src={deity.imageUrl || deity.images[0]} 
                 alt={deity.name} 
                 className="absolute inset-0 w-full h-full object-cover"
                 onError={() => setImgError(true)}
               />
             ) : (
               <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                 <span className="text-[var(--accent-gold)] font-serif italic text-8xl md:text-[140px] opacity-25 drop-shadow-md">{deity.name?.charAt(0)}</span>
                 <span className="text-xs text-[var(--accent-gold)] uppercase tracking-[0.25em] -mt-4 font-bold font-mono">
                   {deity.district} District • Sacred Heritage
                 </span>
               </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/40 to-transparent pointer-events-none" />
          </div>
          
          <div className="p-8 md:p-12 relative z-10 bg-[var(--bg-card)]">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3.5 py-1.5 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Field-Verified Archival Dossier
              </span>
              <span className="px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 rounded-full text-xs font-semibold font-sans">
                {deity.category || 'Deity'} Record
              </span>
              <button
                type="button"
                onClick={() => setIsCitationModalOpen(true)}
                className="px-3.5 py-1 bg-[var(--bg-primary)] hover:bg-[var(--accent-gold)]/10 text-[var(--accent-color)] hover:text-[var(--accent-gold)] border border-[var(--border-gold-subtle)] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans transition-all cursor-pointer shadow-sm ml-auto"
              >
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Cite Record
              </button>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[var(--text-primary)] font-bold tracking-tight mb-3">
              {translateText(deity.name, 'name')}
            </h1>
            
            <div className="flex items-center gap-2 text-[var(--accent-color)] font-serif text-lg mb-6">
              <MapPin className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>{translateText(deity.district, 'district')} {deity.region && `• ${deity.region}`}</span>
              {deity.village && <span className="text-[var(--text-secondary)] font-sans text-sm">({deity.village})</span>}
            </div>

            {deity.origin_story && (
              <div className="p-6 bg-[var(--bg-secondary)]/70 rounded-2xl border-l-4 border-[var(--accent-gold)] shadow-sm">
                <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed font-serif italic">
                  "{translateText(deity.origin_story, 'origin_story').substring(0, 180)}..."
                </p>
              </div>
            )}
          </div>

          {/* Authentic Image Gallery if deity has multiple photos */}
          {deity.images && deity.images.length > 1 && (
            <div className="p-6 md:p-8 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-gold-subtle)]">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--accent-gold)] mb-4 flex items-center gap-2 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                Authentic Sacred Heritage Gallery ({deity.images.length} Archival Plates)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deity.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-[var(--border-gold-subtle)] group shadow-sm hover:shadow-luxury-hover hover:border-[var(--accent-gold)] transition-all">
                    <img 
                      src={imgUrl} 
                      alt={`${deity.name} View ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <span className="text-white text-xs font-serif italic">{deity.name} — Authentic Shrine Plate {idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Museum Gallery Tabs */}
        <div className="flex border-b border-[var(--border-gold-subtle)] mb-8 overflow-x-auto no-scrollbar gap-2">
          <button 
            onClick={() => setActiveTab('lore')}
            className={`flex items-center gap-2 px-6 py-4 font-serif text-base md:text-lg whitespace-nowrap transition-all border-b-2 rounded-t-xl cursor-pointer ${
              visibleActiveTab === 'lore' 
                ? 'border-[var(--accent-gold)] text-[var(--accent-crimson)] font-bold bg-[var(--accent-gold)]/10 shadow-sm' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
            }`}
          >
            <Scroll className="w-5 h-5 text-[var(--accent-gold)]" /> {t('sacred_lore')}
          </button>
          {hasAdminFramework && (
            <button 
              onClick={() => setActiveTab('framework')}
              className={`flex items-center gap-2 px-6 py-4 font-serif text-base md:text-lg whitespace-nowrap transition-all border-b-2 rounded-t-xl cursor-pointer ${
                visibleActiveTab === 'framework' 
                  ? 'border-[var(--accent-gold)] text-[var(--accent-crimson)] font-bold bg-[var(--accent-gold)]/10 shadow-sm' 
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
              }`}
            >
              <Users className="w-5 h-5 text-[var(--accent-gold)]" /> {t('admin_framework')}
            </button>
          )}
          <button 
            onClick={() => setActiveTab('travel')}
            className={`flex items-center gap-2 px-6 py-4 font-serif text-base md:text-lg whitespace-nowrap transition-all border-b-2 rounded-t-xl cursor-pointer ${
              visibleActiveTab === 'travel' 
                ? 'border-[var(--accent-gold)] text-[var(--accent-crimson)] font-bold bg-[var(--accent-gold)]/10 shadow-sm' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
            }`}
          >
            <MapIcon className="w-5 h-5 text-[var(--accent-gold)]" /> {t('dev_yatra_guide')}
          </button>
          {hasLineage && (
            <button 
              onClick={() => setActiveTab('lineage')}
              className={`flex items-center gap-2 px-6 py-4 font-serif text-base md:text-lg whitespace-nowrap transition-all border-b-2 rounded-t-xl cursor-pointer ${
                visibleActiveTab === 'lineage' 
                  ? 'border-[var(--accent-gold)] text-[var(--accent-crimson)] font-bold bg-[var(--accent-gold)]/10 shadow-sm' 
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
              }`}
            >
              <GitFork className="w-5 h-5 text-[var(--accent-gold)]" /> {t('sacred_lineages')}
            </button>
          )}
        </div>

        {/* Tab Content Container */}
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 md:p-12 border border-[var(--border-gold-subtle)] min-h-[420px] shadow-luxury">
          {visibleActiveTab === 'lore' && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-[var(--text-primary)] font-bold mb-4 tracking-tight flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span>{t('mythology_history')}</span>
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap font-sans text-base md:text-lg">
                  {translateText(deity.description, 'description') || "Historical records and sacred lore are currently being compiled for this entity."}
                </p>
              </div>

              {deity.origin_story && (
                <div className="p-7 bg-[var(--bg-secondary)]/70 rounded-2xl border border-[var(--border-gold-subtle)] shadow-sm">
                  <h4 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
                    <span>Origin & Oral Genesis</span>
                  </h4>
                  <p className="text-[var(--text-secondary)] font-serif italic text-base md:text-lg leading-relaxed">
                    {translateText(deity.origin_story, 'origin_story')}
                  </p>
                </div>
              )}

              {/* Visual Documentation Reel */}
              <div className="p-7 bg-gradient-to-b from-[var(--bg-secondary)]/80 to-[var(--bg-secondary)]/40 rounded-2xl border border-[var(--border-gold-subtle)] shadow-sm">
                <h4 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  Visual Documentation Reel
                </h4>
                <p className="text-sm text-[var(--text-secondary)] mb-5 font-sans">
                  Watch community-authorized traditional video footages, Melas convergence, and local rituals.
                </p>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/80 border border-[var(--border-gold-subtle)] flex flex-col items-center justify-center relative group shadow-luxury">
                  {isSafeEmbedUrl(deity.video_url || deity.youtube_url) ? (
                    <iframe
                      src={deity.video_url || deity.youtube_url}
                      title="Visual Documentation Reel"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(/assets/media__1785480599353.jpg)` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                      <div className="z-10 text-center px-4 py-8">
                        <div className="w-16 h-16 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center mx-auto mb-4 shadow-luxury hover:scale-110 transition-transform cursor-pointer ring-4 ring-white/10">
                          <Play className="w-7 h-7 ml-0.5 text-white" />
                        </div>
                        <p className="text-xs font-bold text-amber-200 uppercase tracking-widest font-mono mb-1">Authentic Dev-Sanskriti Visual Footage</p>
                        <p className="text-xs text-slate-300 max-w-sm mx-auto font-sans mb-5 leading-relaxed">
                          Search verified community documentaries, sacred yatras and darshan videos for {deity.name}.
                        </p>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent((deity.name || '') + ' temple ' + (deity.village || '') + ' ' + (deity.district || '') + ' Himachal Pradesh darshan documentary')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg no-underline cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" /> Search YouTube Darshan Videos
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {visibleActiveTab === 'framework' && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-[var(--text-primary)] font-bold mb-2 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span>{t('traditional_admin')}</span>
                </h3>
                <p className="text-sm md:text-base text-[var(--text-secondary)] font-sans">
                  The deity's sacred affairs, temple treasury, and seasonal yatras are managed through a traditional administrative framework of Kardars and Gurs.
                </p>
              </div>
              
              <div className="w-full flex flex-col gap-8">
                <div className="bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] p-8 md:p-10 rounded-2xl relative overflow-hidden group border border-[var(--accent-gold)]/30 shadow-sm">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--accent-gold)]/5 rounded-bl-full pointer-events-none"></div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-[var(--accent-gold)]/15 flex items-center justify-center text-[var(--accent-gold)]">
                      <ShieldCheck className="w-5 h-5 text-[var(--accent-gold)]" />
                    </span>
                    <span>{t('kathkuni_architecture')}</span>
                  </h2>
                  <p className="text-sm md:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
                    The temple architecture leverages the traditional Kath-Kuni technique: alternate layering of dry-bonded stone and deodar timber beams without mortar. This structure allows the walls to flex and dissipate energy during high-intensity seismic activities, serving as an ancient engineering marvel of the Himalayan region.
                  </p>
                </div>

                {deity.audio_url ? (
                  <AudioNarrativePlayer
                    src={deity.audio_url}
                    title={t('sacred_chant')}
                  />
                ) : (
                  <div className="p-6 md:p-8 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                    <h2 className="text-xl font-serif text-[var(--text-primary)] mb-3 flex items-center gap-2 font-bold">
                      <span className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                      <span>{t('sacred_chant')}</span>
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] font-sans">
                      No custom audio record is currently attached to this archive profile. Traditional audio narratives and scriptural mantras will be updated by authorized temple administrators.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-7 bg-[var(--bg-secondary)]/70 rounded-2xl border border-[var(--border-gold-subtle)] shadow-sm hover:border-[var(--accent-gold)]/50 transition-colors">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[var(--accent-color)] font-mono mb-2">
                      <span>✦ Hereditary Spiritual Medium</span>
                    </div>
                    <h4 className="text-xl font-serif text-[var(--text-primary)] font-bold mb-1">{t('current_gur')}</h4>
                    <p className="text-base text-[var(--text-secondary)] font-sans font-medium">{deity.gur_name || t('record_unavailable')}</p>
                  </div>
                  <div className="p-7 bg-[var(--bg-secondary)]/70 rounded-2xl border border-[var(--border-gold-subtle)] shadow-sm hover:border-[var(--accent-gold)]/50 transition-colors">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[var(--accent-gold)] font-mono mb-2">
                      <span>✦ Hereditary Chief Executive</span>
                    </div>
                    <h4 className="text-xl font-serif text-[var(--text-primary)] font-bold mb-1">{t('current_kardar')}</h4>
                    <p className="text-base text-[var(--text-secondary)] font-sans font-medium">{deity.kardar_name || t('record_unavailable')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {visibleActiveTab === 'travel' && (
            <div className="animate-fade-in space-y-8">
              <div className="flex items-start gap-4 p-6 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-2xl shadow-sm">
                <MapIcon className="w-6 h-6 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-1">Sacred Dev-Yatra & Heritage Explorer Guide</h4>
                  <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed">
                    This is a cultural touchpoint of Dev-Sanskriti, not a commercial tourist destination. Please observe strict sacred protocols, dress modestly, and respect the local customs when visiting.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-serif text-[var(--text-primary)] font-bold mb-4">{t('pilgrimage_info')}</h3>
                <div className="space-y-4">
                  <div className="flex border-b border-[var(--border-color)] pb-4">
                    <div className="w-1/3 text-[var(--text-muted)] font-medium text-sm">Primary Shrine</div>
                    <div className="w-2/3 text-[var(--text-primary)] font-medium text-sm">{deity.village || 'Main village temple'}</div>
                  </div>
                  <div className="flex border-b border-[var(--border-color)] pb-4">
                    <div className="w-1/3 text-[var(--text-muted)] font-medium text-sm">Key Festivals</div>
                    <div className="w-2/3 text-[var(--text-primary)] font-medium text-sm">{deity.festivals || 'Local Fairs (Mela)'}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-[var(--text-primary)] font-serif text-xl font-bold mb-4">{t('how_to_reach')}</div>
                
                {deity.transport ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {deity.transport.air && (
                      <div className="bg-[var(--bg-secondary)]/60 p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-gold)]/40 transition-colors shadow-sm">
                        <div className="flex items-center gap-2 text-sky-600 font-semibold mb-2">
                          <Plane className="w-4 h-4" /> {t('by_air')}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{deity.transport.air}</p>
                      </div>
                    )}
                    
                    {deity.transport.rail && (
                      <div className="bg-[var(--bg-secondary)]/60 p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-gold)]/40 transition-colors shadow-sm">
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                          <Train className="w-4 h-4" /> {t('by_train')}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{deity.transport.rail}</p>
                      </div>
                    )}

                    {deity.transport.road && (
                      <div className="bg-[var(--bg-secondary)]/60 p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-gold)]/40 transition-colors shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                          <Bus className="w-4 h-4" /> {t('by_road')}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{deity.transport.road}</p>
                      </div>
                    )}

                    {deity.transport.trek && (
                      <div className="bg-[var(--bg-secondary)]/60 p-5 rounded-2xl border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/5 shadow-sm">
                        <div className="flex items-center gap-2 text-[var(--accent-gold)] font-semibold mb-2">
                          <Footprints className="w-4 h-4" /> {t('sacred_trek')}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{deity.transport.trek}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-secondary)]/60 p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                        <Bus className="w-4 h-4" /> Standard Route
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                        To reach the sacred site, you can take an HRTC bus or private taxi from the main {deity.district} district bus stand. Local transport connects the district headquarters directly to the base village.
                      </p>
                    </div>
                    <div className="bg-[var(--bg-secondary)]/60 p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                      <div className="flex items-center gap-2 text-sky-600 font-semibold mb-2">
                        <Plane className="w-4 h-4" /> Nearest Transit
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                        The closest major railhead is the nearest broad-gauge railway station. Depending on the district, Shimla (Jubbarhatti), Bhuntar (Kullu), or Gaggal (Kangra) are the nearest airports.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Google Maps / Geographical Topography Route */}
              <div className="bg-[var(--bg-secondary)]/60 p-7 rounded-2xl border border-[var(--border-gold-subtle)] mt-8 shadow-sm">
                <h4 className="text-lg font-serif text-[var(--text-primary)] mb-3 flex items-center gap-2 font-bold">
                  <MapPin className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span>Geospatial Topography & Route Coordinates</span>
                </h4>
                <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed font-sans">
                  Due to community-designated sacred space obfuscation rules, the coordinates displayed represent the generalized locality base of <b>{deity.village || 'Main shrine locality'} ({deity.district} District)</b>. This protects restricted heritage spots while enabling researchers to understand regional yatras.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  {deity.coordinates?.lat && deity.coordinates?.lng ? (
                    <div className="font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] px-4 py-2.5 rounded-xl border border-[var(--border-color)] shadow-inner">
                      Latitude: {deity.coordinates.lat} | Longitude: {deity.coordinates.lng}
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--text-muted)] italic font-sans">
                      Coordinates not yet verified for this sacred site.
                    </div>
                  )}
                  <a
                    href={deity.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((deity.name || '') + ' Temple ' + (deity.village || '') + ' ' + (deity.district || '') + ' Himachal Pradesh')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[var(--accent-color)] text-white font-bold rounded-xl text-xs hover:bg-[var(--accent-crimson)] transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-luxury cursor-pointer no-underline"
                  >
                    Open Google Maps Route
                  </a>
                </div>
              </div>

            </div>
          )}

          {visibleActiveTab === 'lineage' && (
            <div className="animate-fade-in">
              <LineageVisualizer currentDeityId={deity.id} />
            </div>
          )}
        </div>
      </div>

      <CitationModal 
        isOpen={isCitationModalOpen} 
        onClose={() => setIsCitationModalOpen(false)} 
        deity={deity} 
      />
    </div>
  );
}

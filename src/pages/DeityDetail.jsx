import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Scroll, Users, Map as MapIcon, Loader2, Plane, Train, Bus, Footprints, GitFork, AlertCircle, Play, ShieldCheck, BookOpen, ChevronRight } from 'lucide-react';
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
      <div className="min-h-screen pt-20 pb-10 flex flex-col items-center justify-center text-[var(--text-secondary)]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[var(--accent-color)]" />
        <p className="font-serif text-lg">{t('retrieving_records')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
        <div className="text-center text-red-500 glass p-8 rounded-xl border border-red-500/20 max-w-md">
          <p>Error: {error.message || String(error)}</p>
          <button onClick={() => navigate('/explore')} className="mt-4 text-[var(--accent-color)] hover:underline">Return to Sacred Atlas</button>
        </div>
      </div>
    );
  }

  if (!deity) {
    return (
      <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
        <div className="text-center glass p-8 rounded-xl border border-[var(--border-color)] max-w-md">
          <p className="text-xl font-serif text-[var(--text-primary)] mb-4">Deity not found in the archive.</p>
          <button onClick={() => navigate('/explore')} className="text-[var(--accent-color)] hover:underline">Return to Sacred Atlas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <SEOHead title={translateText(deity.name, 'name')} description={translateText(deity.description, 'description')} deityData={deity} />

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Cultural Breadcrumb Navigation */}
        <nav aria-label="Cultural Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-sans mb-4 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-[var(--accent-color)] transition-colors">Himachal</Link>
          <ChevronRight className="w-3 h-3 text-[var(--border-color)] shrink-0" aria-hidden="true" />
          <Link to="/explore" className="hover:text-[var(--accent-color)] transition-colors">Sacred Atlas</Link>
          <ChevronRight className="w-3 h-3 text-[var(--border-color)] shrink-0" aria-hidden="true" />
          <span className="text-[var(--text-secondary)]">{translateText(deity.district, 'district')}</span>
          {deity.village && (
            <>
              <ChevronRight className="w-3 h-3 text-[var(--border-color)] shrink-0" aria-hidden="true" />
              <span className="text-[var(--text-secondary)]">{deity.village}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-[var(--border-color)] shrink-0" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-semibold truncate max-w-[200px]">{translateText(deity.name, 'name')}</span>
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
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> {t('back_to_archive')}
        </button>

        {/* Hero Section */}
        <div className="bg-[var(--bg-card)] rounded-2xl overflow-hidden mb-8 border border-[var(--border-color)] shadow-sm">
          <div className="h-64 md:h-80 bg-[var(--bg-secondary)] relative flex items-center justify-center border-b border-[var(--border-color)] overflow-hidden">
             {(deity.imageUrl || deity.images?.[0]) && !imgError ? (
               <img 
                 src={deity.imageUrl || deity.images[0]} 
                 alt={deity.name} 
                 className="absolute inset-0 w-full h-full object-cover opacity-80"
                 onError={() => setImgError(true)}
               />
             ) : (
               <div className="relative z-10 flex flex-col items-center justify-center">
                 <span className="text-[var(--accent-color)] font-serif italic text-8xl md:text-[150px] opacity-20 drop-shadow-lg">{deity.name?.charAt(0)}</span>
                 <span className="text-xs text-[var(--accent-color)] uppercase tracking-widest -mt-4 opacity-70 font-semibold font-sans">{deity.district} District • Sacred Heritage</span>
               </div>
             )}
          </div>
          
          <div className="p-8 md:p-12 relative z-10 bg-[var(--bg-card)]">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <ShieldCheck className="w-3.5 h-3.5" /> Documented Cultural Profile
              </span>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-xs font-semibold font-sans">
                {deity.category || 'Deity'} Record
              </span>
              <button
                type="button"
                onClick={() => setIsCitationModalOpen(true)}
                className="px-3 py-1 bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-sans transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Cite Record
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">{translateText(deity.name, 'name')}</h1>
            <div className="flex items-center gap-2 text-[var(--accent-color)] font-medium text-lg mb-4">
              <MapPin className="w-5 h-5" />
              {translateText(deity.district, 'district')} {deity.region && `• ${deity.region}`}
            </div>
            {deity.origin_story && (
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl font-sans italic">
                "{translateText(deity.origin_story, 'origin_story').substring(0, 150)}..."
              </p>
            )}
          </div>

          {/* Authentic Image Gallery if deity has multiple photos */}
          {deity.images && deity.images.length > 1 && (
            <div className="p-6 md:p-8 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--accent-color)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]"></span> Authentic Sacred Heritage Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deity.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-[var(--border-color)] group">
                    <img 
                      src={imgUrl} 
                      alt={`${deity.name} View ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-serif italic">{deity.name} — Authentic Shrine View {idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)] mb-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('lore')}
            className={`flex items-center gap-2 px-6 py-4 font-serif text-lg whitespace-nowrap transition-colors border-b-2 ${visibleActiveTab === 'lore' ? 'border-[var(--accent-color)] text-[var(--accent-color)] font-semibold' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Scroll className="w-5 h-5" /> {t('sacred_lore')}
          </button>
          {hasAdminFramework && (
            <button 
              onClick={() => setActiveTab('framework')}
              className={`flex items-center gap-2 px-6 py-4 font-serif text-lg whitespace-nowrap transition-colors border-b-2 ${visibleActiveTab === 'framework' ? 'border-[var(--accent-color)] text-[var(--accent-color)] font-semibold' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <Users className="w-5 h-5" /> {t('admin_framework')}
            </button>
          )}
          <button 
            onClick={() => setActiveTab('travel')}
            className={`flex items-center gap-2 px-6 py-4 font-serif text-lg whitespace-nowrap transition-colors border-b-2 ${visibleActiveTab === 'travel' ? 'border-[var(--accent-color)] text-[var(--accent-color)] font-semibold' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <MapIcon className="w-5 h-5" /> {t('dev_yatra_guide')}
          </button>
          {hasLineage && (
            <button 
              onClick={() => setActiveTab('lineage')}
              className={`flex items-center gap-2 px-6 py-4 font-serif text-lg whitespace-nowrap transition-colors border-b-2 ${visibleActiveTab === 'lineage' ? 'border-[var(--accent-color)] text-[var(--accent-color)] font-semibold' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              <GitFork className="w-5 h-5" /> {t('sacred_lineages')}
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)] min-h-[400px] shadow-sm">
          {visibleActiveTab === 'lore' && (
            <div className="animate-fade-in space-y-6">
              <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-4">{t('mythology_history')}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap font-sans">
                {translateText(deity.description, 'description') || "Historical records and sacred lore are currently being compiled for this entity."}
              </p>
              {deity.origin_story && (
                <div className="mt-8 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                  <h4 className="text-lg font-serif text-[var(--text-primary)] mb-2">Origin</h4>
                  <p className="text-[var(--text-secondary)] font-sans italic">{translateText(deity.origin_story, 'origin_story')}</p>
                </div>
              )}

              {/* YouTube / Video Reel Embed Wrapper */}
              <div className="mt-8 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                <h4 className="text-lg font-serif text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  Visual Documentation Reel
                </h4>
                <p className="text-sm text-[var(--text-secondary)] mb-4 font-sans">
                  Watch community-authorized traditional video footages, Melas convergence, and local rituals.
                </p>
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-[var(--border-color)] flex flex-col items-center justify-center relative group">
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
                      <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(/assets/media__1785480599353.jpg)` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="z-10 text-center px-4 py-6">
                        <div className="w-14 h-14 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center mx-auto mb-3 shadow-lg hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 ml-0.5 text-white" />
                        </div>
                        <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-sans">Visual Documentation Reel</p>
                        <p className="text-[11px] text-slate-300 mt-1 max-w-sm mx-auto font-sans mb-4">
                          Search verified community documentaries, sacred yatras and darshan videos for {deity.name}.
                        </p>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent((deity.name || '') + ' temple ' + (deity.village || '') + ' ' + (deity.district || '') + ' Himachal Pradesh darshan documentary')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg no-underline"
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
            <div className="animate-fade-in space-y-6">
              <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-4">{t('traditional_admin')}</h3>
              <p className="text-[var(--text-secondary)] mb-6 font-sans">
                The deity's affairs are managed through a traditional administrative framework of Kardars and Gurs.
              </p>
              
              <div className="w-full flex flex-col gap-8">
                <div className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden group border border-[rgba(212,175,55,0.15)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)] opacity-[0.03] rounded-bl-full"></div>
                  <h2 className="text-xl font-serif text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-[var(--accent-color)]" />
                    </span>
                    {t('kathkuni_architecture')}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                    The temple architecture leverages the traditional Kath-Kuni technique: alternate layering of dry-bonded stone and deodar timber beams without mortar. This structure allows the walls to flex and dissipate energy during high-intensity seismic activities, serving as an ancient engineering marvel of the Himalayan region.
                  </p>
                </div>

                {deity.audio_url ? (
                  <AudioNarrativePlayer
                    src={deity.audio_url}
                    title={t('sacred_chant')}
                  />
                ) : (
                  <div className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden group border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                    <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                      {t('sacred_chant')}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] font-sans">
                      No custom audio record is currently attached to this archive profile. Traditional audio narratives and scriptural mantras will be updated by authorized temple administrators.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                    <h4 className="text-lg font-serif text-[var(--text-primary)] mb-2">{t('current_gur')}</h4>
                    <p className="text-[var(--text-secondary)] font-sans">{deity.gur_name || t('record_unavailable')}</p>
                  </div>
                  <div className="p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                    <h4 className="text-lg font-serif text-[var(--text-primary)] mb-2">{t('current_kardar')}</h4>
                    <p className="text-[var(--text-secondary)] font-sans">{deity.kardar_name || t('record_unavailable')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {visibleActiveTab === 'travel' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                <MapIcon className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-serif text-amber-500 mb-1">Sacred Dev-Yatra & Heritage Explorer Guide</h4>
                  <p className="text-amber-500/80 text-sm font-sans">
                    This is a cultural touchpoint of Dev-Sanskriti, not a commercial tourist destination. Please observe strict sacred protocols, dress modestly, and respect the local customs when visiting.
                  </p>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-4">{t('pilgrimage_info')}</h3>
              <div className="space-y-4">
                <div className="flex border-b border-[var(--border-color)] pb-4">
                  <div className="w-1/3 text-[var(--text-muted)] font-medium">Primary Temple</div>
                  <div className="w-2/3 text-[var(--text-secondary)]">{deity.village || 'Main village temple'}</div>
                </div>
                <div className="flex border-b border-[var(--border-color)] pb-4">
                  <div className="w-1/3 text-[var(--text-muted)] font-medium">Key Festivals</div>
                  <div className="w-2/3 text-[var(--text-secondary)]">{deity.festivals || 'Local Fairs (Mela)'}</div>
                </div>
                <div className="flex flex-col pb-4">
                  <div className="text-[var(--text-primary)] font-serif text-xl mb-4">{t('how_to_reach')}</div>
                  
                  {deity.transport ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {deity.transport.air && (
                        <div className="glass p-4 rounded-xl border border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-sky-500 font-medium mb-2">
                            <Plane className="w-4 h-4" /> {t('by_air')}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{deity.transport.air}</p>
                        </div>
                      )}
                      
                      {deity.transport.rail && (
                        <div className="glass p-4 rounded-xl border border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-indigo-500 font-medium mb-2">
                            <Train className="w-4 h-4" /> {t('by_train')}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{deity.transport.rail}</p>
                        </div>
                      )}

                      {deity.transport.road && (
                        <div className="glass p-4 rounded-xl border border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-emerald-500 font-medium mb-2">
                            <Bus className="w-4 h-4" /> {t('by_road')}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{deity.transport.road}</p>
                        </div>
                      )}

                      {deity.transport.trek && (
                        <div className="glass p-4 rounded-xl border border-[var(--border-color)] bg-amber-500/5">
                          <div className="flex items-center gap-2 text-amber-600 font-medium mb-2">
                            <Footprints className="w-4 h-4" /> {t('sacred_trek')}
                          </div>
                          <p className="text-sm text-amber-600/80 font-sans leading-relaxed">{deity.transport.trek}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass p-4 rounded-xl border border-[var(--border-color)]">
                        <div className="flex items-center gap-2 text-emerald-500 font-medium mb-2">
                          <Bus className="w-4 h-4" /> Standard Route
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                          To reach the sacred site, you can take an HRTC bus or private taxi from the main {deity.district} district bus stand. Local transport connects the district headquarters directly to the base village.
                        </p>
                      </div>
                      <div className="glass p-4 rounded-xl border border-[var(--border-color)]">
                        <div className="flex items-center gap-2 text-sky-500 font-medium mb-2">
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
                <div className="glass p-6 rounded-xl border border-[var(--border-color)] mt-6">
                  <h4 className="text-lg font-serif text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--accent-color)]" />
                    Geospatial Topography & Route Coordinates
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed font-sans">
                    Due to community-designated sacred space obfuscation rules, the coordinates displayed represent the generalized locality base of <b>{deity.village || 'Main shrine locality'} ({deity.district} District)</b>. This protects restricted heritage spots while enabling researchers to understand regional yatras.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {deity.coordinates?.lat && deity.coordinates?.lng ? (
                      <div className="font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
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
                      className="px-5 py-2.5 bg-[var(--accent-color)] text-white font-bold rounded-lg text-xs hover:bg-[var(--accent-crimson)] transition-colors duration-200 whitespace-nowrap"
                    >
                      Open Google Maps Route
                    </a>
                  </div>
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

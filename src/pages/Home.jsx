import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Calendar, 
  ArrowRight, 
  Landmark, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Flame, 
  MapPin, 
  ChevronRight,
  Scroll,
  Award
} from 'lucide-react';
import HeroSlideshow from '../components/HeroSlideshow';
import HimachalSVGMap from '../components/map/HimachalSVGMap';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../context/LanguageContext';
import deitiesData from '../data/deities.json';
import eventsData from '../data/events.json';
import { groupAndSortEvents, formatEventDate } from '../utils/eventLifecycle';

// Curated archival spotlight selections
const SPOTLIGHT_DEITIES = [
  {
    id: 'MA-005',
    slug: 'shikari-devi',
    name: 'Mata Shikari Devi',
    name_hi: 'माता शिकारी देवी',
    district: 'Mandi',
    village: 'Shikari Peak (3,359m)',
    tradition: 'Shakti / Yogini',
    architecture: 'Open-Air Stone Altar',
    image: '/assets/media__1785481969984.jpg',
    excerpt: 'Sacred roofless mountaintop sanctuary where winter blizzards fall continuously, yet snow never settles upon the open stone idols of the Goddess.'
  },
  {
    id: 'KU-002',
    slug: 'devi-hidimba-mata-hadimba',
    name: 'Devi Hidimba',
    name_hi: 'देवी हिडिम्बा',
    district: 'Kullu',
    village: 'Dhungri, Manali',
    tradition: 'Kuldevi / Mahabharata Epic',
    architecture: 'Four-Tiered Deodar Pagoda (1553 CE)',
    image: '/assets/media__1785481981665.jpg',
    excerpt: 'Surrounded by ancient deodar cedar groves, this masterwork of Himalayan timber engineering features intricate wood relief carvings of deities and animals.'
  },
  {
    id: 'MA-003',
    slug: 'kamrunag-barbarika-rain-god',
    name: 'Shri Kamrunag (Barbarika)',
    name_hi: 'श्री कमरूनाग',
    district: 'Mandi',
    village: 'Rohanda Valley (2,743m)',
    tradition: 'Lord of Rain / Mahabharata',
    architecture: 'Sacred Glacial Tarn & Stone Enclosure',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    excerpt: 'The revered Lord of Rain and supreme deity of Mandi. Devotees toss gold and silver coins into the sacred glacial lake as centuries of undisturbed offerings.'
  },
  {
    id: 'KU-003',
    slug: 'bijli-mahadev',
    name: 'Bijli Mahadev',
    name_hi: 'बिजली महादेव',
    district: 'Kullu',
    village: 'Mathaanh Hill (2,460m)',
    tradition: 'Shiva / Celestial Thunderbolt',
    architecture: 'Deodar Wood Pent-Roof & High Mast',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Perched high above the confluence of Beas and Parvati rivers. A 60-foot deodar staff attracts lightning, shattering the lingam which is rebuilt with sacred butter.'
  },
  {
    id: 'SH-001',
    slug: 'maa-bhimakali-sarahan',
    name: 'Maa Bhimakali',
    name_hi: 'माँ भीमाकाली',
    district: 'Shimla',
    village: 'Sarahan',
    tradition: 'Shakti Peetha / Bushahr State',
    architecture: 'Interlocking Kath-Kuni Timber Palace',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Former citadel-temple of the Bushahr royal dynasty, built using interlocking deodar wood and dry schist layers that have withstood major earthquakes for over 500 years.'
  },
  {
    id: 'CH-001',
    slug: 'shri-lakshana-devi-lakhna-devi',
    name: 'Shri Lakshana Devi',
    name_hi: 'श्री लक्षणा देवी',
    district: 'Chamba',
    village: 'Bharmour Town',
    tradition: 'Durga Mahishasuramardini',
    architecture: '7th Century Pent-Roof Timber Frame',
    image: '/assets/lakshana_devi.jpg',
    excerpt: 'Established c. 700 CE by King Meru Varman. Preserves the oldest standing weight-bearing deodar timber framework in North India with master carvings by craftsman Gugga.'
  }
];

export default function Home() {
  const [selectedMapDistrict, setSelectedMapDistrict] = useState('All');
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  // Dynamic statistics calculated directly from the static archival database
  const stats = useMemo(() => {
    const totalDeities = deitiesData.length;
    const districts = new Set(deitiesData.map(d => d.district).filter(Boolean));
    return {
      deitiesCount: totalDeities,
      districtsCount: districts.size
    };
  }, []);

  // Upcoming events queried via pure IST event lifecycle
  const festivalPreview = useMemo(() => {
    const { happeningNow, upcoming } = groupAndSortEvents(eventsData, new Date());
    const combined = [...happeningNow, ...upcoming];
    return combined.slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans">
      <h1 className="sr-only">HIM GATHA — Digital Cultural Archive of Himachal Pradesh</h1>
      <SEOHead 
        title="HIM GATHA — Digital Cultural Archive of Himachal Pradesh"
        description="Preserving the living Dev-Sanskriti, mountain deities, oral traditions, and sacred vernacular architecture of Himachal Pradesh."
      />

      {/* 1. Archival Hero Slideshow */}
      <div id="hero-section" className="relative">
        <HeroSlideshow />
      </div>

      {/* 2. Dynamic Archival Statistics Strip with Luxury Gilded Styling */}
      <section 
        aria-label="Archive Statistics"
        className="relative border-y border-[var(--border-gold-subtle)] bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] py-12 shadow-luxury overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--accent-gold)]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--accent-gold)]/50" />
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[var(--accent-gold)] flex items-center gap-1.5 font-semibold">
              <Award className="w-3 h-3 text-[var(--accent-gold)]" />
              Living Pahari Heritage Census • Field-Verified Archive
            </span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--accent-gold)]/50" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/60 backdrop-blur-sm group hover:border-[var(--accent-gold)]/40 transition-colors">
              <p className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-gradient-gold">
                {stats.deitiesCount}
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] mt-2">
                Deities Documented
              </p>
              <span className="text-[9px] text-[var(--text-muted)] font-mono block mt-0.5">
                Statically Bundled
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/60 backdrop-blur-sm group hover:border-[var(--accent-gold)]/40 transition-colors">
              <p className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-gradient-gold">
                {stats.districtsCount}
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] mt-2">
                Districts Represented
              </p>
              <span className="text-[9px] text-[var(--text-muted)] font-mono block mt-0.5">
                100% Geographic Coverage
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/60 backdrop-blur-sm group hover:border-[var(--accent-gold)]/40 transition-colors">
              <p className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-[var(--accent-crimson)]">
                4
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] mt-2">
                Vernacular Traditions
              </p>
              <span className="text-[9px] text-[var(--text-muted)] font-mono block mt-0.5">
                Kath-Kuni, Pagoda, Shikhara
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/60 backdrop-blur-sm group hover:border-[var(--accent-gold)]/40 transition-colors">
              <p className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-gradient-gold">
                13+
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] mt-2">
                Centuries of Lore
              </p>
              <span className="text-[9px] text-[var(--text-muted)] font-mono block mt-0.5">
                Living Oral Dynasties
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Heritage Shrines Spotlight */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 border-b border-[var(--border-gold-subtle)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/25 text-[var(--accent-gold)] text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Curated Archival Monographs</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
              {t('heritage_spotlight')}
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mt-3 leading-relaxed font-sans">
              Iconic mountain shrines representing the zenith of Pahari sacred timber architecture, oral cosmology, and regional Devta assemblies.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-gold-subtle)] bg-[var(--bg-card)] text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-crimson)] shadow-sm hover:shadow-luxury transition-all self-start md:self-end group"
          >
            <span>Explore All 222 Deities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[var(--accent-gold)]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPOTLIGHT_DEITIES.map((deity) => (
            <motion.article 
              key={deity.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-gold)]/60 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col shadow-sm hover:shadow-luxury-hover"
            >
              <div className="relative h-60 overflow-hidden bg-[var(--bg-secondary)]">
                <img 
                  src={deity.image} 
                  alt={deity.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-md text-[11px] uppercase font-bold tracking-wider bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-sm font-mono">
                    {deity.district}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-xs font-mono text-[#fde047] flex items-center gap-1.5 mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    <MapPin className="w-3.5 h-3.5 text-[#fde047]" /> {deity.village}
                  </p>
                  <h3 className="text-2xl font-serif font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {lang === 'hi' ? deity.name_hi : deity.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[11px] font-sans font-medium tracking-wide text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2.5 py-1 rounded-md border border-[var(--accent-color)]/20">
                      {deity.tradition}
                    </span>
                    <span className="text-[11px] font-sans font-medium text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2.5 py-1 rounded-md border border-[var(--accent-gold)]/30">
                      {deity.architecture}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-3">
                    {deity.excerpt}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                  <Link
                    to={`/deity/${deity.slug || deity.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-color)] group-hover:text-[var(--accent-crimson)] transition-colors"
                  >
                    <span>Read Archival Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {deity.id}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 4. Living Dev-Mela Calendar Preview */}
      <section className="border-t border-b border-[var(--border-gold-subtle)] bg-gradient-to-b from-[var(--bg-secondary)]/60 to-[var(--bg-secondary)]/30 py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/25 text-[var(--accent-gold)] text-[11px] font-bold uppercase tracking-widest mb-3">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Date-Aware Cultural Calendar</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
                {t('calendar_title')}
              </h2>
              <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mt-3 leading-relaxed">
                Live chronological schedule of sacred Jatars, palanquin gatherings, and regional Devta congregations.
              </p>
            </div>
            <Link
              to="/calendar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-color)] text-white text-sm font-semibold hover:opacity-95 transition-opacity self-start md:self-end shadow-md hover:shadow-luxury"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('view_all_festivals')}</span>
            </Link>
          </div>

          {festivalPreview.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {festivalPreview.map((event, idx) => {
                const isNow = event.derivedStatus === 'HAPPENING_NOW';
                return (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-gold)]/50 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-luxury transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isNow 
                            ? 'bg-[var(--accent-crimson)]/15 text-[var(--accent-crimson)] border border-[var(--accent-crimson)]/30 animate-pulse' 
                            : 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isNow ? 'bg-[var(--accent-crimson)]' : 'bg-[var(--accent-gold)]'}`} />
                          {isNow ? 'Happening Now' : 'Upcoming Festival'}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-muted)] font-medium">
                          {formatEventDate(event)}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[var(--accent-color)] font-medium flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--accent-color)]" />
                        <span>{event.location}</span>
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                      {event.deityId ? (
                        <Link 
                          to={`/deity/${event.deityId}`}
                          className="text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>View Deity Shrine</span>
                          <ArrowRight className="w-3 h-3 text-[var(--accent-gold)]" />
                        </Link>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] font-mono">Community Festival</span>
                      )}
                      <Link 
                        to="/calendar" 
                        className="text-xs text-[var(--accent-color)] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
              <Calendar className="w-8 h-8 text-[var(--accent-gold)] mx-auto mb-3" />
              <p className="font-serif text-lg text-[var(--text-primary)] mb-1">
                Upcoming Festival Dates Under Active Verification
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Dates for the upcoming seasonal fairs are being verified directly with traditional Kardar committees and regional temple trusts.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Living Dev-Sanskriti Traditional Governance Framework */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/25 text-[var(--accent-gold)] text-[11px] font-bold uppercase tracking-widest mb-3">
            <Landmark className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>Hereditary Custodianship & Sacred Vernacular</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4 tracking-tight">
            {t('traditional_governance')}
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
            {t('living_governance_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Gur (Oracle) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/60 rounded-2xl p-7 flex flex-col justify-between shadow-sm hover:shadow-luxury-hover transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-color)]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
            <div>
              <div className="w-13 h-13 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center mb-5 ring-1 ring-[var(--accent-color)]/20 shadow-inner">
                <Sparkles className="w-6 h-6 text-[var(--accent-color)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-1 flex items-baseline gap-2">
                <span>Gur</span>
                <span className="text-sm font-serif text-[var(--accent-color)] font-normal">(गुड़ / Oracle)</span>
              </h3>
              <p className="text-xs text-[var(--accent-color)] font-semibold tracking-wide uppercase mb-3">Divine Medium & Seer</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The spiritual medium chosen by the deity who enters a sacred altered state (*Khel*) to communicate divine commands, resolve disputes, and prophesy seasonal weather.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] font-mono font-medium uppercase tracking-wider flex items-center justify-between">
              <span>Oral Lineage</span>
              <span className="text-[var(--accent-color)]">✦ Seer</span>
            </div>
          </motion.div>

          {/* 2. Kardar (Trustee) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-gold)]/60 rounded-2xl p-7 flex flex-col justify-between shadow-sm hover:shadow-luxury-hover transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-gold)]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
            <div>
              <div className="w-13 h-13 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center mb-5 ring-1 ring-[var(--accent-gold)]/25 shadow-inner">
                <Users className="w-6 h-6 text-[var(--accent-gold)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-1 flex items-baseline gap-2">
                <span>Kardar</span>
                <span className="text-sm font-serif text-[var(--accent-gold)] font-normal">(कारदार)</span>
              </h3>
              <p className="text-xs text-[var(--accent-gold)] font-semibold tracking-wide uppercase mb-3">Chief Executive & Trustee</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The traditional administrator overseeing temple wealth, land rights, festival logistics, palanquin journeys (*Jatra*), and community welfare assemblies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] font-mono font-medium uppercase tracking-wider flex items-center justify-between">
              <span>Administrative</span>
              <span className="text-[var(--accent-gold)]">✦ Trustee</span>
            </div>
          </motion.div>

          {/* 3. Pujari (Priest) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/60 rounded-2xl p-7 flex flex-col justify-between shadow-sm hover:shadow-luxury-hover transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-color)]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
            <div>
              <div className="w-13 h-13 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center mb-5 ring-1 ring-[var(--accent-color)]/20 shadow-inner">
                <Flame className="w-6 h-6 text-[var(--accent-color)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-1 flex items-baseline gap-2">
                <span>Pujari</span>
                <span className="text-sm font-serif text-[var(--accent-color)] font-normal">(पुजारी)</span>
              </h3>
              <p className="text-xs text-[var(--accent-color)] font-semibold tracking-wide uppercase mb-3">Ritual & Liturgy Custodian</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Conducts daily *Nitya Puja*, sacred bath (*Snan*), and seasonal offerings using ancient Pahari invocations and traditional Sanskrit mantras preserved over generations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] font-mono font-medium uppercase tracking-wider flex items-center justify-between">
              <span>Liturgical</span>
              <span className="text-[var(--accent-color)]">✦ Priest</span>
            </div>
          </motion.div>

          {/* 4. Kath-Kuni Architecture */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-gold)]/60 rounded-2xl p-7 flex flex-col justify-between shadow-sm hover:shadow-luxury-hover transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-gold)]/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
            <div>
              <div className="w-13 h-13 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center mb-5 ring-1 ring-[var(--accent-gold)]/25 shadow-inner">
                <Landmark className="w-6 h-6 text-[var(--accent-gold)]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-1 flex items-baseline gap-2">
                <span>Kath-Kuni</span>
                <span className="text-sm font-serif text-[var(--accent-gold)] font-normal">(काठ-कुणी)</span>
              </h3>
              <p className="text-xs text-[var(--accent-gold)] font-semibold tracking-wide uppercase mb-3">Vernacular Mastercraft</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Ancient interlocking timber and dry schist stone masonry constructed without mortar or iron nails, imparting high earthquake flexibility across Himalayan faultlines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] font-mono font-medium uppercase tracking-wider flex items-center justify-between">
              <span>Seismic Design</span>
              <span className="text-[var(--accent-gold)]">✦ Mastercraft</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Interactive Sacred Atlas Vector Preview */}
      <section className="border-t border-[var(--border-gold-subtle)] bg-gradient-to-b from-[var(--bg-secondary)]/40 to-[var(--bg-secondary)]/10 py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/25 text-[var(--accent-color)] text-[11px] font-bold uppercase tracking-widest mb-3">
                <Compass className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>{t('sacred_topography')}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4 tracking-tight">
                {t('himachal_atlas')}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-sans">
                {t('atlas_description')}
              </p>

              <div className="bg-[var(--bg-card)] border border-[var(--border-gold-subtle)] rounded-xl p-5 mb-6 shadow-sm">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono mb-1">
                  Active Regional Focus
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-serif font-bold text-[var(--text-primary)]">
                    {selectedMapDistrict === 'All' ? 'Himachal Pradesh (Statewide)' : `${selectedMapDistrict} District`}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-bold border border-[var(--accent-color)]/20">
                    {selectedMapDistrict === 'All' 
                      ? `${stats.deitiesCount} Shrines` 
                      : `${deitiesData.filter(d => d.district === selectedMapDistrict).length} Shrines`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(selectedMapDistrict === 'All' ? '/explore' : `/explore?district=${encodeURIComponent(selectedMapDistrict)}`)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--accent-color)] text-white text-sm font-semibold hover:opacity-95 transition-opacity shadow-md hover:shadow-luxury cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore {selectedMapDistrict === 'All' ? 'Sacred Atlas' : `${selectedMapDistrict} Atlas`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMapDistrict('All')}
                  disabled={selectedMapDistrict === 'All'}
                  className="inline-flex items-center justify-center px-4 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Reset Focus
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-gold-subtle)] rounded-2xl p-6 shadow-luxury relative overflow-hidden">
              <HimachalSVGMap 
                selectedDistrict={selectedMapDistrict}
                onDistrictSelect={setSelectedMapDistrict}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Community Archival Preservation CTA */}
      <section className="border-t border-[var(--border-gold-subtle)] py-24 px-4 md:px-8 bg-gradient-to-b from-transparent to-[var(--bg-secondary)]/60">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--border-gold-subtle)] rounded-3xl p-8 md:p-16 shadow-luxury relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-gold)]/5 rounded-bl-full pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center mx-auto mb-6 ring-1 ring-[var(--accent-color)]/25 shadow-inner">
            <Scroll className="w-8 h-8 text-[var(--accent-color)]" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-gold)] font-bold block mb-3 font-mono">
            ✦ Participatory Cultural Heritage ✦
          </span>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4 tracking-tight">
            Preserve Your Valley&apos;s Sacred Lore
          </h2>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
            Every village in Himachal Pradesh carries unique oral legends, ancestral palanquin lineages, and ancient temple architectural records. Help us ensure this knowledge remains intact for future generations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contribute"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--accent-color)] text-white text-sm font-semibold hover:opacity-95 transition-opacity shadow-md hover:shadow-luxury"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Local Deity Lore</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border-gold-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm font-semibold hover:border-[var(--accent-gold)] transition-colors shadow-sm"
            >
              <span>Browse Existing Records</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

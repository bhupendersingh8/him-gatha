import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Scroll
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

      {/* 2. Dynamic Archival Statistics Strip */}
      <section 
        aria-label="Archive Statistics"
        className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/70 py-10 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-3">
              <p className="text-3xl md:text-5xl font-serif text-[var(--accent-color)] font-bold tracking-tight">
                {stats.deitiesCount}
              </p>
              <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)] mt-1.5">
                Deities Documented
              </p>
            </div>
            <div className="p-3 border-l border-[var(--border-color)]">
              <p className="text-3xl md:text-5xl font-serif text-[var(--accent-color)] font-bold tracking-tight">
                {stats.districtsCount}
              </p>
              <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)] mt-1.5">
                Districts Represented
              </p>
            </div>
            <div className="p-3 border-t md:border-t-0 md:border-l border-[var(--border-color)]">
              <p className="text-3xl md:text-5xl font-serif text-[var(--accent-gold)] font-bold tracking-tight">
                4
              </p>
              <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)] mt-1.5">
                Vernacular Traditions
              </p>
            </div>
            <div className="p-3 border-t md:border-t-0 border-l border-[var(--border-color)]">
              <p className="text-3xl md:text-5xl font-serif text-[var(--accent-gold)] font-bold tracking-tight">
                Centuries
              </p>
              <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)] mt-1.5">
                Living Oral Traditions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Heritage Shrines Spotlight */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[var(--accent-color)] block mb-1.5">
              Archival Monographs
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)]">
              {t('heritage_spotlight')}
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mt-2 leading-relaxed font-sans">
              Iconic mountain shrines representing the zenith of Pahari sacred timber architecture, oral cosmology, and regional Devta assemblies.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-color)] hover:text-[var(--accent-crimson)] transition-colors self-start md:self-end group"
          >
            <span>Explore All 222 Deities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPOTLIGHT_DEITIES.map((deity) => (
            <article 
              key={deity.id}
              className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--accent-color)]/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md"
            >
              <div className="relative h-56 overflow-hidden bg-[var(--bg-secondary)]">
                <img 
                  src={deity.image} 
                  alt={deity.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs uppercase font-bold tracking-wider bg-black/80 text-white backdrop-blur-sm border border-white/20 shadow-sm">
                    {deity.district}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-mono text-amber-300 font-medium flex items-center gap-1 mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                    <MapPin className="w-3 h-3" /> {deity.village}
                  </p>
                  <h3 className="text-xl font-serif font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {lang === 'hi' ? deity.name_hi : deity.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-sans font-medium tracking-wide text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2.5 py-1 rounded-md border border-[var(--accent-color)]/20">
                      {deity.tradition}
                    </span>
                    <span className="text-xs font-sans text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-md border border-[var(--border-color)]">
                      {deity.architecture}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans line-clamp-3">
                    {deity.excerpt}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[var(--border-color)] flex items-center justify-start">
                  <Link
                    to={`/deity/${deity.slug || deity.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-color)] group-hover:text-[var(--accent-crimson)] transition-colors"
                  >
                    <span>Read Archival Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Living Dev-Mela Calendar Preview */}
      <section className="border-t border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/40 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[var(--accent-color)] block mb-1.5">
                Date-Aware Cultural Calendar
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)]">
                {t('calendar_title')}
              </h2>
              <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mt-2 leading-relaxed">
                Live chronological schedule of sacred Jatars, palanquin gatherings, and regional Devta congregations.
              </p>
            </div>
            <Link
              to="/calendar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-color)] text-white text-sm font-semibold hover:opacity-95 transition-opacity self-start md:self-end shadow-sm"
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
                  <div 
                    key={idx}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-[var(--accent-color)]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isNow 
                            ? 'bg-green-600/10 text-green-700 border border-green-600/20 animate-pulse' 
                            : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                        }`}>
                          {isNow ? 'Happening Now' : 'Upcoming Festival'}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          {formatEventDate(event)}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-2 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[var(--accent-color)] font-medium flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{event.location}</span>
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                      {event.deityId ? (
                        <Link 
                          to={`/deity/${event.deityId}`}
                          className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>View Deity Shrine</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">Community Festival</span>
                      )}
                      <Link 
                        to="/calendar" 
                        className="text-xs text-[var(--accent-color)] hover:underline flex items-center gap-1 font-medium"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center max-w-xl mx-auto">
              <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
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
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-color)] font-bold block mb-2">
            Hereditary Custodianship & Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">
            {t('traditional_governance')}
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
            {t('living_governance_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-1">
                Gur (गुड़ / Oracle)
              </h3>
              <p className="text-xs text-[var(--accent-color)] font-medium mb-3">Divine Medium & Seer</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The spiritual medium chosen by the deity who enters a sacred altered state (*Khel*) to communicate divine commands, resolve disputes, and prophesy seasonal weather.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono font-medium">
              Hereditary Oral Lineage
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-1">
                Kardar (कारदार)
              </h3>
              <p className="text-xs text-[var(--accent-gold)] font-semibold mb-3">Chief Executive & Trustee</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The traditional administrator overseeing temple wealth, land rights, festival logistics, palanquin journeys (*Jatra*), and community welfare assemblies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono font-medium">
              Administrative Custodian
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-1">
                Pujari (पुजारी)
              </h3>
              <p className="text-xs text-[var(--accent-color)] font-semibold mb-3">Ritual & Liturgy Custodian</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Conducts daily *Nitya Puja*, sacred bath (*Snan*), and seasonal offerings using ancient Pahari invocations and traditional Sanskrit mantras preserved over generations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono font-medium">
              Liturgical Custodian
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center mb-4">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] mb-1">
                Kath-Kuni Architecture
              </h3>
              <p className="text-xs text-[var(--accent-gold)] font-semibold mb-3">Indigenous Engineering</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Ancient interlocking timber and dry schist stone masonry constructed without mortar or iron nails, imparting high earthquake flexibility across Himalayan faultlines.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono font-medium">
              Vernacular Mastercraft
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Sacred Atlas Vector Preview */}
      <section className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-color)] font-bold block mb-2">
                {t('sacred_topography')}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">
                {t('himachal_atlas')}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-sans">
                {t('atlas_description')}
              </p>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 mb-6">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono mb-1">
                  Active Regional Focus
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-serif font-bold text-[var(--text-primary)]">
                    {selectedMapDistrict === 'All' ? 'Himachal Pradesh (Statewide)' : `${selectedMapDistrict} District`}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-semibold">
                    {selectedMapDistrict === 'All' 
                      ? `${stats.deitiesCount} Shrines` 
                      : `${deitiesData.filter(d => d.district === selectedMapDistrict).length} Shrines`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(selectedMapDistrict === 'All' ? '/explore' : `/explore?district=${encodeURIComponent(selectedMapDistrict)}`)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-color)] text-white text-sm font-semibold hover:opacity-95 transition-opacity shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore {selectedMapDistrict === 'All' ? 'Sacred Atlas' : `${selectedMapDistrict} Atlas`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMapDistrict('All')}
                  disabled={selectedMapDistrict === 'All'}
                  className="inline-flex items-center justify-center px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reset Focus
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
              <HimachalSVGMap 
                selectedDistrict={selectedMapDistrict}
                onDistrictSelect={setSelectedMapDistrict}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Community Archival Preservation CTA */}
      <section className="border-t border-[var(--border-color)] py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-[var(--bg-secondary)]/60">
        <div className="max-w-4xl mx-auto text-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 md:p-14 shadow-sm relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center mx-auto mb-6">
            <Scroll className="w-7 h-7" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-color)] font-bold block mb-2">
            Participatory Cultural Heritage
          </span>

          <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">
            Preserve Your Valley&apos;s Sacred Lore
          </h2>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-8 font-sans">
            Every village in Himachal Pradesh carries unique oral legends, ancestral palanquin lineages, and ancient temple architectural records. Help us ensure this knowledge remains intact for future generations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contribute"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--accent-color)] text-white text-sm font-semibold hover:opacity-95 transition-opacity shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Local Deity Lore</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm font-semibold hover:border-[var(--accent-color)] transition-colors"
            >
              <span>Browse Existing Records</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

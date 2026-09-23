import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Search, 
  RotateCcw, 
  Layers, 
  Landmark
} from 'lucide-react';
import HimachalSVGMap from '../components/map/HimachalSVGMap';
import DeityGrid from '../components/DeityGrid';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../context/LanguageContext';
import deitiesData from '../data/deities.json';

const TRADITIONS = [
  { id: 'All', label: 'All Traditions', label_hi: 'सभी परंपराएँ' },
  { id: 'Shakti', label: 'Shakti / Devi', label_hi: 'शक्ति / देवी' },
  { id: 'Shiva', label: 'Shiva / Mahadev', label_hi: 'शिव / महादेव' },
  { id: 'Naag', label: 'Naag Devta', label_hi: 'नाग देवता' },
  { id: 'Rishi', label: 'Rishi / Sage', label_hi: 'ऋषि / मुनि' },
  { id: 'Mahasu', label: 'Mahasu Devta', label_hi: 'महासू देवता' }
];

const ARCHITECTURES = [
  { id: 'All', label: 'All Architectural Styles', label_hi: 'सभी शैलियाँ' },
  { id: 'Kath-Kuni', label: 'Kath-Kuni (Interlocking Timber)', label_hi: 'काठ-कुणी' },
  { id: 'Pagoda', label: 'Tiered Pagoda', label_hi: 'पैगोडा' },
  { id: 'Pent-roof', label: 'Pent-Roof / Gabled', label_hi: 'ढलवां छत' },
  { id: 'Shikhara', label: 'Stone Shikhara', label_hi: 'शिखर शैली' }
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, lang } = useTranslation();

  // Read initial filter values from URL params for bookmarkable states
  const initialDistrict = searchParams.get('district') || 'All';
  const initialTradition = searchParams.get('tradition') || 'All';
  const initialArchitecture = searchParams.get('architecture') || 'All';
  const initialSearch = searchParams.get('q') || '';

  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedTradition, setSelectedTradition] = useState(initialTradition);
  const [selectedArchitecture, setSelectedArchitecture] = useState(initialArchitecture);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showMap, setShowMap] = useState(true);

  // Sync state to URL search parameters without cluttering history
  useEffect(() => {
    const params = {};
    if (selectedDistrict && selectedDistrict !== 'All') params.district = selectedDistrict;
    if (selectedTradition && selectedTradition !== 'All') params.tradition = selectedTradition;
    if (selectedArchitecture && selectedArchitecture !== 'All') params.architecture = selectedArchitecture;
    if (searchQuery.trim()) params.q = searchQuery.trim();

    setSearchParams(params, { replace: true });
  }, [selectedDistrict, selectedTradition, selectedArchitecture, searchQuery, setSearchParams]);

  // Derive districts from static archival database
  const districts = useMemo(() => {
    const unique = new Set(deitiesData.map(d => d.district).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, []);

  const hasActiveFilters = selectedDistrict !== 'All' || selectedTradition !== 'All' || selectedArchitecture !== 'All' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedDistrict('All');
    setSelectedTradition('All');
    setSelectedArchitecture('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 pt-24 pb-20 px-4 md:px-8 font-sans">
      <SEOHead 
        title="Sacred Atlas & Deity Archive | HIM GATHA"
        description="Comprehensive faceted repository of 222 documented mountain shrines, deities, and sacred traditions across Himachal Pradesh."
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Title Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-color)] font-bold block mb-2">
            {t('sacred_topography')}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4">
            {t('himachal_atlas')} &amp; {t('deity_archive')}
          </h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
            Explore 222 verified mountain deities, ancient temple coordinates, sacred oral genealogies, and architectural traditions across all 12 districts of Himachal Pradesh.
          </p>
        </div>

        {/* Faceted Filter Toolbar */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm mb-10">
          <div className="flex flex-col gap-6">
            
            {/* Top Bar: Search Input & Action Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by deity name, village, oral lore, or lineage..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1.5 py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    showMap 
                      ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)]' 
                      : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>{showMap ? 'Hide Vector Map' : 'Show Vector Map'}</span>
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Selectors: Tradition & Architecture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
              <div>
                <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Sacred Tradition</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TRADITIONS.map(trad => (
                    <button
                      key={trad.id}
                      onClick={() => setSelectedTradition(trad.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                        selectedTradition === trad.id
                          ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] font-semibold shadow-sm'
                          : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
                      }`}
                    >
                      {lang === 'hi' ? trad.label_hi : trad.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Temple Architecture</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ARCHITECTURES.map(arch => (
                    <button
                      key={arch.id}
                      onClick={() => setSelectedArchitecture(arch.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                        selectedArchitecture === arch.id
                          ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] font-semibold shadow-sm'
                          : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-gold)]/50'
                      }`}
                    >
                      {lang === 'hi' ? arch.label_hi : arch.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* District Horizontal Filter Pills */}
            <div className="pt-4 border-t border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>12 Districts of Himachal</span>
                </span>
                <span className="text-xs text-[var(--text-muted)] font-serif">
                  Selected: <strong className="text-[var(--text-primary)]">{selectedDistrict}</strong>
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {districts.map(dist => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border shrink-0 ${
                      selectedDistrict === dist
                        ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] font-semibold shadow-sm'
                        : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {dist === 'All' ? 'All Districts' : dist}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Collapsible Vector Topography Atlas Map */}
        {showMap && (
          <div className="mb-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--accent-color)] font-mono block mb-1">
                  Interactive Vector Topography
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--text-primary)]">
                  Cartographic District Explorer
                </h2>
              </div>
              <span className="text-xs text-[var(--text-muted)] hidden sm:block">
                Click any district to zoom into sacred tehsils and shrine coordinates
              </span>
            </div>

            <HimachalSVGMap 
              selectedDistrict={selectedDistrict}
              onDistrictSelect={setSelectedDistrict}
            />
          </div>
        )}

        {/* Main Faceted Deity Grid */}
        <div id="deities-archive-section">
          <DeityGrid 
            globalSearch={searchQuery}
            selectedDistrict={selectedDistrict}
            onDistrictSelect={setSelectedDistrict}
            selectedCategory={selectedTradition}
            selectedArchitecture={selectedArchitecture}
          />
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Search, Filter, Loader2, X } from 'lucide-react';
import { useDeities } from '../hooks/useDeities';
import DeityCard from './DeityCard';
import { useTranslation } from '../context/LanguageContext';
import { searchDeities } from '../utils/deityEngine';

const HINDI_MAP = {
  'मंडी': 'mandi', 'मण्डी': 'mandi',
  'कुल्लू': 'kullu', 'कुलू': 'kullu',
  'चंबा': 'chamba', 'चम्बा': 'chamba',
  'कांगड़ा': 'kangra', 'काँगड़ा': 'kangra',
  'शिमला': 'shimla',
  'सोलन': 'solan',
  'सिरमौर': 'sirmaur',
  'बिलासपुर': 'bilaspur',
  'हमीरपुर': 'hamirpur',
  'ऊना': 'una', 'उना': 'una',
  'लाहौल': 'lahaul', 'स्पीति': 'spiti',
  'किन्नौर': 'kinnaur',
  'देवता': 'deity', 'देव': 'deity',
  'मंदिर': 'temple', 'मन्दिर': 'temple',
  'शिव': 'shiva', 'शंभू': 'shiva',
  'शक्ति': 'shakti', 'माता': 'devi', 'देवी': 'devi',
  'लक्ष्मी': 'lakshmi', 'नारायण': 'narayan',
  'बिजली': 'bijli', 'महादेव': 'mahadev',
  'हडिम्बा': 'hidimba', 'हिडिम्बा': 'hidimba',
  'रघुनाथ': 'raghunath'
};

function getEnglishSearchQuery(query) {
  if (!query) return '';
  let cleaned = query.toLowerCase();
  for (const [hindi, english] of Object.entries(HINDI_MAP)) {
    cleaned = cleaned.replace(new RegExp(hindi, 'g'), english);
  }
  return cleaned;
}

export default function DeityGrid({ 
  globalSearch, 
  selectedDistrict, 
  onDistrictSelect,
  selectedCategory = 'All',
  selectedArchitecture = 'All'
}) {
  const { deities, loading, error } = useDeities();
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');
  const [districtFilter, setDistrictFilter] = useState(selectedDistrict || 'All');
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(12);

  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
  const [prevDistrictFilter, setPrevDistrictFilter] = useState(districtFilter);
  const [prevCategory, setPrevCategory] = useState(selectedCategory);
  const [prevArch, setPrevArch] = useState(selectedArchitecture);

  if (searchTerm !== prevSearchTerm || districtFilter !== prevDistrictFilter || selectedCategory !== prevCategory || selectedArchitecture !== prevArch) {
    setVisibleCount(12);
    setPrevSearchTerm(searchTerm);
    setPrevDistrictFilter(districtFilter);
    setPrevCategory(selectedCategory);
    setPrevArch(selectedArchitecture);
  }

  const [prevGlobalSearch, setPrevGlobalSearch] = useState(globalSearch);
  if (globalSearch !== prevGlobalSearch) {
    setSearchTerm(globalSearch || '');
    setPrevGlobalSearch(globalSearch);
  }

  const [prevSelectedDistrict, setPrevSelectedDistrict] = useState(selectedDistrict);
  if (selectedDistrict !== prevSelectedDistrict) {
    setDistrictFilter(selectedDistrict || 'All');
    setPrevSelectedDistrict(selectedDistrict);
  }

  const handleDistrictChange = (district) => {
    setDistrictFilter(district);
    if (onDistrictSelect) {
      onDistrictSelect(district);
    }
  };

  const districts = useMemo(() => {
    if (!deities) return ['All'];
    const uniqueDistricts = new Set(deities.map(d => d.district).filter(Boolean));
    return ['All', ...Array.from(uniqueDistricts).sort()];
  }, [deities]);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const filteredDeities = useMemo(() => {
    if (!deities) return [];
    
    // First try pure domain search engine
    let results = searchDeities(deities, searchTerm, districtFilter);
    if (results.length === 0 && searchTerm) {
      const englishSearch = getEnglishSearchQuery(searchTerm);
      if (englishSearch !== searchTerm) {
        results = searchDeities(deities, englishSearch, districtFilter);
      }
    }

    // Sacred Tradition / Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase();
      results = results.filter(item => {
        const text = `${item.name} ${item.description || ''}`.toLowerCase();
        if (catLower === 'shakti') return text.includes('devi') || text.includes('mata') || text.includes('shakti') || text.includes('chamunda') || text.includes('bhagwati') || text.includes('kali');
        if (catLower === 'shiva') return text.includes('shiva') || text.includes('mahadev') || text.includes('shankar') || text.includes('kedar') || text.includes('baijnath');
        if (catLower === 'naag') return text.includes('naag') || text.includes('nag ') || text.includes('sheshnag') || text.includes('basuki');
        if (catLower === 'rishi') return text.includes('rishi') || text.includes('sage') || text.includes('parashar') || text.includes('shringi') || text.includes('jamlu');
        if (catLower === 'mahasu') return text.includes('mahasu') || text.includes('chalda') || text.includes('botha') || text.includes('pabasi');
        return true;
      });
    }

    // Vernacular Architecture filter
    if (selectedArchitecture && selectedArchitecture !== 'All') {
      const archLower = selectedArchitecture.toLowerCase();
      results = results.filter(item => {
        const text = `${item.description || ''}`.toLowerCase();
        if (archLower.includes('kath-kuni')) return text.includes('kath-kuni') || text.includes('kath kuni') || text.includes('cator');
        if (archLower.includes('pagoda')) return text.includes('pagoda') || text.includes('tiered');
        if (archLower.includes('pent-roof')) return text.includes('pent-roof') || text.includes('pent roof') || text.includes('gabled');
        if (archLower.includes('shikhara')) return text.includes('shikhara');
        return true;
      });
    }

    return results;
  }, [deities, searchTerm, districtFilter, selectedCategory, selectedArchitecture]);

  const visibleDeities = useMemo(() => {
    return filteredDeities.slice(0, visibleCount);
  }, [filteredDeities, visibleCount]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[var(--accent-color)]" />
        <p className="font-serif">{t('retrieving_records')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500 glass p-8 rounded-xl max-w-2xl mx-auto border border-red-500/20">
        <p>Error loading deity records: {error.message || String(error)}</p>
      </div>
    );
  }

  return (
    <div className="py-10">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="flex gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] font-sans text-sm shadow-sm transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
          </div>
          {/* Mobile Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden skiper-pill px-4 flex items-center gap-1.5"
            aria-label="Open District Filter Drawer"
          >
            <Filter className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="text-xs font-semibold">{districtFilter}</span>
          </button>
        </div>
        
        {/* Desktop Filter Pills */}
        <div className="hidden md:flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <div className="flex gap-2">
            {districts.map(district => (
              <button
                key={district}
                onClick={() => handleDistrictChange(district)}
                className={`skiper-pill whitespace-nowrap ${
                  districtFilter === district ? 'active font-bold' : ''
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs h-full bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[var(--accent-color)]" />
                <h3 className="font-serif text-lg text-[var(--text-primary)] font-bold">Select District</h3>
              </div>
              <button 
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {districts.map(district => (
                <button
                  key={district}
                  type="button"
                  onClick={() => {
                    handleDistrictChange(district);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all border ${
                    districtFilter === district
                      ? 'bg-[var(--accent-color)]/15 border-[var(--accent-color)] text-[var(--text-primary)] font-bold shadow-sm'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid Header */}
      <div className="mb-6 flex justify-between items-end border-b border-[var(--border-gold-subtle)] pb-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] font-bold">{t('deity_archive')}</h2>
        <span className="archival-stamp">{filteredDeities.length} Verified Records</span>
      </div>

      {filteredDeities.length === 0 ? (
        <div className="py-20 text-center archival-plate rounded-2xl border border-[var(--border-color)] shadow-sm max-w-lg mx-auto">
          <p className="text-[var(--text-secondary)] font-serif text-lg">{t('no_deities_found')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleDeities.map(deity => (
              <DeityCard key={deity.id} deity={deity} />
            ))}
          </div>
          {filteredDeities.length > visibleCount && (
            <div className="mt-12 flex justify-center w-full">
              <button
                type="button"
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="btn-secondary px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-xs cursor-pointer shadow-sm hover:border-[var(--accent-gold)] hover:text-[var(--accent-color)] transition-all"
              >
                Reveal More Sacred Records ({filteredDeities.length - visibleCount} Remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  Search, 
  ExternalLink, 
  Clock, 
  CalendarCheck2, 
  History, 
  HelpCircle,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import eventsData from '../data/events.json';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../context/LanguageContext';
import { groupAndSortEvents, formatEventDate } from '../utils/eventLifecycle';

export default function DevMelaCalendar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const { t } = useTranslation();

  // Extract unique districts from events data
  const districts = useMemo(() => {
    const set = new Set();
    eventsData.forEach(e => {
      const match = e.location?.split(',').pop()?.trim();
      if (match) set.add(match);
    });
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Filter raw events by search query and district
  const filteredEvents = useMemo(() => {
    return eventsData.filter(event => {
      const matchesSearch = !searchTerm.trim() || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict = selectedDistrict === 'All' || 
        event.location?.toLowerCase().includes(selectedDistrict.toLowerCase());

      return matchesSearch && matchesDistrict;
    });
  }, [searchTerm, selectedDistrict]);

  // Partition events through pure IST lifecycle engine
  const { happeningNow, upcoming, laterThisSeason, past, tba } = useMemo(() => {
    return groupAndSortEvents(filteredEvents, new Date());
  }, [filteredEvents]);

  const totalMatching = happeningNow.length + upcoming.length + laterThisSeason.length + past.length + tba.length;

  const renderEventCard = (event, statusType) => {
    const isNow = statusType === 'now';
    const isUpcoming = statusType === 'upcoming';
    const isPast = statusType === 'past';

    return (
      <article 
        key={event.deityId + event.title}
        className={`bg-[var(--bg-card)] border rounded-2xl p-6 transition-all duration-300 shadow-sm flex flex-col justify-between ${
          isNow 
            ? 'border-green-600/40 shadow-green-900/5 ring-1 ring-green-600/20' 
            : isUpcoming 
              ? 'border-[var(--border-color)] hover:border-[var(--accent-color)]/40' 
              : isPast
                ? 'border-[var(--border-color)]/60 opacity-80'
                : 'border-[var(--border-color)]'
        }`}
      >
        <div>
          {/* Header pill strip */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isNow 
                ? 'bg-green-600/10 text-green-700 border border-green-600/20 animate-pulse' 
                : isUpcoming 
                  ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                  : isPast
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                    : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
            }`}>
              {isNow ? 'Happening Now' : isUpcoming ? 'Confirmed Upcoming' : isPast ? 'Past Celebration' : 'Season TBA'}
            </span>

            <span className="text-xs font-mono font-medium text-[var(--text-primary)]">
              {formatEventDate(event)}
            </span>
          </div>

          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2 leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-[var(--accent-color)] font-medium flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{event.location}</span>
          </p>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans mb-4">
            {event.description}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
          {event.deityId ? (
            <Link 
              to={`/deity/${event.deityId}`}
              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors underline underline-offset-4 decoration-[var(--border-color)] hover:decoration-[var(--accent-color)]"
            >
              {t('view_associated_deity')}
            </Link>
          ) : (
            <span className="text-[var(--text-muted)]">Regional Congregation</span>
          )}

          {event.map && (
            <a
              href={event.map}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent-color)] font-medium hover:text-[var(--accent-crimson)] transition-colors"
            >
              <span>View Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 pt-24 pb-20 px-4 md:px-8 font-sans">
      <SEOHead 
        title={`${t('calendar_title')} | HIM GATHA`} 
        description={t('calendar_desc')} 
      />

      <div className="max-w-6xl mx-auto">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-color)] font-bold block mb-2 font-mono">
            Date-Aware Living Calendar
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4">
            {t('calendar_title')}
          </h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
            {t('calendar_desc')}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={t('search_festivals')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {districts.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all border ${
                      selectedDistrict === d
                        ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] font-semibold shadow-sm'
                        : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {totalMatching === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <Calendar className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2">
              {t('no_events')}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              No fairs or festivals matched your search parameters. Try resetting your district filter or searching for a broader term.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedDistrict('All'); }}
              className="px-5 py-2 rounded-lg bg-[var(--accent-color)] text-white text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* 1. Happening Now Section */}
            {happeningNow.length > 0 && (
              <section aria-label="Festivals Happening Now">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-green-600/30">
                  <div className="w-3 h-3 rounded-full bg-green-600 animate-ping"></div>
                  <h2 className="text-2xl font-serif font-bold text-green-700 dark:text-green-400">
                    Happening Now in Himachal
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-600/10 text-green-700 border border-green-600/20 font-bold">
                    {happeningNow.length} Active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {happeningNow.map(e => renderEventCard(e, 'now'))}
                </div>
              </section>
            )}

            {/* 2. Confirmed Upcoming Festivals Section */}
            {upcoming.length > 0 && (
              <section aria-label="Upcoming Festivals">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--border-color)]">
                  <CalendarCheck2 className="w-6 h-6 text-[var(--accent-color)]" />
                  <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Upcoming Confirmed Festivals
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 font-bold">
                    {upcoming.length} Confirmed
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map(e => renderEventCard(e, 'upcoming'))}
                </div>
              </section>
            )}

            {/* 3. Later This Season Section */}
            {laterThisSeason.length > 0 && (
              <section aria-label="Later This Season">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--border-color)]">
                  <Clock className="w-6 h-6 text-[var(--accent-gold)]" />
                  <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Later This Season (Month-Level Accuracy)
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 font-bold">
                    {laterThisSeason.length} Seasonal
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {laterThisSeason.map(e => renderEventCard(e, 'seasonal'))}
                </div>
              </section>
            )}

            {/* 4. Dates TBA Section */}
            {tba.length > 0 && (
              <section aria-label="Dates To Be Announced">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--border-color)]">
                  <HelpCircle className="w-6 h-6 text-[var(--text-muted)]" />
                  <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                    Dates Under Verification (TBA)
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] font-medium">
                    {tba.length} Pending
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tba.map(e => renderEventCard(e, 'tba'))}
                </div>
              </section>
            )}

            {/* 5. Past Concluded Celebrations Section */}
            {past.length > 0 && (
              <section aria-label="Past Celebrations">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--border-color)]">
                  <History className="w-6 h-6 text-[var(--text-muted)]" />
                  <h2 className="text-2xl font-serif font-bold text-[var(--text-muted)]">
                    Concluded Fairs &amp; Celebrations
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] font-medium">
                    {past.length} Archived
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map(e => renderEventCard(e, 'past'))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

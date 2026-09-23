/**
 * Pure domain utilities for the HIM GATHA Living Event Calendar.
 * All date calculations enforce Asia/Kolkata (IST) timezone to avoid UTC off-by-one errors.
 */

const IST_TIMEZONE = 'Asia/Kolkata';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Returns current date components formatted in Asia/Kolkata timezone.
 * @param {Date} [referenceDate=new Date()] 
 * @returns {{ dateStr: string, year: number, month: number, day: number }}
 */
export function getTodayIST(referenceDate = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const dateStr = formatter.format(referenceDate); // YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  return { dateStr, year, month, day };
}

/**
 * Derives the dynamic lifecycle status of an event based on stored dates and current date in IST.
 * Statuses: 'HAPPENING_NOW' | 'UPCOMING' | 'COMPLETED' | 'DATE_TBA'
 * 
 * @param {Object} event 
 * @param {Date} [referenceDate=new Date()]
 * @returns {'HAPPENING_NOW' | 'UPCOMING' | 'COMPLETED' | 'DATE_TBA'}
 */
export function getEventStatus(event, referenceDate = new Date()) {
  if (!event) return 'DATE_TBA';

  const precision = event.datePrecision || ((event.startDate || event.date) && (event.startDate || event.date).length >= 10 ? 'exact' : 'tba');

  if (precision === 'tba') {
    return 'DATE_TBA';
  }

  const { dateStr: todayStr, year: todayYear, month: todayMonth } = getTodayIST(referenceDate);

  if (precision === 'seasonal') {
    const eventYear = event.year || (event.date ? parseInt(event.date.slice(0, 4), 10) : todayYear);
    if (eventYear < todayYear) return 'COMPLETED';
    return 'UPCOMING';
  }

  if (precision === 'month') {
    const dateVal = event.startDate || event.date || '';
    const eventYear = event.year || parseInt(dateVal.slice(0, 4), 10) || todayYear;
    const eventMonth = parseInt(dateVal.slice(5, 7), 10) || 1;

    if (eventYear < todayYear) return 'COMPLETED';
    if (eventYear === todayYear) {
      if (eventMonth < todayMonth) return 'COMPLETED';
      if (eventMonth === todayMonth) return 'HAPPENING_NOW';
      return 'UPCOMING';
    }
    return 'UPCOMING';
  }

  // Exact date handling
  const rawStart = event.startDate || event.date;
  if (!rawStart) return 'DATE_TBA';

  const startDate = rawStart.slice(0, 10);
  const rawEnd = event.endDate || event.startDate || event.date;
  const endDate = rawEnd ? rawEnd.slice(0, 10) : startDate;

  if (startDate <= todayStr && todayStr <= endDate) {
    return 'HAPPENING_NOW';
  }

  if (todayStr < startDate) {
    return 'UPCOMING';
  }

  return 'COMPLETED';
}

/**
 * Formats event dates into culturally respectful, non-fabricated strings.
 * Never converts approximate dates into fake exact dates.
 * 
 * @param {Object} event 
 * @returns {string}
 */
export function formatEventDate(event) {
  if (!event) return 'Date TBA';

  const precision = event.datePrecision || ((event.startDate || event.date) && (event.startDate || event.date).length >= 10 ? 'exact' : 'tba');

  if (precision === 'tba') {
    const year = event.year || (event.date ? event.date.slice(0, 4) : new Date().getFullYear());
    return `${year} date to be announced`;
  }

  if (precision === 'seasonal') {
    return event.season || event.description?.match(/usually \w+/i)?.[0] || 'Seasonal Festival (Date TBA)';
  }

  if (precision === 'month') {
    const dateVal = event.startDate || event.date || '';
    const parts = dateVal.split('-');
    if (parts.length >= 2) {
      const monthIdx = parseInt(parts[1], 10) - 1;
      const year = parts[0];
      return `${MONTH_NAMES[monthIdx] || ''} ${year}`.trim();
    }
    return event.month || 'Month TBA';
  }

  // Exact date format
  const rawStart = event.startDate || event.date;
  if (!rawStart) return 'Date TBA';

  const [sY, sM, sD] = rawStart.slice(0, 10).split('-').map(Number);
  const sMonthName = MONTH_NAMES[sM - 1] || '';

  const rawEnd = event.endDate;
  if (!rawEnd || rawEnd.slice(0, 10) === rawStart.slice(0, 10)) {
    return `${sD} ${sMonthName} ${sY}`;
  }

  const [eY, eM, eD] = rawEnd.slice(0, 10).split('-').map(Number);
  const eMonthName = MONTH_NAMES[eM - 1] || '';

  if (sY === eY && sM === eM) {
    return `${sD}–${eD} ${sMonthName} ${sY}`;
  }

  if (sY === eY) {
    return `${sD} ${sMonthName} – ${eD} ${eMonthName} ${sY}`;
  }

  return `${sD} ${sMonthName} ${sY} – ${eD} ${eMonthName} ${eY}`;
}

/**
 * Partitions and sorts events into the UX hierarchy:
 * 1. Happening Now
 * 2. Upcoming (sorted by nearest start date)
 * 3. Later This Season (month/seasonal)
 * 4. Past Events
 * 5. TBA
 * 
 * @param {Array} events 
 * @param {Date} [referenceDate=new Date()]
 * @returns {{
 *   happeningNow: Array,
 *   upcoming: Array,
 *   laterThisSeason: Array,
 *   past: Array,
 *   tba: Array
 * }}
 */
export function groupAndSortEvents(events, referenceDate = new Date()) {
  if (!Array.isArray(events)) {
    return { happeningNow: [], upcoming: [], laterThisSeason: [], past: [], tba: [] };
  }

  const happeningNow = [];
  const upcoming = [];
  const laterThisSeason = [];
  const past = [];
  const tba = [];

  events.forEach(event => {
    const status = getEventStatus(event, referenceDate);
    const precision = event.datePrecision || ((event.startDate || event.date) && (event.startDate || event.date).length >= 10 ? 'exact' : 'tba');
    const enriched = { ...event, derivedStatus: status };

    if (status === 'HAPPENING_NOW') {
      happeningNow.push(enriched);
    } else if (precision === 'seasonal' || precision === 'month') {
      if (status === 'COMPLETED') {
        past.push(enriched);
      } else {
        laterThisSeason.push(enriched);
      }
    } else if (status === 'UPCOMING') {
      upcoming.push(enriched);
    } else if (status === 'COMPLETED') {
      past.push(enriched);
    } else {
      tba.push(enriched);
    }
  });

  // Sort upcoming chronologically ascending
  upcoming.sort((a, b) => {
    const dateA = a.startDate || a.date || '9999';
    const dateB = b.startDate || b.date || '9999';
    return dateA.localeCompare(dateB);
  });

  // Sort happeningNow by end date ascending
  happeningNow.sort((a, b) => {
    const dateA = a.endDate || a.startDate || a.date || '9999';
    const dateB = b.endDate || b.startDate || b.date || '9999';
    return dateA.localeCompare(dateB);
  });

  // Sort past chronologically descending (most recent first)
  past.sort((a, b) => {
    const dateA = a.endDate || a.startDate || a.date || '0000';
    const dateB = b.endDate || b.startDate || b.date || '0000';
    return dateB.localeCompare(dateA);
  });

  return { happeningNow, upcoming, laterThisSeason, past, tba };
}

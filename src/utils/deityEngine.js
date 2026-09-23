/**
 * Pure domain utilities for the HIM GATHA digital heritage platform.
 */

// Geographic bounding box for Himachal Pradesh (approx. 30.38°N - 33.22°N, 75.78°E - 79.00°E)
const HP_BOUNDS = {
  minLat: 30.3,
  maxLat: 33.4,
  minLng: 75.5,
  maxLng: 79.2
};

/**
 * Validates if coordinates fall within Himachal Pradesh geography.
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export function validateHimachalCoordinates(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
  return (
    lat >= HP_BOUNDS.minLat &&
    lat <= HP_BOUNDS.maxLat &&
    lng >= HP_BOUNDS.minLng &&
    lng <= HP_BOUNDS.maxLng
  );
}

/**
 * Constructs a verified Google Maps search query URL.
 * @param {string} name 
 * @param {string} village 
 * @param {string} district 
 * @returns {string}
 */
export function formatGoogleMapsUrl(name, village = '', district = '') {
  const parts = [name, village, district, 'Himachal Pradesh'].filter(Boolean);
  const query = encodeURIComponent(parts.join(' ')).replace(/%20/g, '+');
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Filters a list of deity records by search term and district.
 * @param {Array} deities 
 * @param {string} query 
 * @param {string} district 
 * @returns {Array}
 */
export function searchDeities(deities, query = '', district = 'All') {
  if (!Array.isArray(deities)) return [];
  const q = query.trim().toLowerCase();
  const d = district.trim().toLowerCase();

  return deities.filter(item => {
    const matchesDistrict = !d || d === 'all' || item.district?.toLowerCase().trim() === d;
    if (!matchesDistrict) return false;

    if (!q) return true;

    const nameMatch = item.name?.toLowerCase().includes(q) || item.name_hi?.toLowerCase().includes(q);
    const descMatch = item.description?.toLowerCase().includes(q) || item.description_hi?.toLowerCase().includes(q);
    const regionMatch = item.region?.toLowerCase().includes(q) || item.district_hi?.toLowerCase().includes(q);

    return nameMatch || descMatch || regionMatch;
  });
}

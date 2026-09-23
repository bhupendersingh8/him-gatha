/**
 * Strip HTML tags from user input to prevent stored XSS.
 * @param {unknown} value
 * @returns {string}
 */
export function stripHtmlTags(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

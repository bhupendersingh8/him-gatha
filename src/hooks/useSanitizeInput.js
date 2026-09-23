// src/hooks/useSanitizeInput.js
const stripHtml = (value = '') => {
  if (!value) return '';
  // Strip executable scripts and styles along with their contents
  const noScripts = String(value)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  const rawText = typeof DOMParser !== 'undefined'
    ? (new DOMParser().parseFromString(noScripts, 'text/html').body.textContent || '')
    : noScripts.replace(/<[^>]*>?/gm, '');
  return rawText
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
};

export const sanitizeInput = (value) => {
  if (typeof value === 'string') return stripHtml(value);

  if (Array.isArray(value)) {
    return value.map(sanitizeInput);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [stripHtml(key), sanitizeInput(item)])
    );
  }

  return value;
};

export default function useSanitizeInput() {
  return { sanitizeInput };
}

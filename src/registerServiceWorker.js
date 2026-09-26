import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const updateSW = registerSW({
      onNeedRefresh() {
        // Auto-refresh when new archival cache is ready
        updateSW(true);
      },
      onOfflineReady() {
        console.info('HIM GATHA Cultural Archive is ready for 100% offline access.');
      }
    });
  } catch {
    // Graceful fallback for non-bundled or test environments
    if (import.meta.env?.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }
}

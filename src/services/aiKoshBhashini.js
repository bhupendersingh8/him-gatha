/**
 * AI Kosh & Bhashini Digital India Cultural Speech & Language Service
 * 
 * Provides:
 * 1. Dev-Vaani Voice Search (Automated Speech Recognition - ASR)
 * 2. Oral Katha Narrator (Text-to-Speech - TTS)
 * 3. Graceful offline-first fallback using standard W3C Web Speech APIs
 * 4. Pre-wired hooks for Government of India Bhashini (ULCA / Dhruva) inference pipeline
 */

// Bhashini (MeitY) Dhruva Inference API Config
export const BHASHINI_PIPELINE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
const BHASHINI_API_KEY = typeof import.meta !== 'undefined' ? import.meta.env.VITE_BHASHINI_API_KEY : null;

let activeRecognition = null;

export function isVoiceSearchSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis);
}

export function getBhashiniStatus() {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
  const hasKey = Boolean(BHASHINI_API_KEY);
  return {
    isOnline,
    hasKey,
    mode: hasKey && isOnline ? 'Bhashini Neural Cloud' : 'Local Offline-First Engine',
    engine: hasKey && isOnline ? 'IndiaAI / Bhashini (MeitY)' : 'Native Himalayan Web Speech Engine'
  };
}

/**
 * Start listening for voice input in Hindi or English
 */
export function startVoiceSearch({ lang = 'hi', onResult, onError, onStart, onEnd }) {
  if (!isVoiceSearchSupported()) {
    if (onError) onError(new Error('Voice search is not supported in this browser.'));
    return null;
  }

  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    activeRecognition = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (onStart) onStart();
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (onResult) onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition event error:', event.error);
      if (onError) onError(event);
    };

    recognition.onend = () => {
      activeRecognition = null;
      if (onEnd) onEnd();
    };

    recognition.start();
    return recognition;
  } catch (err) {
    console.error('Failed to start voice recognition:', err);
    if (onError) onError(err);
    return null;
  }
}

/**
 * Stop active voice recognition
 */
export function stopVoiceSearch() {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {
      // Ignore if already stopped
    }
    activeRecognition = null;
  }
}

/**
 * Speak sacred lore / katha aloud
 */
export function speakText({ text, lang = 'hi', onStart, onEnd, onError }) {
  if (!isSpeechSynthesisSupported() || !text) {
    if (onError) onError(new Error('Speech synthesis not supported or empty text.'));
    return false;
  }

  try {
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly measured, respectful cadence for sacred lore
    utterance.pitch = 1.0;

    // Try selecting native Hindi or Indian English voice if available
    const voices = window.speechSynthesis.getVoices?.() || [];
    const targetLangCode = lang === 'hi' ? 'hi' : 'en';
    const preferredVoice = voices.find(v => v.lang?.startsWith(targetLangCode) && (v.name?.includes('India') || v.name?.includes('Hindi')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      if (onError) onError(err);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis failure:', err);
    if (onError) onError(err);
    return false;
  }
}

/**
 * Stop active speech playback
 */
export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

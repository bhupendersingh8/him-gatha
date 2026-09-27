import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, Sparkles } from 'lucide-react';
import { speakText, stopSpeaking, getBhashiniStatus } from '../services/aiKoshBhashini';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
}

export default function AudioNarrativePlayer({ src, title, narrativeText, lang = 'hi' }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioFailed, setAudioFailed] = useState(false);
  const useSynthesis = !src || audioFailed;
  const bhashiniStatus = getBhashiniStatus();

  useEffect(() => {
    if (!src) return undefined;

    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    const onError = () => {
      // Fallback to synthesis if pre-recorded file is unavailable
      setAudioFailed(true);
      setPlaying(false);
    };

    audio.addEventListener('timeupdate', syncTime);
    audio.addEventListener('loadedmetadata', syncDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', syncTime);
      audio.removeEventListener('loadedmetadata', syncDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [src]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  async function togglePlayback() {
    if (useSynthesis) {
      if (playing) {
        stopSpeaking();
        setPlaying(false);
      } else {
        const textToSpeak = narrativeText || title;
        if (!textToSpeak) return;

        const success = speakText({
          text: textToSpeak,
          lang,
          onStart: () => setPlaying(true),
          onEnd: () => setPlaying(false),
          onError: () => setPlaying(false)
        });

        if (!success) {
          setPlaying(false);
        }
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setAudioFailed(true);
      setPlaying(false);
    }
  }

  function seek(event) {
    if (useSynthesis) return;
    const nextTime = Number(event.target.value);
    if (!audioRef.current || !Number.isFinite(nextTime)) return;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <section className="kath-kuni-card p-6 md:p-8 rounded-2xl relative overflow-hidden" aria-labelledby="audio-narrative-title">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-color)] flex items-center gap-1.5">
            <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Oral Tradition • Dev-Vaani</span>
          </p>
          <h2 id="audio-narrative-title" className="flex items-center gap-2 text-xl md:text-2xl text-[var(--text-primary)] font-serif font-bold">
            {title}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-[var(--border-gold-subtle)] bg-[var(--accent-gold)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent-gold)] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{useSynthesis ? 'Indic Voice Synthesis' : 'Archive Recording'}</span>
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            {bhashiniStatus.mode}
          </span>
        </div>
      </div>

      {src && <audio ref={audioRef} preload="metadata" src={src} controlsList="nodownload" />}

      <div className="relative z-10 mt-6 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 bg-[var(--bg-primary)]/60 p-4 rounded-xl border border-[var(--border-color)]">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? 'Pause audio narrative' : 'Play oral narrative'}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-color)] text-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] cursor-pointer"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>

        <div>
          {useSynthesis ? (
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">
                {playing ? 'Listening to Dev-Katha oral narration...' : 'Click Play to listen to this sacred lore spoken aloud'}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Respectful Indian cadence • 100% offline-ready with Bhashini neural enhancement
              </span>
            </div>
          ) : (
            <>
              <input
                type="range"
                min="0"
                max={Number.isFinite(duration) ? duration : 0}
                value={Math.min(currentTime, Number.isFinite(duration) ? duration : 0)}
                onChange={seek}
                aria-label="Audio progress"
                className="h-2 w-full cursor-pointer accent-[var(--accent-color)]"
              />
              <div className="mt-1 flex justify-between text-xs tabular-nums text-[var(--text-secondary)] font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

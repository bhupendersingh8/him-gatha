import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
}

export default function AudioNarrativePlayer({ src, title }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    const onError = () => setError(true);

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

  async function togglePlayback() {
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
      setError(true);
    }
  }

  function seek(event) {
    const nextTime = Number(event.target.value);
    if (!audioRef.current || !Number.isFinite(nextTime)) return;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <section className="kath-kuni-card p-6 md:p-8" aria-labelledby="audio-narrative-title">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-color)]">
            Oral tradition
          </p>
          <h2 id="audio-narrative-title" className="flex items-center gap-2 text-2xl text-[var(--text-primary)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(213,173,91,0.12)]">
              <Volume2 className="h-4 w-4 text-[var(--accent-color)]" />
            </span>
            {title}
          </h2>
        </div>
        <span className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs text-[var(--text-secondary)]">
          Archive recording
        </span>
      </div>

      <audio ref={audioRef} preload="metadata" src={src} controlsList="nodownload" />

      {error ? (
        <p role="alert" className="relative z-10 mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          This recording is temporarily unavailable.
        </p>
      ) : (
        <div className="relative z-10 mt-6 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? 'Pause audio narrative' : 'Play audio narrative'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-color)] text-[#0b0a08] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-color)]"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </button>

          <div>
            <input
              type="range"
              min="0"
              max={Number.isFinite(duration) ? duration : 0}
              value={Math.min(currentTime, Number.isFinite(duration) ? duration : 0)}
              onChange={seek}
              aria-label="Audio progress"
              className="h-2 w-full cursor-pointer accent-[var(--accent-color)]"
            />
            <div className="mt-1 flex justify-between text-xs tabular-nums text-[var(--text-secondary)]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

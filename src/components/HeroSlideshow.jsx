import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Compass, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/assets/media__1785480599353.jpg',
    title: 'Himalayan Sacred Valleys',
    subtitle: 'Misty landscapes shielding ancient architectural heritage and sacred pathways across Himachal.',
    targetUrl: '/explore'
  },
  {
    id: 2,
    image: '/assets/media__1785480627833.jpg',
    title: 'Shri Naag Chawasi Sidh Ji',
    subtitle: 'Traditional Devta Palanquins converging in regional melas, festivals and community assemblies.',
    targetUrl: '/deity/shri-naag-chawasi-sidh-ji'
  },
  {
    id: 3,
    image: '/assets/media__1785481969984.jpg',
    title: 'Mata Shikari Devi',
    subtitle: 'Hilltop roofless stone temple at 3,359 meters in Mandi, where snow never accumulates on the deity.',
    targetUrl: '/deity/shikari-devi'
  },
  {
    id: 4,
    image: '/assets/media__1785481976091.jpg',
    title: 'Sacred Mela Congregation',
    subtitle: 'Witness the living musical heritage of Pahari musical assemblies and regional deities.',
    targetUrl: '/calendar'
  },
  {
    id: 5,
    image: '/assets/media__1785481981665.jpg',
    title: 'Hidimba Devi Temple',
    subtitle: 'The 16th-century four-tiered deodar wood pagoda temple standing in Dhungri Cedar Forest of Manali.',
    targetUrl: '/deity/devi-hidimba-mata-hadimba'
  }
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div 
      className="relative h-[80vh] min-h-[600px] w-full overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Himachal Sacred Heritage Highlights"
    >
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
            }}
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/65 to-black/40"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <div className={`max-w-4xl transform transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              
              {/* Luxury Archive Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[var(--accent-gold)]/40 text-[var(--accent-gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-6 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)] animate-pulse" />
                <span>Living Dev-Sanskriti Archive</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white mb-4 sm:mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] tracking-tight font-bold leading-[1.1]">
                {slide.title}
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-100 font-sans font-normal max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-relaxed">
                {slide.subtitle}
              </p>
              
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <button 
                  onClick={() => navigate(slide.targetUrl || '/explore')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[var(--accent-color)] via-[#9e2d03] to-[var(--accent-color)] text-white rounded-full font-semibold hover:shadow-[0_8px_25px_rgba(142,40,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-lg border border-white/10"
                >
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
                  <span>{slide.targetUrl?.startsWith('/deity') ? 'Read Archival Dossier' : 'Explore Sacred Atlas'}</span>
                </button>
                <button 
                  onClick={() => navigate('/explore')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/30 hover:border-white/60 text-white rounded-full font-semibold transition-all duration-300 text-sm sm:text-base cursor-pointer shadow-md hover:scale-105 active:scale-95"
                >
                  Browse 222 Shrines
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Controls */}
      <button 
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 border border-white/20 backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 border border-white/20 backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Chapter Indicator Bar */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15" role="tablist" aria-label="Slide chapters">
        <span className="text-[10px] font-mono text-[var(--accent-gold)] uppercase tracking-widest hidden sm:inline-block pr-1 font-semibold">
          Exhibition
        </span>
        {SLIDES.map((slide, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={index === currentSlide ? `Current slide: ${slide.title}` : `Go to slide ${index + 1}: ${slide.title}`}
            onClick={() => setCurrentSlide(index)}
            className="flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] rounded-full transition-all"
          >
            <span
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-gold)] w-8 shadow-[0_0_10px_rgba(212,175,55,0.6)]' 
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
            {index === currentSlide && (
              <span className="text-[11px] font-mono text-white hidden md:inline-block font-semibold">
                0{index + 1}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

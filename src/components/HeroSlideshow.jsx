import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

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
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/70 to-black/35"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <div className={`max-w-4xl transform transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white mb-4 sm:mb-6 drop-shadow-lg tracking-wide sm:tracking-wider font-bold">
                {slide.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {slide.subtitle}
              </p>
              
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
                <button 
                  onClick={() => navigate(slide.targetUrl || '/explore')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[var(--accent-color)] text-white rounded-full font-semibold hover:bg-[var(--accent-crimson)] transition-colors shadow-lg text-sm sm:text-base cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                  {slide.targetUrl?.startsWith('/deity') ? 'Explore Deity Dossier' : 'Explore Sacred Atlas'}
                </button>
                <button 
                  onClick={() => navigate('/explore')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/40 text-white rounded-full font-semibold transition-colors text-sm sm:text-base cursor-pointer shadow-md"
                >
                  View Archive
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
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      
      <button 
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3" role="tablist" aria-label="Slides">
        {SLIDES.map((slide, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all border border-black/30 shadow-sm ${index === currentSlide ? 'bg-[var(--accent-color)] w-8' : 'w-3 bg-white/75 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, Shield, Search, Menu, X, LogOut, Languages } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../context/LanguageContext';

export default function Navbar({ theme, toggleTheme, onSearch }) {
  const { user, logout } = useAuth();
  const { t, lang, toggleLanguage } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const menuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close mobile menu on Escape key and return focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    }
    // Navigate to explore or home to show results
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: t('home'), end: true },
    { to: '/explore', label: t('explore') || 'Explore' },
    { to: '/calendar', label: t('dev_melas') },
    { to: '/contribute', label: t('contribute') },
  ];

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--accent-color)] focus:text-white focus:rounded-md focus:shadow-md focus:outline-none text-sm font-sans font-medium"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 w-full bg-[var(--bg-primary)]/92 backdrop-blur-md border-b border-[var(--border-color)] transition-colors duration-200">
        <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-md"
            aria-label="HIM GATHA — Return to Home"
          >
            <span className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors">
              हिम गाथा
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-sans font-semibold border-l border-[var(--border-color)] pl-2.5 py-0.5">
              Archive
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-sans">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `py-1.5 transition-colors duration-150 border-b-2 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)] rounded-t-sm ${
                    isActive
                      ? 'text-[var(--accent-color)] font-semibold border-[var(--accent-color)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Global Search Bar (Desktop) */}
          <form 
            onSubmit={handleSearchSubmit} 
            role="search"
            className="hidden lg:flex items-center relative flex-1 max-w-xs mx-2"
          >
            <label htmlFor="desktop-search-input" className="sr-only">
              Search deities, districts, and sacred lore
            </label>
            <input
              id="desktop-search-input"
              type="search"
              placeholder="Search archive..."
              value={searchVal}
              onChange={handleSearchChange}
              className="w-full h-9 px-3 pl-9 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs font-sans focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" aria-hidden="true" />
          </form>

          {/* Action Controls & Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="h-9 min-w-[44px] px-2.5 inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
              aria-label={`Switch language to ${lang === 'en' ? 'Hindi' : 'English'}`}
              title="Switch language"
            >
              <Languages className="h-3.5 w-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
              <span>{lang === 'en' ? 'EN' : 'हिं'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
              aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {/* Authenticated Admin Badge */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/him-admin"
                  className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-[var(--accent-color)] text-[var(--accent-color)] text-xs font-semibold hover:bg-[var(--accent-color)] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
                >
                  <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={logout}
                  className="h-9 w-9 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-red-500/20 text-red-600 hover:bg-red-500/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  aria-label="Log out administrator session"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}

            {/* Mobile Menu Toggle Button */}
            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden h-9 w-9 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            ref={mobileMenuRef}
            className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-4 space-y-3 animate-fade-in shadow-md"
          >
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} role="search" className="relative w-full">
              <label htmlFor="mobile-search-input" className="sr-only">
                Search deities, districts, and sacred lore
              </label>
              <input
                id="mobile-search-input"
                type="search"
                placeholder="Search deities, districts..."
                value={searchVal}
                onChange={handleSearchChange}
                className="w-full h-10 px-3 pl-10 rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm font-sans focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)]"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)] pointer-events-none" aria-hidden="true" />
            </form>

            {/* Mobile Links List */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `min-h-[44px] flex items-center px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[rgba(142,40,0,0.08)] text-[var(--accent-color)] font-semibold border-l-4 border-[var(--accent-color)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <Link
                  to="/him-admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2 px-3.5 py-2.5 rounded-md text-sm font-medium text-[var(--accent-color)] hover:bg-[rgba(142,40,0,0.08)] transition-colors border-t border-[var(--border-color)] mt-2 pt-3"
                >
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span>Admin Dashboard</span>
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

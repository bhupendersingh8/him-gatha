import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');

  // Automatically redirect if already authenticated with administrative access
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/him-admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const loggedUser = await login(email, password);
      if (loggedUser) {
        navigate('/him-admin');
      }
    } catch (err) {
      setLocalError(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4 bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      <form onSubmit={handleLogin} className="archival-plate p-8 md:p-10 rounded-3xl max-w-md w-full border border-[var(--border-gold-subtle)] shadow-luxury relative overflow-hidden">
        {/* Top Gold Hairline Rim */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-color)] via-[var(--accent-gold)] to-[var(--accent-color)]" />

        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center border border-[var(--border-gold-subtle)] text-[var(--accent-gold)] shadow-sm">
            <ShieldAlert className="w-6 h-6 text-[var(--accent-color)]" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <span className="archival-stamp mb-2">
            Curatorial Access • Kardar Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--text-primary)] mb-1">Heritage Custodian Gate</h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans">Authorized verification of living cultural submissions.</p>
        </div>
        
        {(error || localError) && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs mb-5 leading-relaxed font-sans">
            {localError || error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] font-sans uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-sans text-sm shadow-sm transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] font-sans uppercase tracking-wider">Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-sans text-sm shadow-sm transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full py-3 rounded-xl font-semibold text-sm cursor-pointer shadow-luxury hover:shadow-luxury-hover"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
            </>
          ) : 'Authenticate & Enter Console'}
        </button>
      </form>
    </div>
  );
}

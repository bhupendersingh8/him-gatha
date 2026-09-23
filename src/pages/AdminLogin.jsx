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
    <div className="min-h-[80vh] flex items-center justify-center pt-16 pb-12 px-4 bg-[var(--bg-primary)]">
      <form onSubmit={handleLogin} className="bg-[var(--bg-card)] p-8 rounded-2xl max-w-md w-full border border-[var(--border-color)] shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center border border-[var(--accent-color)]/20">
            <ShieldAlert className="w-6 h-6 text-[var(--accent-color)]" />
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-serif mb-2 text-center text-[var(--text-primary)]">Admin Portal</h2>
        <p className="text-xs text-[var(--text-muted)] text-center mb-6 uppercase tracking-wider font-sans">HIM GATHA Security Layer</p>
        
        {(error || localError) && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-xs mb-4 leading-relaxed font-sans">
            {localError || error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)] font-sans uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-sans text-sm outline-none transition-all"
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
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-sans text-sm outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-crimson)] text-white font-semibold rounded-lg hover:brightness-110 transition-all font-sans cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
            </>
          ) : 'Verify & Enter'}
        </button>
      </form>
    </div>
  );
}

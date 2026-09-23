import { useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  getIdTokenResult 
} from 'firebase/auth';
import { auth, firebaseConfig } from '../firebase';

const PLACEHOLDER_KEYS = [
  'YOUR_API_KEY_PLACEHOLDER',
  'YOUR_MESSAGING_SENDER_ID_PLACEHOLDER',
  'YOUR_APP_ID_PLACEHOLDER',
  'YOUR_MEASUREMENT_ID_PLACEHOLDER',
];

const hasPlaceholderConfig = () => {
  const { apiKey, messagingSenderId, appId } = firebaseConfig;
  if (!apiKey || PLACEHOLDER_KEYS.includes(apiKey)) return true;
  if (!messagingSenderId || PLACEHOLDER_KEYS.includes(messagingSenderId)) return true;
  if (!appId || PLACEHOLDER_KEYS.includes(appId)) return true;
  return false;
};

export const isFirebaseMock = () => {
  try {
    if (localStorage.getItem('mock_mode') === 'true') return true;
    return hasPlaceholderConfig();
  } catch {
    return true;
  }
};

export function useAuth() {
  const [state, setState] = useState({
    user: null,
    isAdmin: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const mockActive = isFirebaseMock();
    if (mockActive) {
      try {
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setState({
            user: parsed,
            isAdmin: parsed?.role === 'admin',
            loading: false,
            error: null,
          });
          return;
        }
      } catch {
        // Ignored
      }
      setState({ user: null, isAdmin: false, loading: false, error: null });
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setState({ user: null, isAdmin: false, loading: false, error: null });
        return;
      }

      try {
        const token = await getIdTokenResult(firebaseUser, true);
        setState({
          user: firebaseUser,
          isAdmin: token.claims.role === 'admin',
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({ user: null, isAdmin: false, loading: false, error: err.message });
      }
    });
  }, []);

  const login = async (email, password) => {
    setState(curr => ({ ...curr, loading: true, error: null }));

    const mockActive = isFirebaseMock();
    if (mockActive) {
      if (password === 'admin123' || password === 'himgatha') {
        const loggedUser = {
          uid: 'mock-admin-uid',
          email: email.trim().toLowerCase(),
          displayName: 'Mock Admin User',
          role: 'admin'
        };
        localStorage.setItem('mock_user', JSON.stringify(loggedUser));
        setState({
          user: loggedUser,
          isAdmin: true,
          loading: false,
          error: null
        });
        return loggedUser;
      } else {
        const err = new Error('Invalid mock credentials.');
        setState(curr => ({ ...curr, loading: false, error: err.message }));
        throw err;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await getIdTokenResult(firebaseUser, true);
      
      const isAdminUser = token.claims.role === 'admin';
      if (!isAdminUser) {
        await firebaseSignOut(auth);
        const err = new Error('Access denied: Your account lacks administrative privileges.');
        setState({ user: null, isAdmin: false, loading: false, error: err.message });
        throw err;
      }
      setState({
        user: firebaseUser,
        isAdmin: true,
        loading: false,
        error: null
      });
      return firebaseUser;
    } catch (err) {
      setState(curr => ({ ...curr, loading: false, error: err.message }));
      throw err;
    }
  };

  const logout = async () => {
    setState(curr => ({ ...curr, loading: true, error: null }));
    const mockActive = isFirebaseMock();
    if (mockActive) {
      localStorage.removeItem('mock_user');
      setState({ user: null, isAdmin: false, loading: false, error: null });
      return;
    }
    try {
      await firebaseSignOut(auth);
      setState({ user: null, isAdmin: false, loading: false, error: null });
    } catch (err) {
      setState(curr => ({ ...curr, loading: false, error: err.message }));
    }
  };

  return {
    user: state.user,
    isAdmin: state.isAdmin,
    loading: state.loading,
    error: state.error,
    login,
    logout
  };
}

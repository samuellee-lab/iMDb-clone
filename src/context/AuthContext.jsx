import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

const SUPABASE_ENABLED = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
const ADMIN_EMAIL = 'samlee';
const ADMIN_PASSWORD = '123456';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const saved = localStorage.getItem('imdb_admin');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }

    // Also check Supabase session if enabled
    if (SUPABASE_ENABLED) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = {
            id: session.user.id,
            email: session.user.email,
            displayName: 'samlee',
          };
          setUser(u);
          localStorage.setItem('imdb_admin', JSON.stringify(u));
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    // Check hardcoded admin credentials
    if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Try Supabase auth too (don't block on failure)
      if (SUPABASE_ENABLED) {
        supabase.auth.signInWithPassword({ email: 'admin@imdb.com', password: ADMIN_PASSWORD })
          .catch(() => {}); // ignore Supabase error, admin still logs in
      }
      const userData = { email: 'samlee', displayName: 'samlee', id: 1 };
      setUser(userData);
      localStorage.setItem('imdb_admin', JSON.stringify(userData));
      return userData;
    }

    // Try Supabase for other users
    if (SUPABASE_ENABLED) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: username, password });
      if (error) throw error;
      const u = {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.user_metadata?.display_name || 'User',
      };
      setUser(u);
      localStorage.setItem('imdb_admin', JSON.stringify(u));
      return u;
    }

    throw new Error('Invalid credentials. Use samlee / 123456');
  };

  const logout = async () => {
    if (SUPABASE_ENABLED) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    localStorage.removeItem('imdb_admin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

const SUPABASE_ENABLED = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (SUPABASE_ENABLED) {
      // Check Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
          });
        }
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
          });
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Fallback to localStorage mock
      const saved = localStorage.getItem('imdb_user');
      if (saved) {
        try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (SUPABASE_ENABLED) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
    // Mock fallback
    const userData = { email, displayName: email.split('@')[0], id: Date.now() };
    setUser(userData);
    localStorage.setItem('imdb_user', JSON.stringify(userData));
    return true;
  };

  const signup = async (email, password, displayName) => {
    if (SUPABASE_ENABLED) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) throw error;
      return data;
    }
    // Mock fallback
    const userData = { email, displayName, id: Date.now() };
    setUser(userData);
    localStorage.setItem('imdb_user', JSON.stringify(userData));
    return true;
  };

  const logout = async () => {
    if (SUPABASE_ENABLED) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('imdb_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

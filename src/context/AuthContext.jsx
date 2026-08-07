import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('imdb_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login
    const userData = { email, displayName: email.split('@')[0], id: Date.now() };
    setUser(userData);
    localStorage.setItem('imdb_user', JSON.stringify(userData));
    return true;
  };

  const signup = (email, password, displayName) => {
    const userData = { email, displayName, id: Date.now() };
    setUser(userData);
    localStorage.setItem('imdb_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
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

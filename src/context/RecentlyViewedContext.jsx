import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchRecentlyViewed, addRecentlyViewed } from '../services/api';

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchRecentlyViewed(user.id).then(data => setRecentlyViewed(data || []));
    } else {
      const saved = localStorage.getItem('imdb_recently_viewed');
      if (saved) {
        try { setRecentlyViewed(JSON.parse(saved)); } catch { /* ignore */ }
      }
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('imdb_recently_viewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isAuthenticated]);

  const addToRecentlyViewed = useCallback((item) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [item, ...filtered].slice(0, 20);
    });
    if (isAuthenticated && user?.id && item.id) {
      addRecentlyViewed(user.id, item.id).catch(console.error);
    }
  }, [isAuthenticated, user?.id]);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be inside RecentlyViewedProvider');
  return ctx;
}

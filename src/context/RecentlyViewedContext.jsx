import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('imdb_recently_viewed');
    if (saved) {
      try { setRecentlyViewed(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('imdb_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((item) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i.id !== item.id || i.type !== item.type);
      return [item, ...filtered].slice(0, 20);
    });
  }, []);

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

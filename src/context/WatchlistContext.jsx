import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('imdb_watchlist');
    if (saved) {
      try { setWatchlist(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('imdb_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
  }, []);

  const isInWatchlist = useCallback((movieId) => {
    return watchlist.some(m => m.id === movieId);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be inside WatchlistProvider');
  return ctx;
}

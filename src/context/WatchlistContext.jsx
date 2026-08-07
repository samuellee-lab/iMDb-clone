import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchWatchlist, addToWatchlistDB, removeFromWatchlistDB } from '../services/api';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Load watchlist from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchWatchlist(user.id).then(data => setWatchlist(data || []));
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem('imdb_watchlist');
      if (saved) {
        try { setWatchlist(JSON.parse(saved)); } catch { /* ignore */ }
      }
    }
  }, [isAuthenticated, user?.id]);

  // Sync localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('imdb_watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, isAuthenticated]);

  const addToWatchlist = useCallback(async (movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
    if (isAuthenticated && user?.id) {
      addToWatchlistDB(user.id, movie.id).catch(console.error);
    }
  }, [isAuthenticated, user?.id]);

  const removeFromWatchlist = useCallback(async (movieId) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
    if (isAuthenticated && user?.id) {
      removeFromWatchlistDB(user.id, movieId).catch(console.error);
    }
  }, [isAuthenticated, user?.id]);

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

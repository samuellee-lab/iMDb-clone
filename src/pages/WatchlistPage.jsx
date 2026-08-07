import { Link, Navigate } from 'react-router-dom';
import PosterCard from '../components/PosterCard';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <SectionHeader title="Your Watchlist" subtitle={`${watchlist.length} titles`} />

      {watchlist.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          subtitle="Add movies and shows to keep track of what you want to watch."
          actionLabel="Browse popular movies"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlist.map(movie => (
            <div key={movie.id} className="relative group">
              <PosterCard movie={movie} />
              <button
                onClick={() => removeFromWatchlist(movie.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from Watchlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

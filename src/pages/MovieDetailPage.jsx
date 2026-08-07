import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import Badge from '../components/Badge';
import CircularAvatar from '../components/CircularAvatar';
import HorizontalScroller from '../components/HorizontalScroller';
import PosterCard from '../components/PosterCard';
import SectionHeader from '../components/SectionHeader';
import { fetchMovieById, fetchMovies } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const m = await fetchMovieById(id);
      setMovie(m);
      if (m) {
        addToRecentlyViewed({ ...m, type: 'movie' });
        const all = await fetchMovies({ genre: m.genres[0], limit: 10 });
        setSimilar(all.filter(s => s.id !== m.id));
      }
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 animate-pulse">
        <div className="h-[400px] bg-imdb-card rounded-lg mb-8" />
        <div className="h-8 w-64 bg-imdb-card rounded mb-4" />
        <div className="h-4 w-96 bg-imdb-card rounded" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Movie not found</h2>
        <Link to="/" className="text-imdb-gold hover:underline">Back to home</Link>
      </div>
    );
  }

  const inList = isInWatchlist(movie.id);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[350px] md:h-[450px] overflow-hidden">
        <img src={movie.backdrop} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-imdb-dark via-imdb-dark/50 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 -mt-52 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Poster */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <img src={movie.poster} alt={movie.title} className="w-full rounded-lg shadow-2xl" />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-28">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-imdb-muted mb-4">
              {movie.isSeries ? <Badge variant="gold">TV Series</Badge> : null}
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.runtime}</span>
              {movie.streamingOn && (
                <>
                  <span>•</span>
                  <Badge variant="streaming">{movie.streamingOn}</Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">{movie.rating}</span>
                <span className="text-sm text-imdb-muted">/10</span>
              </div>
              <StarRating rating={movie.rating} size="lg" />
              <span className="text-xs text-imdb-muted">({movie.votes.toLocaleString()} votes)</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map(g => (
                <Link key={g} to={`/genre/${g}`}>
                  <Badge>{g}</Badge>
                </Link>
              ))}
            </div>

            <p className="text-white/80 leading-relaxed mb-6 max-w-3xl">{movie.plot}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button className="imdb-btn flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Watch Trailer
              </button>
              <button
                onClick={() => inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                  inList ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-imdb-card text-white hover:bg-imdb-hover border border-imdb-border'
                }`}
              >
                {inList ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </div>

            {/* Director & Writers */}
            <div className="text-sm text-imdb-muted mb-4 space-y-1">
              <p><span className="text-white font-medium">Director:</span> {movie.director}</p>
              <p><span className="text-white font-medium">Writers:</span> {movie.writers?.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="mt-10">
            <SectionHeader title="Cast" />
            <HorizontalScroller>
              {movie.cast.map(member => (
                <CircularAvatar key={member.name} person={member} />
              ))}
            </HorizontalScroller>
          </section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section className="mt-10 mb-10">
            <SectionHeader title="More like this" />
            <HorizontalScroller>
              {similar.map(m => (
                <PosterCard key={m.id} movie={m} showWatchlist />
              ))}
            </HorizontalScroller>
          </section>
        )}
      </div>
    </div>
  );
}

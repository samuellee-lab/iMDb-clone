import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PosterCard({ movie, size = 'md', showRating = true, showWatchlist = false, onWatchlistToggle, isInWatchlist }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-36 min-w-[144px]',
    md: 'w-44 min-w-[176px]',
    lg: 'w-56 min-w-[224px]',
  };

  return (
    <Link to={`/title/${movie.id}`} className={`${sizeClasses[size]} group flex-shrink-0`}>
      <div className="relative aspect-[2/3] bg-imdb-card rounded-lg overflow-hidden">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-imdb-hover animate-pulse" />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-imdb-card text-imdb-muted text-sm">
            No Image
          </div>
        ) : (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {showRating && movie.rating && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-imdb-gold text-xs font-bold px-1.5 py-0.5 rounded">
            ★ {movie.rating}
          </div>
        )}
        {showWatchlist && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWatchlistToggle?.(movie); }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isInWatchlist ? 'bg-imdb-gold text-black' : 'bg-black/50 text-white hover:bg-imdb-gold hover:text-black'
            }`}
          >
            {isInWatchlist ? '✓' : '+'}
          </button>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm text-white font-medium truncate group-hover:text-imdb-gold transition-colors">
          {movie.title}
        </p>
        {movie.year && (
          <p className="text-xs text-imdb-muted">{movie.year}</p>
        )}
      </div>
    </Link>
  );
}

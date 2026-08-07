import { Link } from 'react-router-dom';

export default function RankedCard({ movie, rank, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-36',
    md: 'w-44',
    lg: 'w-52',
  };

  return (
    <Link to={`/title/${movie.id}`} className={`${sizeClasses[size]} group flex-shrink-0`}>
      <div className="relative aspect-[2/3] bg-imdb-card rounded-lg overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-8">
          <span className="text-5xl font-black text-white/90 leading-none block">{rank}</span>
        </div>
      </div>
      <p className="text-sm text-white font-medium mt-1.5 truncate group-hover:text-imdb-gold transition-colors">
        {movie.title}
      </p>
      {movie.rating && (
        <div className="flex items-center gap-1 text-xs text-imdb-muted">
          <span className="text-imdb-gold">★</span> {movie.rating}
        </div>
      )}
    </Link>
  );
}

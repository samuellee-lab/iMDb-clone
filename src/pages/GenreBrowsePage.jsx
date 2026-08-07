import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PosterCard from '../components/PosterCard';
import SectionHeader from '../components/SectionHeader';
import { fetchMovies } from '../services/api';

export default function GenreBrowsePage() {
  const { genre } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMovies({ genre }).then(data => { setMovies(data); setLoading(false); });
  }, [genre]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <SectionHeader title={`${genre} Movies & TV`} subtitle={`Browse all ${genre.toLowerCase()} titles`} />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-imdb-card rounded-lg" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map(movie => (
            <PosterCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-white">No titles found for {genre}</p>
        </div>
      )}
    </div>
  );
}

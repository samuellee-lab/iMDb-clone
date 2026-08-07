import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPersonById } from '../services/api';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

export default function PersonDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await fetchPersonById(id);
      setPerson(p);
      if (p) addToRecentlyViewed({ ...p, type: 'person' });
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 animate-pulse">
        <div className="flex gap-8">
          <div className="w-64 h-64 bg-imdb-card rounded-full" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 bg-imdb-card rounded" />
            <div className="h-4 w-32 bg-imdb-card rounded" />
            <div className="h-20 bg-imdb-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Person not found</h2>
        <Link to="/" className="text-imdb-gold hover:underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Photo */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-imdb-card ring-4 ring-imdb-gold/20">
            <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{person.name}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-imdb-muted mb-4">
            {person.birthDate && <span>{person.birthDate}</span>}
            {person.birthPlace && <span>• {person.birthPlace}</span>}
          </div>
          <p className="text-white/80 leading-relaxed max-w-3xl">{person.bio}</p>
        </div>
      </div>

      {/* Filmography */}
      {person.filmography && person.filmography.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">Filmography</h2>
          <div className="bg-imdb-card rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-imdb-border text-imdb-muted text-left">
                  <th className="py-3 px-4 font-medium">Title</th>
                  <th className="py-3 px-4 font-medium">Year</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Role</th>
                </tr>
              </thead>
              <tbody>
                {person.filmography.map((film, i) => (
                  <tr key={i} className="border-b border-imdb-border last:border-b-0 hover:bg-imdb-hover transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/title/${film.movieId}`} className="text-white hover:text-imdb-gold transition-colors">
                        {film.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-imdb-muted">{film.year}</td>
                    <td className="py-3 px-4 text-imdb-muted hidden md:table-cell">{film.role || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

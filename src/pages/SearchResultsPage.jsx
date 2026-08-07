import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PosterCard from '../components/PosterCard';
import CircularAvatar from '../components/CircularAvatar';
import SectionHeader from '../components/SectionHeader';
import { searchMovies, searchPeople } from '../services/api';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('All');

  useEffect(() => {
    if (!query.trim()) return;
    async function search() {
      setLoading(true);
      const [m, p] = await Promise.all([searchMovies(query), searchPeople(query)]);
      setMovies(m);
      setPeople(p);
      setLoading(false);
    }
    search();
  }, [query]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">
        Search results for "{query}"
      </h1>
      <p className="text-sm text-imdb-muted mb-6">
        {movies.length} titles • {people.length} names
      </p>

      <div className="flex gap-2 mb-6">
        {['All', 'Titles', 'People'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === t ? 'bg-imdb-gold text-black' : 'bg-imdb-card text-white hover:bg-imdb-hover'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-imdb-card rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {(tab === 'All' || tab === 'Titles') && movies.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Titles" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map(m => (
                  <PosterCard key={m.id} movie={m} />
                ))}
              </div>
            </section>
          )}

          {(tab === 'All' || tab === 'People') && people.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="People" />
              <div className="flex gap-4 flex-wrap">
                {people.map(p => (
                  <CircularAvatar key={p.id} person={p} />
                ))}
              </div>
            </section>
          )}

          {movies.length === 0 && people.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-white mb-1">No results found for "{query}"</p>
              <p className="text-sm text-imdb-muted">Try adjusting your search terms.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

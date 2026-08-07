import { useState, useEffect } from 'react';
import RankedCard from '../components/RankedCard';
import SectionHeader from '../components/SectionHeader';
import { fetchTop10 } from '../services/api';

export default function Top10Page() {
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTop10().then(data => { setTop10(data); setLoading(false); });
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <SectionHeader title="Top 10 on iMDb" subtitle="This week's most popular titles" />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-imdb-card rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {top10.map((movie, i) => (
            <RankedCard key={movie.id} movie={movie} rank={i + 1} size="lg" />
          ))}
        </div>
      )}
    </div>
  );
}

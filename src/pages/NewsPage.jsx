import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import SectionHeader from '../components/SectionHeader';
import { fetchNewsData } from '../services/api';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsData().then(data => { setNews(data); setLoading(false); });
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <SectionHeader title="Top News" subtitle="Latest entertainment headlines" />

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-16 bg-imdb-card rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-imdb-card rounded w-3/4" />
                <div className="h-3 bg-imdb-card rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {news.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

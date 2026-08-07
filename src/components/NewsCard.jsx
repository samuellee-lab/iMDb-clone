export default function NewsCard({ article }) {
  return (
    <div className="flex gap-3 group cursor-pointer py-2 border-b border-imdb-border last:border-b-0">
      <img
        src={article.image}
        alt={article.title}
        className="w-16 h-16 rounded object-cover flex-shrink-0 bg-imdb-card"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="text-sm text-white group-hover:text-imdb-gold transition-colors line-clamp-2 font-medium">
          {article.title}
        </p>
        <p className="text-xs text-imdb-muted mt-1">{article.date}</p>
      </div>
    </div>
  );
}

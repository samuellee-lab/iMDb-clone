export default function VideoCard({ title, subtitle, image, duration }) {
  return (
    <div className="w-72 min-w-[288px] flex-shrink-0 group cursor-pointer">
      <div className="relative aspect-video bg-imdb-card rounded-lg overflow-hidden">
        <img src={image || 'https://picsum.photos/seed/video/400/225'} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all">
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {duration}
          </span>
        )}
      </div>
      <p className="text-sm text-white font-medium mt-1.5 group-hover:text-imdb-gold transition-colors line-clamp-2">
        {title}
      </p>
      {subtitle && <p className="text-xs text-imdb-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}

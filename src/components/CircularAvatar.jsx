import { Link } from 'react-router-dom';

export default function CircularAvatar({ person, size = 'md' }) {
  const sizeClasses = { sm: 'w-16 h-16', md: 'w-20 h-20', lg: 'w-28 h-28' };
  const containerClasses = { sm: 'w-[72px]', md: 'w-[88px]', lg: 'w-[120px]' };

  return (
    <Link to={`/name/${person.id}`} className={`${containerClasses[size]} group flex-shrink-0 text-center`}>
      <div className={`${sizeClasses[size]} mx-auto rounded-full overflow-hidden bg-imdb-hover ring-2 ring-transparent group-hover:ring-imdb-gold transition-all`}>
        <img
          src={person.photo}
          alt={person.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <p className="text-xs text-white mt-1.5 truncate group-hover:text-imdb-gold transition-colors">
        {person.name}
      </p>
    </Link>
  );
}

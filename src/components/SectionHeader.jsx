import { Link } from 'react-router-dom';

export default function SectionHeader({ title, subtitle, linkTo, linkText = 'Browse all' }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-imdb-muted mt-0.5">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-sm text-imdb-gold hover:underline whitespace-nowrap ml-4">
          {linkText} &rsaquo;
        </Link>
      )}
    </div>
  );
}

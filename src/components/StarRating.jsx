export default function StarRating({ rating, maxRating = 10, size = 'sm' }) {
  const stars = [];
  const scaled = rating / (maxRating / 10);
  const fullStars = Math.floor(scaled);
  const hasHalf = scaled - fullStars >= 0.5;

  for (let i = 1; i <= 10; i++) {
    if (i <= fullStars) stars.push('full');
    else if (i === fullStars + 1 && hasHalf) stars.push('half');
    else stars.push('empty');
  }

  const sizeClass = size === 'lg' ? 'text-lg' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass}`}>
      {stars.map((type, i) => (
        <span key={i} className={type === 'empty' ? 'text-gray-600' : 'text-imdb-gold'}>
          {type === 'half' ? '⯨' : '★'}
        </span>
      ))}
    </span>
  );
}

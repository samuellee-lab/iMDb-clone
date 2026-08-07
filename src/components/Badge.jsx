export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-imdb-card text-white border border-imdb-border',
    gold: 'bg-imdb-gold text-black',
    streaming: 'bg-blue-900/60 text-blue-300 border border-blue-800',
    dark: 'bg-black/70 text-white backdrop-blur-sm',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

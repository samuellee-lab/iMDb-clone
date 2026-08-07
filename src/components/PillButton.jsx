export default function PillButton({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-imdb-gold text-black'
          : 'bg-imdb-card text-white hover:bg-imdb-hover border border-imdb-border'
      }`}
    >
      {label}
    </button>
  );
}

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-imdb-gold mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-imdb-muted mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="imdb-btn inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

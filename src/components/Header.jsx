import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiSearch, HiMenu, HiX, HiBookmark } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const catRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCategoryOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const categories = ['All', 'Movies', 'TV Shows', 'Top 10', 'News'];

  return (
    <header className="sticky top-0 z-50 bg-imdb-dark border-b border-imdb-border">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-center h-14 gap-3 lg:gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-black bg-imdb-gold text-black px-2 py-0.5 rounded hover:bg-yellow-400 transition-colors">
              iMDb
            </span>
          </Link>

          {/* Category dropdown - desktop */}
          <div className="relative hidden md:block" ref={catRef}>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-white hover:bg-imdb-hover rounded transition-colors text-sm"
            >
              <HiMenu size={18} />
              <span>All</span>
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-imdb-card border border-imdb-border rounded-lg shadow-xl py-1 z-50">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategoryOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-imdb-hover transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-imdb-muted" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iMDb"
                className="w-full bg-imdb-card border border-imdb-border text-white text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-imdb-gold focus:bg-imdb-hover transition-all"
              />
            </div>
          </form>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-3 text-sm text-white">
            <a href="#" className="imdb-link whitespace-nowrap">iMDbPro</a>
            <Link to="/watchlist" className="imdb-link flex items-center gap-1 whitespace-nowrap">
              <HiBookmark size={16} /> Watchlist
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-imdb-muted text-xs">{user.displayName}</span>
                <button onClick={logout} className="imdb-link">Sign Out</button>
              </div>
            ) : (
              <Link to="/signin" className="imdb-btn text-xs px-4 py-1">Sign In</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-1"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-imdb-dark border-t border-imdb-border px-4 py-3 space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left text-white text-sm py-2"
            >
              {cat}
            </button>
          ))}
          <hr className="border-imdb-border" />
          <a href="#" className="block text-sm imdb-link py-1">iMDbPro</a>
          <Link to="/watchlist" className="block text-sm imdb-link py-1" onClick={() => setMobileMenuOpen(false)}>
            Watchlist
          </Link>
          {user ? (
            <>
              <span className="block text-xs text-imdb-muted py-1">{user.displayName}</span>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block text-sm imdb-link py-1">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin" className="block text-sm imdb-link py-1" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PosterCard from '../components/PosterCard';
import HorizontalScroller from '../components/HorizontalScroller';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';
import CircularAvatar from '../components/CircularAvatar';
import RankedCard from '../components/RankedCard';
import VideoCard from '../components/VideoCard';
import NewsCard from '../components/NewsCard';
import ToggleTabs from '../components/ToggleTabs';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { useWatchlist } from '../context/WatchlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useAuth } from '../context/AuthContext';
import {
  fetchFeaturedMovie, fetchMovies, fetchTop10, fetchFanFavorites,
  fetchBoxOffice, fetchComingSoon, fetchTrendingPeople, fetchBornToday,
  fetchNews,
} from '../services/api';

export default function HomePage() {
  const [featured, setFeatured] = useState(null);
  const [featuredToday, setFeaturedToday] = useState([]);
  const [top10, setTop10] = useState([]);
  const [fanFavorites, setFanFavorites] = useState([]);
  const [boxOffice, setBoxOffice] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [trendingPeople, setTrendingPeople] = useState([]);
  const [trendTab, setTrendTab] = useState('Top rated');
  const [bornToday, setBornToday] = useState([]);
  const [news, setNews] = useState([]);
  const [streaming, setStreaming] = useState([]);
  const [inTheaters, setInTheaters] = useState([]);
  const [whatToWatch, setWhatToWatch] = useState([]);
  const [loading, setLoading] = useState(true);

  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { recentlyViewed } = useRecentlyViewed();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [
        f, ft, t10, ff, bo, cs, tp, bt, n, str, it,
      ] = await Promise.all([
        fetchFeaturedMovie(),
        fetchMovies({ limit: 10 }),
        fetchTop10(),
        fetchFanFavorites(),
        fetchBoxOffice(),
        fetchComingSoon(),
        fetchTrendingPeople(),
        fetchBornToday(),
        fetchNews({ limit: 4 }),
        fetchMovies({ limit: 8 }),
        fetchMovies({ limit: 8 }),
      ]);
      setFeatured(f);
      setFeaturedToday(ft);
      setTop10(t10);
      setFanFavorites(ff);
      setBoxOffice(bo);
      setComingSoon(cs);
      setTrendingPeople(tp);
      setBornToday(bt);
      setNews(n);
      setStreaming(str.slice(10, 18));
      setInTheaters(it.slice(20, 28));
      setWhatToWatch(it.filter(m => m.isSeries).slice(0, 8));
      setLoading(false);
    }
    load();
  }, []);

  const quickLinks = ['Trailer', 'Summer With Sadie', 'Average Americans', 'iMDb Labs'];

  const genres = ['Drama', 'Hindi', 'Horror', 'Thriller', 'Comedy', 'Action'];

  const interviews = [
    { title: 'Get Into The Odyssey Creatives With Christopher Nolan and the Cast', image: 'https://picsum.photos/seed/interview1/400/225', duration: '4:32' },
    { title: 'Michael B. Jordan Stars In The Thawing Ocean Film', image: 'https://picsum.photos/seed/interview2/400/225', duration: '3:15' },
    { title: 'Shazam and Dominio Go to "War"', image: 'https://picsum.photos/seed/interview3/400/225', duration: '2:48' },
  ];

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-[400px] bg-imdb-card rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-imdb-card rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* ===== HERO SECTION ===== */}
      {featured && (
        <section className="relative h-[420px] md:h-[500px] overflow-hidden">
          <img
            src={featured.backdrop}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-imdb-dark via-transparent to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 max-w-[1440px] mx-auto">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 max-w-2xl">
              {featured.title}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <button className="imdb-btn flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch the Trailer
              </button>
              <Badge variant="dark">{featured.runtime}</Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              {quickLinks.map(link => (
                <button key={link} className="imdb-btn-outline">{link}</button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8 mt-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-10">
          {/* ===== FEATURED TODAY ===== */}
          <section>
            <SectionHeader
              title="Featured today"
              subtitle="Want to Watch in August"
            />
            <HorizontalScroller>
              {featuredToday.map(movie => (
                <PosterCard
                  key={movie.id}
                  movie={movie}
                  showWatchlist
                  isInWatchlist={isInWatchlist(movie.id)}
                  onWatchlistToggle={(m) => isInWatchlist(m.id) ? removeFromWatchlist(m.id) : addToWatchlist(m)}
                />
              ))}
            </HorizontalScroller>
          </section>

          {/* ===== TOP 10 ===== */}
          <section>
            <SectionHeader title="Top 10 on iMDb this week" linkTo="/chart/top" />
            <HorizontalScroller>
              {top10.map((movie, i) => (
                <RankedCard key={movie.id} movie={movie} rank={i + 1} />
              ))}
            </HorizontalScroller>
          </section>

          {/* ===== FAN FAVORITES ===== */}
          <section>
            <SectionHeader title="Fan favorites" subtitle="This week's top TV and movies" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {fanFavorites.map(movie => (
                <PosterCard
                  key={movie.id}
                  movie={movie}
                  showWatchlist
                  isInWatchlist={isInWatchlist(movie.id)}
                  onWatchlistToggle={(m) => isInWatchlist(m.id) ? removeFromWatchlist(m.id) : addToWatchlist(m)}
                />
              ))}
            </div>
          </section>

          {/* ===== POPULAR INTERESTS ===== */}
          <section>
            <SectionHeader title="Popular interests" />
            <div className="flex gap-2 flex-wrap">
              {genres.map(genre => (
                <PillButton
                  key={genre}
                  label={genre}
                  onClick={() => {}} // handled by routing to genre page
                />
              ))}
            </div>
          </section>

          {/* ===== EXPLORE STREAMING ===== */}
          <section>
            <SectionHeader title="Explore what's streaming" />
            <div className="mb-3">
              <Badge variant="streaming">Prime Video</Badge>
              <span className="text-xs text-imdb-muted ml-2">Included with Prime</span>
            </div>
            <HorizontalScroller>
              {streaming.map(movie => (
                <PosterCard key={movie.id} movie={movie} />
              ))}
            </HorizontalScroller>
          </section>

          {/* ===== IN THEATERS ===== */}
          <section>
            <SectionHeader title="Explore movies & TV shows" />
            <div className="flex items-center gap-4 mb-3">
              <span className="text-white font-medium text-sm">In theaters</span>
              <a href="#" className="text-xs text-imdb-gold hover:underline">Showtimes near you</a>
            </div>
            <HorizontalScroller>
              {inTheaters.map(movie => (
                <PosterCard key={movie.id} movie={movie} />
              ))}
            </HorizontalScroller>
          </section>

          {/* ===== TOP BOX OFFICE ===== */}
          <section>
            <SectionHeader
              title="Top box office (US)"
              subtitle="Weekend of July 26–August 2"
            />
            <div className="space-y-2">
              {boxOffice.map((movie, i) => (
                <Link
                  key={movie.id}
                  to={`/title/${movie.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-imdb-card transition-colors group"
                >
                  <span className="text-lg font-bold text-imdb-muted w-6 text-right">{i + 1}</span>
                  <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                  <div>
                    <p className="text-sm text-white font-medium group-hover:text-imdb-gold transition-colors">{movie.title}</p>
                    <p className="text-xs text-imdb-muted">{movie.year} • ★ {movie.rating}</p>
                    <p className="text-xs text-imdb-muted">{movie.runtime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ===== COMING SOON ===== */}
          <section>
            <SectionHeader title="Coming soon to theaters" subtitle="Trailers for upcoming releases" />
            <HorizontalScroller>
              {comingSoon.map(movie => (
                <div key={movie.id} className="w-44 min-w-[176px] flex-shrink-0">
                  <div className="relative aspect-[2/3] bg-imdb-card rounded-lg overflow-hidden">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    <Badge variant="dark" className="absolute top-2 left-2">{movie.releaseDate}</Badge>
                  </div>
                  <p className="text-sm text-white font-medium mt-1.5 truncate">{movie.title}</p>
                </div>
              ))}
            </HorizontalScroller>
          </section>

          {/* ===== BORN TODAY ===== */}
          <section>
            <SectionHeader title="Born today" subtitle="People born on August 7" />
            <HorizontalScroller>
              {bornToday.map(person => (
                <CircularAvatar key={person.id} person={person} />
              ))}
            </HorizontalScroller>
          </section>

          {/* ===== WHAT TO WATCH (for signed-in) ===== */}
          {isAuthenticated && (
            <section>
              <SectionHeader
                title="What to watch"
                subtitle="Current & upcoming TV shows"
              />
              <p className="text-xs text-imdb-muted mb-3">From your Watchlist, ratings, and popular shows</p>
              <HorizontalScroller>
                {whatToWatch.map(movie => (
                  <PosterCard key={movie.id} movie={movie} />
                ))}
              </HorizontalScroller>
            </section>
          )}

          {/* ===== TOP NEWS ===== */}
          <section>
            <SectionHeader title="Top news" linkTo="/news" linkText="MORE NEWS" />
            <div className="grid md:grid-cols-2 gap-4">
              {news.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>

          {/* ===== RECENTLY VIEWED ===== */}
          <section>
            <SectionHeader title="Recently viewed" />
            {recentlyViewed.length > 0 ? (
              <HorizontalScroller>
                {recentlyViewed.map(item => (
                  <PosterCard key={`${item.type}-${item.id}`} movie={item} />
                ))}
              </HorizontalScroller>
            ) : (
              <EmptyState
                title="You have no recently viewed pages"
                subtitle={!isAuthenticated ? 'Sign in for more access' : ''}
                actionLabel={!isAuthenticated ? 'Sign In' : undefined}
                onAction={!isAuthenticated ? () => {} : undefined}
              />
            )}
          </section>
        </div>

        {/* ===== SIDEBAR (desktop) ===== */}
        <aside className="hidden lg:block w-[300px] flex-shrink-0 space-y-6">
          {/* UP NEXT */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Up next</h3>
            <p className="text-xs text-imdb-gold font-semibold tracking-wide mb-3">iMDb INTERVIEWS</p>
            <div className="space-y-4">
              {interviews.map((item, i) => (
                <VideoCard key={i} {...item} />
              ))}
            </div>
            <Link to="/" className="block text-sm text-imdb-gold hover:underline mt-3">
              Browse trailers &rsaquo;
            </Link>
          </div>

          {/* TOM HOLLAND SPOTLIGHT */}
          <div className="bg-imdb-card rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-1">Tom Holland's Top-Rated Roles</h3>
            <p className="text-xs text-imdb-muted mb-4">
              See which of his roles are the biggest hits with iMDb fans.
            </p>
            <div className="space-y-2">
              {[
                { title: 'The Odyssey', year: 2026, rating: 9.1 },
                { title: 'Avengers: Endgame', year: 2019, rating: 8.4 },
                { title: 'Avengers: Infinity War', year: 2018, rating: 8.4 },
                { title: 'Spider-Man: Brand New Day', year: 2026, rating: 8.7 },
                { title: 'Spider-Man: No Way Home', year: 2021, rating: 8.2 },
                { title: 'Captain America: Civil War', year: 2016, rating: 7.8 },
                { title: 'The Impossible', year: 2012, rating: 7.5 },
                { title: 'Spider-Man: Homecoming', year: 2017, rating: 7.4 },
              ].map((role, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-imdb-muted w-5 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{role.title}</p>
                    <p className="text-xs text-imdb-muted">{role.year} • ★ {role.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRENDING PEOPLE */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Trending people</h3>
            <ToggleTabs
              tabs={['Top rated', 'By ratings']}
              activeTab={trendTab}
              onTabChange={setTrendTab}
            />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {trendingPeople.slice(0, 6).map(person => (
                <CircularAvatar key={person.id} person={person} size="sm" />
              ))}
            </div>
          </div>

          {/* SIGN IN PROMPT */}
          {!isAuthenticated && (
            <div className="bg-imdb-card rounded-lg p-4 text-center">
              <h4 className="text-sm font-bold text-white mb-2">Sign in to access your Watchlist</h4>
              <p className="text-xs text-imdb-muted mb-3">
                Save shows and movies to keep track of what you want to watch.
              </p>
              <Link to="/signin" className="imdb-btn inline-block text-sm">
                Sign in for more access
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

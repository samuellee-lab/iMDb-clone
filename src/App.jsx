import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import WatchlistPage from './pages/WatchlistPage';
import Top10Page from './pages/Top10Page';
import GenreBrowsePage from './pages/GenreBrowsePage';
import NewsPage from './pages/NewsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <RecentlyViewedProvider>
          <div className="min-h-screen bg-imdb-dark flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/title/:id" element={<MovieDetailPage />} />
                <Route path="/name/:id" element={<PersonDetailPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/chart/top" element={<Top10Page />} />
                <Route path="/genre/:genre" element={<GenreBrowsePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RecentlyViewedProvider>
      </WatchlistProvider>
    </AuthProvider>
  );
}

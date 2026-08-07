import { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchMovies, createMovie, updateMovie, deleteMovie, uploadMovieImage
} from '../services/api';

export default function AdminPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(getEmptyForm());
  const [posterFile, setPosterFile] = useState(null);
  const [backdropFile, setBackdropFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [backdropPreview, setBackdropPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const posterRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => { loadMovies(); }, []);

  async function loadMovies() {
    const data = await fetchMovies();
    setMovies(data);
    setLoading(false);
  }

  function getEmptyForm() {
    return {
      title: '', year: new Date().getFullYear(), runtime: '', genres: '',
      rating: 0, votes: 0, plot: '', director: '', writers: '',
      trailer: '', is_featured: false, is_series: false, streaming_on: '',
    };
  }

  function handleEdit(movie) {
    setEditing(movie);
    setForm({
      title: movie.title, year: movie.year, runtime: movie.runtime || '',
      genres: (movie.genres || []).join(', '), rating: movie.rating || 0,
      votes: movie.votes || 0, plot: movie.plot || '', director: movie.director || '',
      writers: (movie.writers || []).join(', '), trailer: movie.trailer || '',
      is_featured: movie.is_featured, is_series: movie.is_series,
      streaming_on: movie.streaming_on || '',
    });
    setPosterPreview(movie.poster_url || '');
    setBackdropPreview(movie.backdrop_url || '');
    setPosterFile(null);
    setBackdropFile(null);
    window.scrollTo(0, 0);
  }

  function handleNew() {
    setEditing(null);
    setForm(getEmptyForm());
    setPosterPreview('');
    setBackdropPreview('');
    setPosterFile(null);
    setBackdropFile(null);
    window.scrollTo(0, 0);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handlePosterChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  }

  function handleBackdropChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setBackdropFile(file);
      setBackdropPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let poster_url = posterPreview;
      let backdrop_url = backdropPreview;

      if (posterFile) poster_url = await uploadMovieImage(posterFile, 'posters');
      if (backdropFile) backdrop_url = await uploadMovieImage(backdropFile, 'backdrops');

      const movieData = {
        ...form,
        year: Number(form.year),
        rating: Number(form.rating),
        votes: Number(form.votes),
        genres: form.genres.split(',').map(g => g.trim()).filter(Boolean),
        writers: form.writers.split(',').map(w => w.trim()).filter(Boolean),
        cast_data: editing?.cast_data || [],
        poster_url,
        backdrop_url,
      };

      if (editing) {
        await updateMovie(editing.id, movieData);
        setMessage('Movie updated!');
      } else {
        await createMovie(movieData);
        setMessage('Movie created!');
        handleNew();
      }
      await loadMovies();
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this movie permanently?')) return;
    await deleteMovie(id);
    setMessage('Movie deleted.');
    if (editing?.id === id) handleNew();
    await loadMovies();
  }

  if (authLoading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-imdb-gold border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/signin?redirect=/admin" replace />;

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">CMS Admin</h1>
          <p className="text-sm text-imdb-muted">Manage movies, posters, and metadata</p>
        </div>
        <Link to="/" className="imdb-link text-sm">← Back to site</Link>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-900/30 text-red-300 border border-red-700' : 'bg-green-900/30 text-green-300 border border-green-700'}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Movie List */}
        <div className="lg:w-1/2 xl:w-2/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">
              {movies.length} Movies
            </h2>
            <button onClick={handleNew} className="imdb-btn text-xs px-4 py-1.5">
              + New Movie
            </button>
          </div>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-imdb-card rounded-lg" />)}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12 bg-imdb-card rounded-lg">
              <p className="text-imdb-muted">No movies yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[70vh] overflow-y-auto">
              {movies.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => handleEdit(movie)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    editing?.id === movie.id ? 'bg-imdb-gold/10 border border-imdb-gold/30' : 'hover:bg-imdb-card border border-transparent'
                  }`}
                >
                  <img
                    src={movie.poster_url || 'https://picsum.photos/seed/placeholder/60/90'}
                    alt=""
                    className="w-10 h-14 object-cover rounded flex-shrink-0 bg-imdb-card"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{movie.title || '(untitled)'}</p>
                    <p className="text-xs text-imdb-muted">{movie.year} {movie.director ? `• ${movie.director}` : ''}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(movie.id); }}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div className="lg:w-1/2 xl:w-3/5">
          <div className="bg-imdb-card rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {editing ? `Edit: ${editing.title}` : 'New Movie'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} required
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Year</label>
                  <input name="year" type="number" value={form.year} onChange={handleChange}
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Runtime</label>
                  <input name="runtime" value={form.runtime} onChange={handleChange} placeholder="2h 15m"
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Rating (0-10)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="10" value={form.rating} onChange={handleChange}
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Genres (comma-separated)</label>
                  <input name="genres" value={form.genres} onChange={handleChange} placeholder="Action, Drama"
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Director</label>
                  <input name="director" value={form.director} onChange={handleChange}
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Writers (comma-separated)</label>
                  <input name="writers" value={form.writers} onChange={handleChange}
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Streaming on</label>
                  <input name="streaming_on" value={form.streaming_on} onChange={handleChange} placeholder="Netflix"
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Votes</label>
                  <input name="votes" type="number" value={form.votes} onChange={handleChange}
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Trailer URL (YouTube embed)</label>
                  <input name="trailer" value={form.trailer} onChange={handleChange}
                    className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-imdb-muted mb-1">Plot</label>
                <textarea name="plot" value={form.plot} onChange={handleChange} rows={3}
                  className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imdb-gold resize-none" />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange}
                    className="accent-imdb-gold" />
                  <span className="text-sm text-white">Featured (hero banner)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_series" checked={form.is_series} onChange={handleChange}
                    className="accent-imdb-gold" />
                  <span className="text-sm text-white">TV Series</span>
                </label>
              </div>

              {/* Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Poster Image</label>
                  <input type="file" accept="image/*" onChange={handlePosterChange} ref={posterRef}
                    className="w-full text-sm text-imdb-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-imdb-dark file:text-white hover:file:bg-imdb-hover file:cursor-pointer" />
                  {posterPreview && (
                    <img src={posterPreview} alt="Poster preview" className="mt-2 w-24 h-36 object-cover rounded border border-imdb-border" />
                  )}
                </div>
                <div>
                  <label className="block text-sm text-imdb-muted mb-1">Backdrop Image</label>
                  <input type="file" accept="image/*" onChange={handleBackdropChange} ref={backdropRef}
                    className="w-full text-sm text-imdb-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-imdb-dark file:text-white hover:file:bg-imdb-hover file:cursor-pointer" />
                  {backdropPreview && (
                    <img src={backdropPreview} alt="Backdrop preview" className="mt-2 w-full h-20 object-cover rounded border border-imdb-border" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="imdb-btn px-6 py-2 disabled:opacity-50">
                  {saving ? 'Saving...' : editing ? 'Update Movie' : 'Create Movie'}
                </button>
                {editing && (
                  <button type="button" onClick={handleNew} className="imdb-btn-outline">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-imdb-card rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-imdb-muted mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-imdb-gold transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-imdb-muted mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-imdb-gold transition-colors text-sm"
              />
            </div>
            <button type="submit" className="imdb-btn w-full py-2.5">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-imdb-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-imdb-gold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

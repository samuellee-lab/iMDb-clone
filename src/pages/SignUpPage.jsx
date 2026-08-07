import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    signup(email, password, displayName);
    navigate('/');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-imdb-card rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h1>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-imdb-muted mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-imdb-gold transition-colors text-sm"
              />
            </div>
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
                placeholder="At least 6 characters"
                className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-imdb-gold transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-imdb-muted mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-imdb-dark border border-imdb-border text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-imdb-gold transition-colors text-sm"
              />
            </div>
            <button type="submit" className="imdb-btn w-full py-2.5">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-imdb-muted">
              Already have an account?{' '}
              <Link to="/signin" className="text-imdb-gold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

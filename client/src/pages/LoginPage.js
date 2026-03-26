import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div className="admin-login-logo">Her<span>Access</span></div>
        <div className="admin-login-sub">Admin Panel</div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field" style={{ marginBottom: 16 }}>
            <label htmlFor="username">Username</label>
            <input
              id="username" type="text" placeholder="admin"
              autoComplete="username"
              value={username} onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="login-field" style={{ marginBottom: 28 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" placeholder="••••••••"
              autoComplete="current-password"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            className="btn-submit"
            type="submit"
            disabled={loading}
            style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
    setGlobalError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError('');
    try {
      const res = await authApi.login({ email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      else setGlobalError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #080812 0%, #12082a 50%, #080d1e 100%)' }}>

      {/* Background orbs */}
      <div className="orb animate-float-slow" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', top: -150, left: -150 }} />
      <div className="orb animate-float" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', bottom: -100, right: -100, animationDelay: '-3s' }} />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🌍</span>
            <span className="text-2xl font-black text-white">Roamly</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Sign in</h1>
          <p className="text-white/40 text-sm">to continue to Roamly</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit} noValidate>

            {globalError && (
              <div className="mb-5 p-4 rounded-2xl text-red-300 text-sm animate-fade-in"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                ⚠️ {globalError}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                className={`input-glass w-full ${errors.email ? 'border-red-500/50' : ''}`}
              />
              {errors.email && <p className="mt-1.5 text-red-400 text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                className={`input-glass w-full ${errors.password ? 'border-red-500/50' : ''}`}
              />
              {errors.password && <p className="mt-1.5 text-red-400 text-xs">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-white/40 text-sm">Don't have an account? </span>
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

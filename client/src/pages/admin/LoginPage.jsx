import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPANY } from '../../data/company';
import { API_URL, getToken, setAuth } from '../../utils/adminApi';
import PhoneInput from '../../components/common/PhoneInput';

export default function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Login failed');
      }

      setAuth(json.data.token, json.data.user);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rich-dark flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-blob blob-orange" style={{ width: 400, height: 400, top: '-10%', right: '-5%' }} />
        <div className="gradient-blob blob-gold" style={{ width: 350, height: 350, bottom: '-5%', left: '-8%' }} />
      </div>

      <div className="glass-card w-full max-w-md p-8 sm:p-10 relative z-10 !transform-none hover:!transform-none">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white mx-auto mb-4 flex items-center justify-center ring-2 ring-[rgba(249,115,22,0.25)]">
            <img src="/images/logo.png" alt={COMPANY.shortName} className="w-full h-full object-contain p-1.5" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Admin Panel
          </h1>
          <p className="text-sm text-[#B8A98A]">{COMPANY.name}</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#B8A98A] mb-2">
              Phone Number
            </label>
            <PhoneInput
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              required
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#B8A98A] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-orange w-full ${loading ? 'btn-loading' : ''}`}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Camera, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      setAuth(data.user, data.token);
      router.push(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Camera size={20} className="text-gold-400" />
            <span className="font-display text-xl text-cream-50">Lumière</span>
          </Link>
          <h1 className="font-display text-3xl text-cream-50 mb-2">Welcome Back</h1>
          <p className="text-cream-200/50 font-light text-sm">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body">
              {error}
            </div>
          )}

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
          </button>

          <div className="text-center pt-2 border-t border-cream-200">
            <p className="text-xs text-charcoal-700/50 font-body mt-4">
              No account?{' '}
              <Link href="/register" className="text-gold-500 hover:text-gold-600 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-cream-200/20 text-xs mt-6 font-body">
          Demo: admin@lumierestudio.com / admin123
        </p>
      </div>
    </div>
  );
}

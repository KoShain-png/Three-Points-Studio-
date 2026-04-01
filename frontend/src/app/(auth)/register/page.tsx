'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Camera, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        name: form.name, email: form.email, phone: form.phone, password: form.password,
      });
      setAuth(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Camera size={20} className="text-gold-400" />
            <span className="font-display text-xl text-cream-50">Lumière</span>
          </Link>
          <h1 className="font-display text-3xl text-cream-50 mb-2">Create Account</h1>
          <p className="text-cream-200/50 font-light text-sm">Start booking your dream sessions</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body">{error}</div>
          )}

          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input-field" placeholder="Jane Doe"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input-field" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="label">Phone Number <span className="text-charcoal-700/30">(optional)</span></label>
            <input type="tel" className="input-field" placeholder="+65 9000 0000"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" className="input-field" placeholder="Min. 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input type="password" className="input-field" placeholder="••••••••"
              value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account'}
          </button>

          <div className="text-center pt-2 border-t border-cream-200">
            <p className="text-xs text-charcoal-700/50 font-body mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-500 hover:text-gold-600 transition-colors">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

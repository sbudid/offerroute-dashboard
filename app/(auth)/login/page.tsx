'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#806fff,#5b45ee)', color: 'white', display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(103,85,245,.3)' }}>
            <svg viewBox="0 0 32 32" fill="none" width={28} height={28}><path d="M8 8h8a6 6 0 0 1 0 12h-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M24 24h-8a6 6 0 0 1 0-12h3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>OfferRoute</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Affiliate Link Control Center</p>
        </div>

        <div className="panel" style={{ padding: 32, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
          </h2>

          {error && (
            <div style={{ background: 'var(--red-soft)', color: 'var(--red)', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%' }}
              />
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%' }}
              />
            </label>
            <button type="submit" className="btn primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {loading ? 'Loading…' : mode === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 20 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ background: 'none', border: 0, color: 'var(--primary)', fontWeight: 600, fontSize: 13, padding: 0 }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

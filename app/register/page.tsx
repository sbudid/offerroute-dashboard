'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)', padding: 24 }}>
        <div className="panel" style={{ maxWidth: 420, padding: 32, borderRadius: 'var(--radius)', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Check your email</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            We&apos;ve sent a confirmation link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
          </p>
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>Back to sign in →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#806fff,#5b45ee)', color: 'white', display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(103,85,245,.3)' }}>
            <svg viewBox="0 0 32 32" fill="none" width={28} height={28}><path d="M8 8h8a6 6 0 0 1 0 12h-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M24 24h-8a6 6 0 0 1 0-12h3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>OfferRoute</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Create your account</p>
        </div>

        <div className="panel" style={{ padding: 32, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          {error && (
            <div style={{ background: 'var(--red-soft)', color: 'var(--red)', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%' }} />
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Password</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%' }} />
            </label>
            <label>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Confirm Password</span>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%' }} />
            </label>
            <button type="submit" className="btn primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 20 }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

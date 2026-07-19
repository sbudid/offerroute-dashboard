'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';

interface HealthItem {
  id: string;
  status: string;
  http_status: number;
  redirect_count: number;
  latency_ms: number;
  checked_at: string;
  error_message: string | null;
  destinations?: {
    id: string;
    label: string;
    url: string;
    links?: {
      id: string;
      name: string;
      slug: string;
      domains?: { hostname: string } | null;
    } | null;
  } | null;
}

const initials = (name: string) => name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

export default function HealthPage() {
  const [checks, setChecks] = useState<HealthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Failed to fetch health data');
      const data = await res.json();
      setChecks(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load health data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const healthy = checks.filter(c => c.status === 'healthy').length;
  const warnings = checks.filter(c => c.status === 'degraded').length;
  const broken = checks.filter(c => c.status === 'down').length;

  return (
    <section className="page active" id="page-health">
      <div className="page-heading"><div><p className="eyebrow">AUTOMATED MONITORING</p><h1>Link Health</h1><p>Catch broken offers and expensive redirect chains before visitors do.</p></div><button className="btn ghost">↻ Run checks now</button></div>
      <div className="health-summary">
        <article className="health-card good"><span>✓</span><div><strong>{healthy}</strong><small>Healthy</small></div></article>
        <article className="health-card warning"><span>!</span><div><strong>{warnings}</strong><small>Warnings</small></div></article>
        <article className="health-card bad"><span>×</span><div><strong>{broken}</strong><small>Broken</small></div></article>
        <article className="health-card neutral"><span>◷</span><div><strong>{checks.length > 0 ? new Date(checks[0].checked_at).toLocaleDateString() : '—'}</strong><small>Last scan</small></div></article>
      </div>
      <div className="panel data-panel">
        {loading ? (
          <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
            <div style={{fontSize:18,marginBottom:8}}>Loading health data…</div>
          </div>
        ) : error ? (
          <div style={{padding:'48px',textAlign:'center',color:'var(--red)'}}>
            <div style={{fontSize:18,marginBottom:8}}>{error}</div>
            <button className="btn ghost" onClick={fetchHealth}>Retry</button>
          </div>
        ) : checks.length === 0 ? (
          <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
            <div style={{fontSize:18,marginBottom:8}}>No health checks yet</div>
            <small>Health checks will appear here once destinations are monitored.</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Link</th><th>Destination status</th><th>Redirects</th><th>Last checked</th><th>Recommended action</th></tr></thead>
              <tbody id="healthTableBody">
                {checks.map(c => {
                  const link = c.destinations?.links;
                  const hostname = link?.domains?.hostname ?? '—';
                  const slug = link?.slug ?? '—';
                  const name = link?.name ?? 'Unknown link';
                  const badge = c.status === 'healthy' ? 'success' : c.status === 'down' ? 'danger' : 'warning';
                  const displayStatus = c.status === 'degraded' ? 'Warning' : c.status === 'down' ? 'Broken' : 'Healthy';
                  const action = c.status === 'healthy' ? 'No action needed' : c.status === 'down' ? 'Switch to fallback destination' : 'Shorten the redirect chain';
                  return (
                    <tr key={c.id}>
                      <td><div className="link-cell"><span className="link-avatar">{initials(name)}</span><div><strong>{name}</strong><small>{hostname}/{slug}</small></div></div></td>
                      <td><span className={`badge ${badge}`}>{displayStatus}</span></td>
                      <td>{c.redirect_count} hop{c.redirect_count===1?'':'s'}</td>
                      <td>{new Date(c.checked_at).toLocaleString()}</td>
                      <td className="action-note">{action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

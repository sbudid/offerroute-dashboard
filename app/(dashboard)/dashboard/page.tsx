'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface LinkItem {
  id: string;
  name: string;
  slug: string;
  domains?: { hostname: string } | null;
  offers?: { name: string } | null;
  status: string;
}

const initials = (name: string) => name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(Array.isArray(data) ? data : []);
      }
    } catch {
      // silently fail, show zeros
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const linkCount = links.length;
  const activeCount = links.filter(l => l.status === 'active').length;

  return (
    <section className="page active" id="page-overview">
      <div className="page-heading">
        <div><p className="eyebrow">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</p><h1>Good evening</h1><p>Here&apos;s how your affiliate links are performing.</p></div>
        <div className="date-filter"><button className="btn ghost">Last 30 days⌄</button></div>
      </div>

      <div className="metrics-grid">
        <article className="metric-card"><div className="metric-label"><span>Total links</span><span className="metric-icon">↗</span></div><div className="metric-value">{loading ? '…' : linkCount}</div><div className="metric-change"><span>{activeCount} active</span></div></article>
        <article className="metric-card"><div className="metric-label"><span>Unique visitors</span><span className="metric-icon">♙</span></div><div className="metric-value">0</div><div className="metric-change"><span>No data yet</span></div></article>
        <article className="metric-card"><div className="metric-label"><span>Conversions</span><span className="metric-icon">✓</span></div><div className="metric-value">0</div><div className="metric-change"><span>No data yet</span></div></article>
        <article className="metric-card"><div className="metric-label"><span>Revenue</span><span className="metric-icon">$</span></div><div className="metric-value">$0</div><div className="metric-change"><span>No data yet</span></div></article>
      </div>

      <div className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-header"><div><h2>Performance</h2><p>Clicks and conversions over time</p></div><div className="legend"><span><i className="clicks"></i>Clicks</span><span><i className="conversions"></i>Conversions</span></div></div>
          <div className="chart-wrap">
            {linkCount === 0 ? (
              <div style={{padding:'48px',textAlign:'center',color:'var(--muted)',width:'100%'}}>
                <div style={{fontSize:16,marginBottom:8}}>No data yet</div>
                <small>Create some links and drive traffic to see performance charts.</small>
              </div>
            ) : (
              <>
                <div className="chart-y"><span>1.5k</span><span>1.0k</span><span>500</span><span>0</span></div>
                <svg className="line-chart" viewBox="0 0 800 250" preserveAspectRatio="none" aria-label="Clicks and conversions chart">
                  <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6857ff" stopOpacity=".28"/><stop offset="1" stopColor="#6857ff" stopOpacity="0"/></linearGradient></defs>
                  <g className="grid-lines"><line x1="0" y1="20" x2="800" y2="20"/><line x1="0" y1="90" x2="800" y2="90"/><line x1="0" y1="160" x2="800" y2="160"/><line x1="0" y1="230" x2="800" y2="230"/></g>
                  <path className="area" d="M0 230 L800 230 Z"/>
                  <path className="line primary-line" d="M0 230 L800 230"/>
                  <path className="line secondary-line" d="M0 230 L800 230"/>
                </svg>
                <div className="chart-x"><span>-</span><span>-</span><span>-</span><span>-</span><span>-</span><span>-</span><span>-</span></div>
              </>
            )}
          </div>
        </article>

        <article className="panel attention-panel">
          <div className="panel-header"><div><h2>Needs attention</h2><p>Issues that may cost you clicks</p></div><span className="badge success">All clear</span></div>
          <div className="issue-list">
            <div style={{padding:'24px',textAlign:'center',color:'var(--muted)',fontSize:'13px'}}>No issues detected</div>
          </div>
          <Link href="/health" className="text-btn">View link health →</Link>
        </article>
      </div>

      <div className="dashboard-grid lower">
        <article className="panel links-panel">
          <div className="panel-header"><div><h2>Top performing links</h2><p>Ranked by recency</p></div><Link href="/links" className="text-btn">View all links →</Link></div>
          <div className="mini-table" id="topLinksTable">
            {loading ? (
              <div style={{padding:'24px',textAlign:'center',color:'var(--muted)'}}>Loading…</div>
            ) : links.length === 0 ? (
              <div style={{padding:'24px',textAlign:'center',color:'var(--muted)'}}>No links yet. <Link href="/links" style={{color:'var(--primary)'}}>Create one →</Link></div>
            ) : links.slice(0, 4).map(l => (
              <div key={l.id} className="mini-row">
                <div className="link-cell"><span className="link-avatar">{initials(l.name)}</span><div><strong>{l.name}</strong><small>{l.domains?.hostname ?? '—'}/{l.slug}</small></div></div>
                <span>{l.offers?.name ?? '—'}</span>
                <span className={`status-pill ${l.status}`}>{l.status}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel sources-panel">
          <div className="panel-header"><div><h2>Traffic sources</h2><p>Where your best clicks come from</p></div><button className="icon-btn">⋯</button></div>
          <div className="source-list">
            <div style={{padding:'24px',textAlign:'center',color:'var(--muted)',fontSize:'13px'}}>No traffic data yet</div>
          </div>
        </article>
      </div>
    </section>
  );
}

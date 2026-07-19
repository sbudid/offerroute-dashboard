'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';

interface DomainItem {
  id: string;
  hostname: string;
  status: string;
  is_default: boolean;
  created_at: string;
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDomains = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/domains');
      if (!res.ok) throw new Error('Failed to fetch domains');
      const data = await res.json();
      setDomains(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load domains. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'verified': return { className: 'badge success', label: 'Verified' };
      case 'pending': return { className: 'badge warning', label: 'DNS pending' };
      case 'failed': return { className: 'badge danger', label: 'Failed' };
      default: return { className: 'badge', label: status };
    }
  };

  return (
    <section className="page active" id="page-domains">
      <div className="page-heading"><div><p className="eyebrow">BRANDED TRACKING</p><h1>Domains</h1><p>Use memorable links that match each brand you manage.</p></div><button className="btn primary">＋ Add domain</button></div>
      {loading ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontSize:18,marginBottom:8}}>Loading domains…</div>
        </div>
      ) : error ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--red)'}}>
          <div style={{fontSize:18,marginBottom:8}}>{error}</div>
          <button className="btn ghost" onClick={fetchDomains}>Retry</button>
        </div>
      ) : domains.length === 0 ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontSize:18,marginBottom:8}}>No domains configured</div>
          <small>Add a custom domain to brand your tracking links.</small>
        </div>
      ) : (
        <div className="domain-list">
          {domains.map(d => {
            const badge = statusBadge(d.status);
            return (
              <article key={d.id} className="panel domain-card">
                <span className="domain-icon">◎</span>
                <div>
                  <h3>{d.hostname}</h3>
                  <p>{d.is_default ? 'Primary tracking domain' : 'Additional domain'}</p>
                  <div><span className={badge.className}>{badge.label}</span></div>
                </div>
                <button className="icon-btn">⋯</button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

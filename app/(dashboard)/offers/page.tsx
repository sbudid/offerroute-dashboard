'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';

interface OfferItem {
  id: string;
  name: string;
  network: string;
  commission_label: string;
  status: string;
  canonical_url: string;
  created_at: string;
}

const initials = (name: string) => name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/offers');
      if (!res.ok) throw new Error('Failed to fetch offers');
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <section className="page active" id="page-offers">
      <div className="page-heading"><div><p className="eyebrow">OFFER VAULT</p><h1>Offers</h1><p>Keep destination URLs, networks, commissions, and fallback links organized.</p></div><button className="btn primary">＋ Add offer</button></div>
      {loading ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontSize:18,marginBottom:8}}>Loading offers…</div>
        </div>
      ) : error ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--red)'}}>
          <div style={{fontSize:18,marginBottom:8}}>{error}</div>
          <button className="btn ghost" onClick={fetchOffers}>Retry</button>
        </div>
      ) : offers.length === 0 ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontSize:18,marginBottom:8}}>No offers yet</div>
          <small>Add your first offer to start tracking commissions.</small>
        </div>
      ) : (
        <div className="offer-grid" id="offerGrid">
          {offers.map(o => {
            const badgeClass = o.status === 'active' ? 'success' : o.status === 'archived' ? 'danger' : 'warning';
            const displayStatus = o.status[0].toUpperCase() + o.status.slice(1);
            return (
              <article key={o.id} className="panel offer-card">
                <div className="offer-top">
                  <span className="offer-logo">{initials(o.name)}</span>
                  <div><h3>{o.name}</h3><p>{o.network || 'Direct'}</p></div>
                  <span className={`badge ${badgeClass}`}>{displayStatus}</span>
                </div>
                <div className="offer-meta">
                  <div><span>Commission</span><strong>{o.commission_label || '—'}</strong></div>
                  <div><span>Network</span><strong>{o.network || 'Direct'}</strong></div>
                </div>
                <div className="offer-footer"><span>Created {new Date(o.created_at).toLocaleDateString()}</span><button className="text-btn">View offer →</button></div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';

interface LinkItem {
  id: string;
  name: string;
  slug: string;
  domains?: { hostname: string } | null;
  offers?: { name: string } | null;
  status: string;
  created_at: string;
}

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);
const initials = (name: string) => name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

export default function LinksPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load links. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
    const handler = () => fetchLinks();
    window.addEventListener('links-updated' as string, handler as EventListener);
    return () => window.removeEventListener('links-updated' as string, handler as EventListener);
  }, [fetchLinks]);

  const filtered = links.filter(l => {
    const domain = l.domains?.hostname ?? '';
    const offer = l.offers?.name ?? '';
    const searchable = [l.name, l.slug, offer, domain].join(' ').toLowerCase();
    return searchable.includes(search.toLowerCase()) &&
      (statusFilter === 'all' || l.status === statusFilter);
  });

  const copyUrl = (l: LinkItem) => {
    const domain = l.domains?.hostname ?? 'example.com';
    navigator.clipboard?.writeText(`https://${domain}/${l.slug}`);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Tracking link copied' }));
  };

  return (
    <section className="page active" id="page-links">
      <div className="page-heading"><div><p className="eyebrow">SMART LINKS</p><h1>Links</h1><p>Create, route, and monitor every affiliate link.</p></div><button className="btn primary" onClick={() => window.dispatchEvent(new Event('open-create-modal'))}>＋ Create link</button></div>
      <div className="toolbar panel">
        <div className="search-box"><span>⌕</span><input id="linkSearch" placeholder="Search by name, slug, offer, or tag" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="warning">Warning</option>
          <option value="paused">Paused</option>
        </select>
        <select id="networkFilter" value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
          <option value="all">All networks</option>
          <option>ClickBank</option>
          <option>WarriorPlus</option>
          <option>JVZoo</option>
          <option>Direct</option>
        </select>
        <button className="btn ghost">Filters</button>
      </div>
      <div className="panel data-panel">
        {loading ? (
          <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
            <div style={{fontSize:18,marginBottom:8}}>Loading links…</div>
            <small>This may take a moment</small>
          </div>
        ) : error ? (
          <div style={{padding:'48px',textAlign:'center',color:'var(--red)'}}>
            <div style={{fontSize:18,marginBottom:8}}>{error}</div>
            <button className="btn ghost" onClick={fetchLinks}>Retry</button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead><tr><th>Link</th><th>Offer</th><th>Status</th><th>Created</th><th></th></tr></thead>
                <tbody id="linksTableBody">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>No links found. Create your first link to get started.</td></tr>
                  ) : filtered.map(l => (
                    <tr key={l.id}>
                      <td><div className="link-cell"><span className="link-avatar">{initials(l.name)}</span><div><strong>{l.name}</strong><small>{l.domains?.hostname ?? '—'}/{l.slug}</small></div></div></td>
                      <td><strong>{l.offers?.name ?? '—'}</strong></td>
                      <td><span className={`status-pill ${l.status}`}>{l.status[0].toUpperCase()+l.status.slice(1)}</span></td>
                      <td><small>{new Date(l.created_at).toLocaleDateString()}</small></td>
                      <td><button className="icon-btn kebab" onClick={() => copyUrl(l)}>⋯</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span id="linkResultCount">Showing {filtered.length} of {links.length} links</span><div><button className="icon-btn">‹</button><button className="icon-btn">›</button></div></div>
          </>
        )}
      </div>
    </section>
  );
}

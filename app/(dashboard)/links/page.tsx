'use client';

export const runtime = 'edge';

import { useState } from 'react';

interface LinkItem {
  id: number;
  name: string;
  slug: string;
  domain: string;
  offer: string;
  network: string;
  status: string;
  clicks: number;
  conv: number;
  revenue: number;
  health: string;
  redirects: number;
  checked: string;
  tags: string[];
}

const baseLinks: LinkItem[] = [
  {id:1,name:'Email Toolkit Promo',slug:'email-toolkit',domain:'go.incomecloser.com',offer:'Email Toolkit',network:'ClickBank',status:'active',clicks:8420,conv:231,revenue:3240,health:'Healthy',redirects:1,checked:'2 hours ago',tags:['email','evergreen']},
  {id:2,name:'Sleep Reset Guide',slug:'sleep',domain:'go.healthyzo.com',offer:'Sleep Reset',network:'ClickBank',status:'warning',clicks:6912,conv:164,revenue:2460,health:'5-hop redirect',redirects:5,checked:'2 hours ago',tags:['sleep','pinterest']},
  {id:3,name:'AI Funnel Builder',slug:'funnel-ai',domain:'go.incomecloser.com',offer:'AI Funnel Builder',network:'WarriorPlus',status:'active',clicks:5748,conv:119,revenue:1428,health:'Healthy',redirects:2,checked:'2 hours ago',tags:['ai','launch']},
  {id:4,name:'Wellness Starter Guide',slug:'wellness',domain:'go.healthyzo.com',offer:'Wellness Guide',network:'Direct',status:'active',clicks:4420,conv:91,revenue:792,health:'Healthy',redirects:1,checked:'2 hours ago',tags:['wellness']},
  {id:5,name:'Old Product Redirect',slug:'old-offer',domain:'go.incomecloser.com',offer:'Legacy Offer',network:'JVZoo',status:'warning',clicks:3291,conv:44,revenue:500,health:'404 Not Found',redirects:0,checked:'2 hours ago',tags:['archive']},
  {id:6,name:'Pinterest Lead Magnet',slug:'pin-kit',domain:'go.incomecloser.com',offer:'Pinterest Kit',network:'Direct',status:'paused',clicks:2449,conv:35,revenue:0,health:'Healthy',redirects:1,checked:'1 day ago',tags:['pinterest','leadgen']},
];

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);
const formatMoney = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const initials = (name: string) => name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

export default function LinksPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');

  const filtered = baseLinks.filter(l =>
    [l.name, l.slug, l.offer, l.network, ...l.tags].join(' ').toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || l.status === statusFilter) &&
    (networkFilter === 'all' || l.network === networkFilter)
  );

  const copyUrl = (l: LinkItem) => {
    navigator.clipboard?.writeText(`https://${l.domain}/${l.slug}`);
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
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Link</th><th>Offer</th><th>Status</th><th>Clicks</th><th>Conv.</th><th>Revenue</th><th></th></tr></thead>
            <tbody id="linksTableBody">
              {filtered.map(l => (
                <tr key={l.id}>
                  <td><div className="link-cell"><span className="link-avatar">{initials(l.name)}</span><div><strong>{l.name}</strong><small>{l.domain}/{l.slug}</small></div></div></td>
                  <td><strong>{l.offer}</strong><br/><small>{l.network}</small></td>
                  <td><span className={`status-pill ${l.status}`}>{l.status[0].toUpperCase()+l.status.slice(1)}</span></td>
                  <td>{formatNumber(l.clicks)}</td>
                  <td>{formatNumber(l.conv)}</td>
                  <td><strong>{formatMoney(l.revenue)}</strong></td>
                  <td><button className="icon-btn kebab" onClick={() => copyUrl(l)}>⋯</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span id="linkResultCount">Showing {filtered.length} of {baseLinks.length} links</span><div><button className="icon-btn">‹</button><button className="icon-btn">›</button></div></div>
      </div>
    </section>
  );
}

'use client';

export const runtime = 'edge';

const links = [
  {name:'Email Toolkit Promo',slug:'email-toolkit',domain:'go.incomecloser.com',health:'Healthy',redirects:1,checked:'2 hours ago'},
  {name:'Sleep Reset Guide',slug:'sleep',domain:'go.healthyzo.com',health:'5-hop redirect',redirects:5,checked:'2 hours ago'},
  {name:'AI Funnel Builder',slug:'funnel-ai',domain:'go.incomecloser.com',health:'Healthy',redirects:2,checked:'2 hours ago'},
  {name:'Wellness Starter Guide',slug:'wellness',domain:'go.healthyzo.com',health:'Healthy',redirects:1,checked:'2 hours ago'},
  {name:'Old Product Redirect',slug:'old-offer',domain:'go.incomecloser.com',health:'404 Not Found',redirects:0,checked:'2 hours ago'},
  {name:'Pinterest Lead Magnet',slug:'pin-kit',domain:'go.incomecloser.com',health:'Healthy',redirects:1,checked:'1 day ago'},
];

const initials = (name: string) => name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

export default function HealthPage() {
  return (
    <section className="page active" id="page-health">
      <div className="page-heading"><div><p className="eyebrow">AUTOMATED MONITORING</p><h1>Link Health</h1><p>Catch broken offers and expensive redirect chains before visitors do.</p></div><button className="btn ghost">↻ Run checks now</button></div>
      <div className="health-summary">
        <article className="health-card good"><span>✓</span><div><strong>4</strong><small>Healthy</small></div></article>
        <article className="health-card warning"><span>!</span><div><strong>1</strong><small>Warnings</small></div></article>
        <article className="health-card bad"><span>×</span><div><strong>1</strong><small>Broken</small></div></article>
        <article className="health-card neutral"><span>◷</span><div><strong>2h</strong><small>Last scan</small></div></article>
      </div>
      <div className="panel data-panel">
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Link</th><th>Destination status</th><th>Redirects</th><th>Last checked</th><th>Recommended action</th></tr></thead>
            <tbody id="healthTableBody">
              {links.map(l => {
                const badge = l.health === 'Healthy' ? 'success' : l.health.includes('404') ? 'danger' : 'warning';
                const action = l.health === 'Healthy' ? 'No action needed' : l.health.includes('404') ? 'Switch to fallback destination' : 'Shorten the redirect chain';
                return (
                  <tr key={l.slug}>
                    <td><div className="link-cell"><span className="link-avatar">{initials(l.name)}</span><div><strong>{l.name}</strong><small>{l.domain}/{l.slug}</small></div></div></td>
                    <td><span className={`badge ${badge}`}>{l.health}</span></td>
                    <td>{l.redirects} hop{l.redirects===1?'':'s'}</td>
                    <td>{l.checked}</td>
                    <td className="action-note">{action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

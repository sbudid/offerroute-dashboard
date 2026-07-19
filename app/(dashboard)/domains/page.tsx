'use client';

export const runtime = 'edge';

export default function DomainsPage() {
  return (
    <section className="page active" id="page-domains">
      <div className="page-heading"><div><p className="eyebrow">BRANDED TRACKING</p><h1>Domains</h1><p>Use memorable links that match each brand you manage.</p></div><button className="btn primary">＋ Add domain</button></div>
      <div className="domain-list">
        <article className="panel domain-card">
          <span className="domain-icon">◎</span>
          <div>
            <h3>go.incomecloser.com</h3>
            <p>Primary tracking domain</p>
            <div><span className="badge success">Verified</span><span>4 active links</span></div>
          </div>
          <button className="icon-btn">⋯</button>
        </article>
        <article className="panel domain-card">
          <span className="domain-icon">◎</span>
          <div>
            <h3>go.healthyzo.com</h3>
            <p>Wellness affiliate links</p>
            <div><span className="badge warning">DNS pending</span><span>2 links waiting</span></div>
          </div>
          <button className="btn ghost">View setup</button>
        </article>
      </div>
    </section>
  );
}

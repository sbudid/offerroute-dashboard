'use client';

export const runtime = 'edge';

export default function IntegrationsPage() {
  return (
    <section className="page active" id="page-integrations">
      <div className="page-heading"><div><p className="eyebrow">CONNECTED WORKFLOWS</p><h1>Integrations</h1><p>Connect your scanners, payment platforms, and automation tools.</p></div></div>
      <div className="integration-grid">
        <article className="panel integration-card">
          <div className="integration-logo">LR</div>
          <div><h3>LinkRadar</h3><p>Import discovered affiliate links and monitor destination health.</p></div>
          <button className="btn primary">Connect</button>
        </article>
        <article className="panel integration-card">
          <div className="integration-logo">CB</div>
          <div><h3>ClickBank</h3><p>Match conversions and revenue to your tracking links.</p></div>
          <button className="btn ghost">Coming next</button>
        </article>
        <article className="panel integration-card">
          <div className="integration-logo">WP</div>
          <div><h3>WarriorPlus</h3><p>Receive sale notifications using webhook/postback tracking.</p></div>
          <button className="btn ghost">Coming next</button>
        </article>
        <article className="panel integration-card">
          <div className="integration-logo">API</div>
          <div><h3>Developer API</h3><p>Create links and fetch analytics from other apps.</p></div>
          <button className="btn ghost">View docs</button>
        </article>
      </div>
    </section>
  );
}

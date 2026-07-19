'use client';

export const runtime = 'edge';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <section className="page active" id="page-overview">
      <div className="page-heading">
        <div><p className="eyebrow">SATURDAY, JULY 11</p><h1>Good evening, Budi</h1><p>Here&apos;s how your affiliate links are performing.</p></div>
        <div className="date-filter"><button className="btn ghost">Last 30 days⌄</button></div>
      </div>

      <div className="metrics-grid">
        <article className="metric-card"><div className="metric-label"><span>Total clicks</span><span className="metric-icon">↗</span></div><div className="metric-value">31,240</div><div className="metric-change positive">↑ 18.2% <span>vs last period</span></div></article>
        <article className="metric-card"><div className="metric-label"><span>Unique visitors</span><span className="metric-icon">♙</span></div><div className="metric-value">24,891</div><div className="metric-change positive">↑ 12.5% <span>vs last period</span></div></article>
        <article className="metric-card"><div className="metric-label"><span>Conversions</span><span className="metric-icon">✓</span></div><div className="metric-value">684</div><div className="metric-change positive">↑ 8.4% <span>vs last period</span></div></article>
        <article className="metric-card"><div className="metric-label"><span>Revenue</span><span className="metric-icon">$</span></div><div className="metric-value">$8,420</div><div className="metric-change positive">↑ 21.7% <span>vs last period</span></div></article>
      </div>

      <div className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-header"><div><h2>Performance</h2><p>Clicks and conversions over time</p></div><div className="legend"><span><i className="clicks"></i>Clicks</span><span><i className="conversions"></i>Conversions</span></div></div>
          <div className="chart-wrap">
            <div className="chart-y"><span>1.5k</span><span>1.0k</span><span>500</span><span>0</span></div>
            <svg className="line-chart" viewBox="0 0 800 250" preserveAspectRatio="none" aria-label="Clicks and conversions chart">
              <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6857ff" stopOpacity=".28"/><stop offset="1" stopColor="#6857ff" stopOpacity="0"/></linearGradient></defs>
              <g className="grid-lines"><line x1="0" y1="20" x2="800" y2="20"/><line x1="0" y1="90" x2="800" y2="90"/><line x1="0" y1="160" x2="800" y2="160"/><line x1="0" y1="230" x2="800" y2="230"/></g>
              <path className="area" d="M0 190 C50 175 65 140 110 150 S180 205 230 130 S300 120 350 105 S420 145 470 110 S540 65 590 85 S670 155 720 70 S770 55 800 35 L800 230 L0 230 Z"/>
              <path className="line primary-line" d="M0 190 C50 175 65 140 110 150 S180 205 230 130 S300 120 350 105 S420 145 470 110 S540 65 590 85 S670 155 720 70 S770 55 800 35"/>
              <path className="line secondary-line" d="M0 218 C90 210 140 220 205 205 S300 215 390 190 S480 203 555 178 S650 190 720 158 S775 170 800 150"/>
            </svg>
            <div className="chart-x"><span>Jun 12</span><span>Jun 17</span><span>Jun 22</span><span>Jun 27</span><span>Jul 2</span><span>Jul 7</span><span>Jul 11</span></div>
          </div>
        </article>

        <article className="panel attention-panel">
          <div className="panel-header"><div><h2>Needs attention</h2><p>Issues that may cost you clicks</p></div><span className="badge danger">3 issues</span></div>
          <div className="issue-list">
            <Link href="/health" className="issue"><span className="issue-icon danger">!</span><div><strong>2 broken destinations</strong><small>Offers return 404 or 5xx</small></div><span>›</span></Link>
            <Link href="/health" className="issue"><span className="issue-icon warning">↻</span><div><strong>Long redirect chain</strong><small>5 hops on /go/sleep</small></div><span>›</span></Link>
            <Link href="/health" className="issue"><span className="issue-icon info">i</span><div><strong>Domain verification</strong><small>go.healthyzo.com is pending</small></div><span>›</span></Link>
          </div>
          <Link href="/health" className="text-btn">View link health →</Link>
        </article>
      </div>

      <div className="dashboard-grid lower">
        <article className="panel links-panel">
          <div className="panel-header"><div><h2>Top performing links</h2><p>Ranked by conversions</p></div><Link href="/links" className="text-btn">View all links →</Link></div>
          <div className="mini-table" id="topLinksTable">
            <div className="mini-row"><div className="link-cell"><span className="link-avatar">ET</span><div><strong>Email Toolkit Promo</strong><small>go.incomecloser.com/email-toolkit</small></div></div><span>ClickBank</span><strong>231 conv.</strong><strong>$3,240</strong></div>
            <div className="mini-row"><div className="link-cell"><span className="link-avatar">SR</span><div><strong>Sleep Reset Guide</strong><small>go.healthyzo.com/sleep</small></div></div><span>ClickBank</span><strong>164 conv.</strong><strong>$2,460</strong></div>
            <div className="mini-row"><div className="link-cell"><span className="link-avatar">AF</span><div><strong>AI Funnel Builder</strong><small>go.incomecloser.com/funnel-ai</small></div></div><span>WarriorPlus</span><strong>119 conv.</strong><strong>$1,428</strong></div>
            <div className="mini-row"><div className="link-cell"><span className="link-avatar">WS</span><div><strong>Wellness Starter Guide</strong><small>go.healthyzo.com/wellness</small></div></div><span>Direct</span><strong>91 conv.</strong><strong>$792</strong></div>
          </div>
        </article>
        <article className="panel sources-panel">
          <div className="panel-header"><div><h2>Traffic sources</h2><p>Where your best clicks come from</p></div><button className="icon-btn">⋯</button></div>
          <div className="source-list">
            <div className="source-row"><span className="source-icon">G</span><div><strong>Google</strong><span>Organic search</span></div><b>10,482</b><em>33.6%</em></div>
            <div className="source-row"><span className="source-icon">P</span><div><strong>Pinterest</strong><span>Social</span></div><b>8,931</b><em>28.6%</em></div>
            <div className="source-row"><span className="source-icon">✉</span><div><strong>Email</strong><span>Newsletter</span></div><b>6,804</b><em>21.8%</em></div>
            <div className="source-row"><span className="source-icon">D</span><div><strong>Direct</strong><span>No referrer</span></div><b>5,023</b><em>16.0%</em></div>
          </div>
        </article>
      </div>
    </section>
  );
}

'use client';

export const runtime = 'edge';

export default function AnalyticsPage() {
  return (
    <section className="page active" id="page-analytics">
      <div className="page-heading"><div><p className="eyebrow">ATTRIBUTION</p><h1>Analytics</h1><p>See which traffic sources, devices, and countries actually convert.</p></div><button className="btn ghost">Export CSV</button></div>
      <div className="analytics-hero panel">
        <div><span>Revenue tracked</span><strong>$8,420.00</strong><small>From 684 conversions in the last 30 days</small></div>
        <div className="funnel">
          <div><b>31,240</b><span>Clicks</span></div>
          <i>→</i>
          <div><b>24,891</b><span>Unique</span></div>
          <i>→</i>
          <div><b>684</b><span>Conversions</span></div>
          <i>→</i>
          <div><b>2.75%</b><span>CVR</span></div>
        </div>
      </div>
      <div className="three-grid">
        <article className="panel">
          <div className="panel-header"><div><h2>Countries</h2><p>Clicks by location</p></div></div>
          <div className="bar-list">
            <div><span>United States</span><i><b style={{width:'83%'}}></b></i><strong>38%</strong></div>
            <div><span>Indonesia</span><i><b style={{width:'60%'}}></b></i><strong>27%</strong></div>
            <div><span>United Kingdom</span><i><b style={{width:'34%'}}></b></i><strong>15%</strong></div>
            <div><span>Canada</span><i><b style={{width:'25%'}}></b></i><strong>11%</strong></div>
            <div><span>Other</span><i><b style={{width:'20%'}}></b></i><strong>9%</strong></div>
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><div><h2>Devices</h2><p>Visitor device mix</p></div></div>
          <div className="donut-wrap">
            <div className="donut"><span>31.2k<small>clicks</small></span></div>
            <div className="donut-legend"><span><i></i>Mobile <b>68%</b></span><span><i></i>Desktop <b>27%</b></span><span><i></i>Tablet <b>5%</b></span></div>
          </div>
        </article>
        <article className="panel">
          <div className="panel-header"><div><h2>Best EPC</h2><p>Top links by earnings per click</p></div></div>
          <div className="ranking">
            <div><b>1</b><span>Email Toolkit</span><strong>$0.62</strong></div>
            <div><b>2</b><span>Sleep Reset</span><strong>$0.51</strong></div>
            <div><b>3</b><span>AI Funnel Builder</span><strong>$0.43</strong></div>
            <div><b>4</b><span>Wellness Guide</span><strong>$0.31</strong></div>
          </div>
        </article>
      </div>
    </section>
  );
}

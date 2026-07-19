'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';

interface AnalyticsData {
  clicks: number;
  unique: number;
  conversions: number;
  revenue: number;
  countries: Record<string, number>;
  devices: Record<string, number>;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', ID: 'Indonesia', GB: 'United Kingdom', CA: 'Canada',
  AU: 'Australia', DE: 'Germany', FR: 'France', BR: 'Brazil', IN: 'India', Unknown: 'Unknown',
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Could not load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const totalClicks = data?.clicks ?? 0;
  const totalUnique = data?.unique ?? 0;
  const totalConversions = data?.conversions ?? 0;
  const totalRevenue = data?.revenue ?? 0;
  const cvr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00';

  const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
  const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

  // Process countries
  const countries = data?.countries ?? {};
  const totalCountryClicks = Object.values(countries).reduce((a, b) => a + b, 0) || 1;
  const countryEntries = Object.entries(countries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Process devices
  const devices = data?.devices ?? {};
  const totalDeviceClicks = Object.values(devices).reduce((a, b) => a + b, 0) || 1;
  const mobilePct = Math.round(((devices.mobile ?? 0) / totalDeviceClicks) * 100);
  const desktopPct = Math.round(((devices.desktop ?? 0) / totalDeviceClicks) * 100);
  const tabletPct = Math.round(((devices.tablet ?? 0) / totalDeviceClicks) * 100);

  return (
    <section className="page active" id="page-analytics">
      <div className="page-heading"><div><p className="eyebrow">ATTRIBUTION</p><h1>Analytics</h1><p>See which traffic sources, devices, and countries actually convert.</p></div><button className="btn ghost">Export CSV</button></div>
      {loading ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontSize:18,marginBottom:8}}>Loading analytics…</div>
        </div>
      ) : error ? (
        <div style={{padding:'48px',textAlign:'center',color:'var(--red)'}}>
          <div style={{fontSize:18,marginBottom:8}}>{error}</div>
          <button className="btn ghost" onClick={fetchAnalytics}>Retry</button>
        </div>
      ) : (
        <>
          <div className="analytics-hero panel">
            <div><span>Revenue tracked</span><strong>{formatMoney(totalRevenue)}</strong><small>From {formatNumber(totalConversions)} conversions</small></div>
            <div className="funnel">
              <div><b>{formatNumber(totalClicks)}</b><span>Clicks</span></div>
              <i>→</i>
              <div><b>{formatNumber(totalUnique)}</b><span>Unique</span></div>
              <i>→</i>
              <div><b>{formatNumber(totalConversions)}</b><span>Conversions</span></div>
              <i>→</i>
              <div><b>{cvr}%</b><span>CVR</span></div>
            </div>
          </div>
          <div className="three-grid">
            <article className="panel">
              <div className="panel-header"><div><h2>Countries</h2><p>Clicks by location</p></div></div>
              <div className="bar-list">
                {countryEntries.length === 0 ? (
                  <div style={{padding:'24px',textAlign:'center',color:'var(--muted)',fontSize:'13px'}}>No country data yet</div>
                ) : countryEntries.map(([code, count]) => {
                  const pct = Math.round((count / totalCountryClicks) * 100);
                  return (
                    <div key={code}><span>{COUNTRY_NAMES[code] ?? code}</span><i><b style={{width:`${pct}%`}}></b></i><strong>{pct}%</strong></div>
                  );
                })}
              </div>
            </article>
            <article className="panel">
              <div className="panel-header"><div><h2>Devices</h2><p>Visitor device mix</p></div></div>
              <div className="donut-wrap">
                <div className="donut"><span>{formatNumber(totalClicks)}<small>clicks</small></span></div>
                <div className="donut-legend"><span><i></i>Mobile <b>{mobilePct}%</b></span><span><i></i>Desktop <b>{desktopPct}%</b></span><span><i></i>Tablet <b>{tabletPct}%</b></span></div>
              </div>
            </article>
            <article className="panel">
              <div className="panel-header"><div><h2>Best EPC</h2><p>Top links by earnings per click</p></div></div>
              <div className="ranking">
                {totalClicks === 0 ? (
                  <div style={{padding:'24px',textAlign:'center',color:'var(--muted)',fontSize:'13px'}}>No EPC data yet</div>
                ) : (
                  <>
                    <div><b>1</b><span>—</span><strong>—</strong></div>
                  </>
                )}
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
}

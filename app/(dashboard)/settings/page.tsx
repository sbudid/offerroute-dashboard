'use client';

export const runtime = 'edge';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <section className="page active" id="page-settings">
      <div className="page-heading"><div><p className="eyebrow">WORKSPACE</p><h1>Settings</h1><p>Manage defaults, tracking behavior, and workspace preferences.</p></div></div>
      <div className="settings-layout">
        <div className="settings-nav panel">
          {['General', 'Tracking', 'Team', 'Billing'].map(tab => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>
        <div className="panel settings-card">
          <h2>General settings</h2>
          <label>Workspace name<input defaultValue="Budi&apos;s Workspace" /></label>
          <label>Default tracking domain<select><option>go.incomecloser.com</option><option>go.healthyzo.com</option></select></label>
          <label>Default redirect type<select><option>302 — Temporary</option><option>307 — Temporary, preserve method</option><option>301 — Permanent</option></select></label>
          <div className="toggle-row">
            <div><strong>Preserve query parameters</strong><span>Forward UTM tags and tracking IDs to destination URLs.</span></div>
            <button className="toggle on"><i></i></button>
          </div>
          <div className="toggle-row">
            <div><strong>Bot filtering</strong><span>Exclude known bots from visitor analytics.</span></div>
            <button className="toggle on"><i></i></button>
          </div>
          <button className="btn primary">Save changes</button>
        </div>
      </div>
    </section>
  );
}

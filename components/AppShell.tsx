'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const pageLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/links': 'Links',
  '/offers': 'Offers',
  '/health': 'Link Health',
  '/analytics': 'Analytics',
  '/domains': 'Domains',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
};

const pages = [
  { path: '/dashboard', label: 'Overview', icon: '⌂' },
  { path: '/links', label: 'Links', icon: '↗', count: 6 },
  { path: '/offers', label: 'Offers', icon: '◇' },
  { path: '/health', label: 'Link Health', icon: '♡', hasDot: true },
  { path: '/analytics', label: 'Analytics', icon: '⌁' },
  { path: '/domains', label: 'Domains', icon: '◎' },
  { path: '/integrations', label: 'Integrations', icon: '⊞' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const pageTitle = pageLabels[pathname] || 'Overview';

  // Toast system
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 2200);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  // Listen for toast events from child components
  useEffect(() => {
    const handler = (e: CustomEvent) => showToast(e.detail);
    window.addEventListener('show-toast' as string, handler as EventListener);
    return () => window.removeEventListener('show-toast' as string, handler as EventListener);
  }, [showToast]);

  // Listen for open-create-modal events from child components
  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener('open-create-modal', handler);
    return () => window.removeEventListener('open-create-modal', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
        setPaletteQuery('');
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false);
        setModalOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const navigate = (path: string) => {
    router.push(path);
  };

  // Command palette results
  const commandResults = (() => {
    const q = paletteQuery.toLowerCase();
    const pageResults = pages
      .filter(p => p.label.toLowerCase().includes(q))
      .map(p => ({ type: 'page' as const, label: p.label, sub: 'Open page', path: p.path }));
    // static links for command palette
    const staticLinks = [
      { name: 'Email Toolkit Promo', domain: 'go.incomecloser.com', slug: 'email-toolkit' },
      { name: 'Sleep Reset Guide', domain: 'go.healthyzo.com', slug: 'sleep' },
      { name: 'AI Funnel Builder', domain: 'go.incomecloser.com', slug: 'funnel-ai' },
      { name: 'Wellness Starter Guide', domain: 'go.healthyzo.com', slug: 'wellness' },
      { name: 'Old Product Redirect', domain: 'go.incomecloser.com', slug: 'old-offer' },
      { name: 'Pinterest Lead Magnet', domain: 'go.incomecloser.com', slug: 'pin-kit' },
    ];
    const linkResults = staticLinks
      .filter(l => [l.name, l.slug, l.domain].join(' ').toLowerCase().includes(q))
      .slice(0, 6)
      .map(l => ({ type: 'link' as const, label: l.name, sub: `${l.domain}/${l.slug}`, path: '/links' }));
    return [...pageResults, ...linkResults].slice(0, 9);
  })();

  const handleCreateLink = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalOpen(false);
    showToast('Smart link created');
    navigate('/links');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none"><path d="M8 8h8a6 6 0 0 1 0 12h-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M24 24h-8a6 6 0 0 1 0-12h3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <div><strong>OfferRoute</strong><span>Affiliate link OS</span></div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {pages.slice(0, 6).map(p => (
            <button
              key={p.path}
              className={`nav-item${pathname === p.path ? ' active' : ''}`}
              onClick={() => navigate(p.path)}
            >
              <span className="nav-icon">{p.icon}</span>
              <span>{p.label}</span>
              {p.count !== undefined && <span className="nav-count" id="navLinkCount">{p.count}</span>}
              {p.hasDot && <span className="status-dot warning"></span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider"></div>
        <nav className="nav secondary" aria-label="Secondary navigation">
          {pages.slice(6).map(p => (
            <button
              key={p.path}
              className={`nav-item${pathname === p.path ? ' active' : ''}`}
              onClick={() => navigate(p.path)}
            >
              <span className="nav-icon">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </nav>

        <div className="workspace-card">
          <div className="workspace-row"><span className="avatar">BD</span><div><strong>Budi&apos;s Workspace</strong><span>Pro plan</span></div><button className="icon-btn">⋯</button></div>
          <div className="usage"><div><span>Monthly clicks</span><strong>62%</strong></div><div className="progress"><i style={{width:'62%'}}></i></div><small>31,240 of 50,000</small></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" id="mobileMenu" aria-label="Toggle menu" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong id="pageTitle">{pageTitle}</strong></div>
          <div className="top-actions">
            <button className="search-trigger" id="searchTrigger" onClick={() => { setPaletteOpen(true); setPaletteQuery(''); }}>
              <span>⌕</span><span>Search links…</span><kbd>⌘ K</kbd>
            </button>
            <button className="icon-btn notification" aria-label="Notifications">♢<i></i></button>
            <button className="btn primary" id="createLinkBtn" onClick={() => setModalOpen(true)}>
              <span>＋</span> Create link
            </button>
          </div>
        </header>

        {children}
      </main>

      {/* Create Link Modal */}
      <div className="modal-backdrop" id="modalBackdrop" hidden={!modalOpen} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div className="modal-header"><div><p className="eyebrow">NEW SMART LINK</p><h2 id="modalTitle">Create a link</h2></div><button className="icon-btn" id="closeModal" onClick={() => setModalOpen(false)}>×</button></div>
          <form id="createLinkForm" onSubmit={handleCreateLink}>
            <div className="form-grid">
              <label className="full">Link name<input required name="name" placeholder="e.g. Email Toolkit Promo" /></label>
              <label className="full">Destination URL<input required type="url" name="destination" placeholder="https://vendor.com/product?affiliate=you" /></label>
              <label>Domain<select name="domain"><option>go.incomecloser.com</option><option>go.healthyzo.com</option></select></label>
              <label>Custom slug<div className="slug-input"><span>/</span><input required name="slug" pattern="[a-zA-Z0-9-_]+" placeholder="email-toolkit" /></div></label>
              <label>Network<select name="network"><option>ClickBank</option><option>WarriorPlus</option><option>JVZoo</option><option>Direct</option></select></label>
              <label>Offer<select name="offer"><option>Email Toolkit</option><option>Sleep Reset</option><option>AI Funnel Builder</option><option>Wellness Guide</option></select></label>
              <label className="full">Tags<input name="tags" placeholder="email, newsletter, evergreen" /></label>
            </div>
            <details className="advanced"><summary>Advanced routing options <span>＋</span></summary><div className="advanced-grid"><label>Fallback URL<input type="url" name="fallback" placeholder="https://your-site.com/recommended" /></label><label>Traffic split<select name="split"><option>100% primary destination</option><option>50 / 50 A/B test</option><option>Custom weighted split</option></select></label><label>Country rule<select name="country"><option>No country rule</option><option>United States</option><option>Indonesia</option><option>United Kingdom</option></select></label><label>Device rule<select name="device"><option>All devices</option><option>Mobile only</option><option>Desktop only</option></select></label></div></details>
            <div className="modal-footer"><button type="button" className="btn ghost" id="cancelModal" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn primary">Create smart link</button></div>
          </form>
        </div>
      </div>

      {/* Command Palette */}
      <div className="command-palette" id="commandPalette" hidden={!paletteOpen} onClick={(e) => { if (e.target === e.currentTarget) setPaletteOpen(false); }}>
        <div className="command-box">
          <div className="command-search"><span>⌕</span><input id="commandInput" placeholder="Search links and pages…" value={paletteQuery} onChange={(e) => setPaletteQuery(e.target.value)} autoFocus={paletteOpen} /><kbd>ESC</kbd></div>
          <div className="command-results" id="commandResults">
            {commandResults.length === 0 ? (
              <div style={{padding:'22px',textAlign:'center',color:'#8b8e9d',fontSize:'11px'}}>No matches found</div>
            ) : commandResults.map((r, i) => (
              <button key={i} className="command-result" onClick={() => { navigate(r.path); setPaletteOpen(false); }}>
                <span>{r.type === 'page' ? '⌁' : '↗'}</span>
                <div><strong>{r.label}</strong><small>{r.sub}</small></div>
                <span>↵</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${toastVisible ? ' show' : ''}`} id="toast" role="status">{toastMessage}</div>
    </div>
  );
}

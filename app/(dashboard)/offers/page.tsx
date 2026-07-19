'use client';

export const runtime = 'edge';

const offers = [
  {name:'Email Toolkit',network:'ClickBank',commission:'$14.00',epc:'$0.62',links:1,status:'Active'},
  {name:'Sleep Reset',network:'ClickBank',commission:'$18.00',epc:'$0.51',links:1,status:'Active'},
  {name:'AI Funnel Builder',network:'WarriorPlus',commission:'$12.00',epc:'$0.43',links:1,status:'Active'},
  {name:'Wellness Guide',network:'Direct',commission:'$9.00',epc:'$0.31',links:1,status:'Active'},
  {name:'Legacy Offer',network:'JVZoo',commission:'$10.00',epc:'$0.15',links:1,status:'Broken'},
  {name:'Pinterest Kit',network:'Direct',commission:'Lead magnet',epc:'—',links:1,status:'Paused'},
];

const initials = (name: string) => name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase();

export default function OffersPage() {
  return (
    <section className="page active" id="page-offers">
      <div className="page-heading"><div><p className="eyebrow">OFFER VAULT</p><h1>Offers</h1><p>Keep destination URLs, networks, commissions, and fallback links organized.</p></div><button className="btn primary">＋ Add offer</button></div>
      <div className="offer-grid" id="offerGrid">
        {offers.map(o => (
          <article key={o.name} className="panel offer-card">
            <div className="offer-top">
              <span className="offer-logo">{initials(o.name)}</span>
              <div><h3>{o.name}</h3><p>{o.network}</p></div>
              <span className={`badge ${o.status==='Active'?'success':o.status==='Broken'?'danger':'warning'}`}>{o.status}</span>
            </div>
            <div className="offer-meta">
              <div><span>Commission</span><strong>{o.commission}</strong></div>
              <div><span>EPC</span><strong>{o.epc}</strong></div>
              <div><span>Smart links</span><strong>{o.links}</strong></div>
            </div>
            <div className="offer-footer"><span>Destination checked 2h ago</span><button className="text-btn">View offer →</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

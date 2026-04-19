import React from 'react';

const path = window.location.pathname;

const TABS = [
  {
    key: 'home', label: 'Accueil', href: '/', active: path === '/',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    key: 'live', label: 'En Direct', href: '/live', active: path === '/live', live: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  },
  {
    key: 'create', label: 'Créer', href: '/create', active: path === '/create',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  },
  {
    key: 'account', label: 'Compte', href: '/account', active: path === '/account',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
];

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 56,
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(tab => (
        <a
          key={tab.key}
          href={tab.href}
          style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 3,
            color: tab.active ? '#fff' : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: 10, fontWeight: 500,
            letterSpacing: 0.3,
            position: 'relative',
            transition: 'color 0.15s',
          }}
        >
          <span style={{ position: 'relative', display: 'flex', opacity: tab.active ? 1 : 0.5 }}>
            {tab.icon}
            {tab.live && (
              <span style={{
                position: 'absolute', top: -1, right: -5,
                width: 5, height: 5, borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 4px #22c55e',
              }} />
            )}
          </span>
          {tab.label}
        </a>
      ))}
    </nav>
  );
}

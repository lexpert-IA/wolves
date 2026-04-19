import React from 'react';

const path = window.location.pathname;

const TABS = [
  { key: 'home', label: 'Accueil', href: '/', icon: '🏠', active: path === '/' },
  { key: 'live', label: 'En Direct', href: '/live', icon: '🎮', active: path === '/live', live: true },
  { key: 'copy', label: 'Copy', href: '/copy', icon: '⚡', active: path === '/copy' },
  { key: 'account', label: 'Compte', href: '/account', icon: '👤', active: path === '/account' },
];

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 60,
      background: 'rgba(13,17,23,0.95)',
      backdropFilter: 'blur(12px)',
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
            gap: 2,
            color: tab.active ? 'var(--accent)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: 10, fontWeight: 600,
            letterSpacing: 0.5,
            position: 'relative',
            transition: 'color 0.15s',
          }}
        >
          <span style={{ fontSize: 20, position: 'relative' }}>
            {tab.icon}
            {tab.live && (
              <span style={{
                position: 'absolute', top: -2, right: -6,
                width: 6, height: 6, borderRadius: '50%',
                background: '#EF4444',
                animation: 'pulse-live 2s ease-in-out infinite',
              }} />
            )}
          </span>
          {tab.label}
        </a>
      ))}
    </nav>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/useIsMobile';
import SearchModal from './SearchModal';
import WalletButton from './WalletButton';

const NAV_LINKS = [
  { label: 'Accueil', path: '/', icon: '🏠' },
  { label: 'En Direct', path: '/live', icon: '🔴', live: true },
  { label: 'Copy Trading', path: '/copy', icon: '⚡' },
  { label: 'Classement', path: '/leaderboard', icon: '🏆' },
];

export default function Topbar({ walletDisabled = false }) {
  const { user, logout, openAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const currentPath = window.location.pathname;
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--topbar-height)',
        background: 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
      }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 3,
            background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>WOLVES</span>
        </a>

        {/* Nav Links — desktop only */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
            {NAV_LINKS.map(link => {
              const active = link.path === '/' ? currentPath === '/' : currentPath.startsWith(link.path);
              return (
                <a
                  key={link.path}
                  href={link.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 13, fontWeight: 500,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 14 }}>{link.icon}</span>
                  {link.label}
                  {link.live && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#EF4444',
                      animation: 'pulse-live 2s ease-in-out infinite',
                    }} />
                  )}
                </a>
              );
            })}
          </nav>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search button */}
        {!isMobile && (
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-muted)',
              fontSize: 13, cursor: 'pointer',
              transition: 'border-color 0.15s',
              minWidth: 180,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Rechercher...
            <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.5 }}>⌘K</span>
          </button>
        )}

        {/* Wallet + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!walletDisabled && <WalletButton />}
          {user ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                {user.googlePhotoUrl ? (
                  <img src={user.googlePhotoUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>{(user.username || user.pseudo || '?')[0].toUpperCase()}</span>
                )}
                {!isMobile && <span>{user.username || user.pseudo}</span>}
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 4,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 4, minWidth: 180,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  animation: 'fadeIn 0.15s ease',
                  zIndex: 200,
                }}>
                  {[
                    { label: 'Mon compte', href: '/account' },
                    { label: 'Mes positions', href: '/positions' },
                    { label: 'Mon profil', href: `/profile/${user.userId || user.pseudo}` },
                  ].map(item => (
                    <a key={item.href} href={item.href} style={{
                      display: 'block', padding: '10px 14px', fontSize: 13,
                      color: 'var(--text-secondary)', textDecoration: 'none',
                      borderRadius: 'var(--radius-sm)', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{item.label}</a>
                  ))}
                  <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                  <button onClick={() => { logout(); setMenuOpen(false); window.location.href = '/'; }} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 14px', fontSize: 13,
                    color: 'var(--red)', background: 'transparent',
                    border: 'none', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >Deconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={openAuth} className="wolves-btn wolves-btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
              Connexion
            </button>
          )}
        </div>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

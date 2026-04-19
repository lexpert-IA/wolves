# WOLVES Frontend Refonte — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre entierement le frontend React BETLY en WOLVES — plateforme de Loup-Garou IA avec paris en direct, en clonant les composants/styles de Stake.com et Polymarket.

**Architecture:** App React SPA existante, on remplace les pages/composants un par un. Topbar et sidebar Stake-style, pages de jeu Polymarket-style, toutes les pages existantes gardees mais refondues visuellement. Le backend Express/MongoDB/Socket.io reste inchange.

**Tech Stack:** React 18, Vite 5, Tailwind 4, Socket.io client, Firebase Auth, Dynamic wallet

**Design tokens extraits:**
- Polymarket : bg `#15191d`, bouton primaire `#0093fd`, border-radius `7.2px`, font Inter, boutons OUI/NON verts/rouges
- Stake : sidebar bg `#13232d`, body bg `#1a2e39`, sidebar 260px, border-radius `8px`, font Proxima Nova (on garde Inter)
- WOLVES : on fusionne — bg `#0d1117` (plus sombre), accent `#7C3AED` (violet) + `#06B6D4` (cyan), sidebar style Stake, marches style Polymarket

---

## File Structure

### New files
- `web/src/pages/HomePage.jsx` — Landing page Stake-style
- `web/src/pages/LiveGamePage.jsx` — Page jeu en direct (wrapper)
- `web/src/components/game/GameTable.jsx` — Table de jeu avec cercle de joueurs
- `web/src/components/game/LiveChat.jsx` — Chat en direct
- `web/src/components/game/BettingPanel.jsx` — Panel de paris droite
- `web/src/components/game/BetModal.jsx` — Modal de pari
- `web/src/components/game/VerifyModal.jsx` — Modal transparence LLM
- `web/src/components/game/PhaseBanner.jsx` — Banner JOUR/VOTE/NUIT
- `web/src/components/game/WinnerOverlay.jsx` — Overlay victoire
- `web/src/components/game/useGameSocket.js` — Hook Socket.io pour le jeu
- `web/src/components/Sidebar.jsx` — Sidebar Stake-style (desktop)

### Modified files
- `web/src/App.jsx` — Routing refonte, supprimer pages mortes, ajouter nouvelles
- `web/src/index.css` — Design tokens WOLVES, refonte couleurs globales
- `web/src/components/Topbar.jsx` — Rebrand WOLVES, style Polymarket topbar
- `web/src/components/BottomNav.jsx` — 4 tabs WOLVES
- `web/src/components/MarketCard.jsx` — Refonte visuelle Polymarket-style
- `web/src/pages/BetlyCopy.jsx` — Refonte visuelle
- `web/src/pages/Profile.jsx` — Refonte visuelle
- `web/src/pages/Account.jsx` — Refonte visuelle
- `web/src/pages/PositionsPage.jsx` — Refonte visuelle
- `web/src/pages/Leaderboard.jsx` — Refonte visuelle
- `web/public/manifest.json` — Rebrand WOLVES
- `web/index.html` — Titre WOLVES

### Deleted files
- `web/src/pages/Feed.jsx`
- `web/src/pages/AgentsPage.jsx`
- `web/src/pages/DocsPage.jsx`
- `web/src/pages/CreateMarket.jsx`
- `web/src/pages/CreatorDashboard.jsx`
- `web/src/pages/VerifyCreator.jsx`
- `web/src/pages/AffiliatePage.jsx`
- `web/src/pages/AdminPage.jsx`
- `web/src/pages/TagPage.jsx`
- `web/src/pages/SharePage.jsx`

---

## Task 1: Design Tokens & Global CSS Refonte

**Files:**
- Modify: `web/src/index.css`
- Modify: `web/index.html`
- Modify: `web/public/manifest.json`

- [ ] **Step 1: Refondre index.css avec les tokens WOLVES**

Remplacer le contenu de `web/src/index.css` par :

```css
@import "tailwindcss";

/* ═══ WOLVES Design Tokens ═══ */
:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #1c2128;
  --bg-card: #1c2128;
  --bg-card-hover: #21262d;
  --bg-sidebar: #0d1117;
  --bg-input: #0d1117;

  --accent: #7C3AED;
  --accent-hover: #6D28D9;
  --accent-dim: rgba(124, 58, 237, 0.12);
  --accent-glow: rgba(124, 58, 237, 0.3);
  --cyan: #06B6D4;
  --cyan-dim: rgba(6, 182, 212, 0.12);

  --green: #10B981;
  --green-dim: rgba(16, 185, 129, 0.12);
  --red: #EF4444;
  --red-dim: rgba(239, 68, 68, 0.12);
  --yellow: #F59E0B;
  --blue: #3B82F6;

  --text-primary: #E6EDF3;
  --text-secondary: #8B949E;
  --text-muted: #484F58;
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --sidebar-width: 240px;
  --topbar-height: 56px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* ═══ Scrollbar ═══ */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
* { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }

/* ═══ Utility Classes (Stake/Polymarket clones) ═══ */
.wolves-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.wolves-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-hover);
}

.wolves-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-body);
}
.wolves-btn-primary {
  background: var(--accent);
  color: #fff;
}
.wolves-btn-primary:hover {
  background: var(--accent-hover);
  box-shadow: 0 0 20px var(--accent-glow);
  transform: translateY(-1px);
}
.wolves-btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
.wolves-btn-ghost:hover {
  background: rgba(255,255,255,0.04);
  color: var(--text-primary);
  border-color: var(--border-hover);
}
.wolves-btn-yes {
  background: var(--green-dim);
  color: var(--green);
  border: 1px solid rgba(16,185,129,0.2);
}
.wolves-btn-yes:hover {
  background: rgba(16,185,129,0.2);
  border-color: rgba(16,185,129,0.4);
  box-shadow: 0 0 12px rgba(16,185,129,0.15);
}
.wolves-btn-no {
  background: var(--red-dim);
  color: var(--red);
  border: 1px solid rgba(239,68,68,0.2);
}
.wolves-btn-no:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.4);
  box-shadow: 0 0 12px rgba(239,68,68,0.15);
}

.wolves-input {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  font-family: var(--font-body);
}
.wolves-input:focus {
  border-color: var(--accent);
}

.wolves-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ═══ Animations ═══ */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulse-live {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px var(--accent-glow); }
  50% { box-shadow: 0 0 20px var(--accent-glow); }
}

.animate-fade-in-up { animation: fadeInUp 0.3s ease; }
.animate-fade-in { animation: fadeIn 0.2s ease; }
.animate-pulse-live { animation: pulse-live 2s ease-in-out infinite; }

/* ═══ Page transitions ═══ */
.page-enter { animation: fadeInUp 0.25s ease; }

/* ═══ Google Fonts (loaded in index.html) ═══ */
```

- [ ] **Step 2: Update index.html**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WOLVES — Loup-Garou IA Live</title>
    <meta name="description" content="Regardez 8 IAs jouer au Loup-Garou en direct. Pariez sur l'issue." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Update manifest.json**

```json
{
  "name": "WOLVES",
  "short_name": "WOLVES",
  "description": "Loup-Garou IA Live — Pariez en direct",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0d1117",
  "theme_color": "#7C3AED",
  "icons": [
    { "src": "/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml" },
    { "src": "/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml" }
  ]
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add web/src/index.css web/index.html web/public/manifest.json
git commit -m "refonte: design tokens WOLVES, couleurs Stake/Polymarket, utility classes"
```

---

## Task 2: Topbar Refonte (Polymarket-style)

**Files:**
- Modify: `web/src/components/Topbar.jsx`

- [ ] **Step 1: Rewrite Topbar.jsx**

Clone le layout Polymarket : logo a gauche, nav links au centre, search + wallet + auth a droite. Sticky top, dark, compact.

```jsx
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
            <span>🔍</span>
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
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                }}>{(user.pseudo || '?')[0].toUpperCase()}</span>
                {!isMobile && <span>{user.pseudo}</span>}
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
                    { label: 'Mon profil', href: `/profile/${user.pseudo}` },
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
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add web/src/components/Topbar.jsx
git commit -m "refonte: Topbar WOLVES style Polymarket — logo, nav, search, auth"
```

---

## Task 3: BottomNav Refonte

**Files:**
- Modify: `web/src/components/BottomNav.jsx`

- [ ] **Step 1: Rewrite BottomNav.jsx**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/BottomNav.jsx
git commit -m "refonte: BottomNav WOLVES — 4 tabs avec indicateur live"
```

---

## Task 4: App.jsx Refonte — Routing & Cleanup

**Files:**
- Modify: `web/src/App.jsx`
- Delete: `web/src/pages/Feed.jsx`, `web/src/pages/AgentsPage.jsx`, `web/src/pages/DocsPage.jsx`, `web/src/pages/CreateMarket.jsx`, `web/src/pages/CreatorDashboard.jsx`, `web/src/pages/VerifyCreator.jsx`, `web/src/pages/AffiliatePage.jsx`, `web/src/pages/AdminPage.jsx`, `web/src/pages/TagPage.jsx`, `web/src/pages/SharePage.jsx`

- [ ] **Step 1: Update App.jsx imports and routing**

Remplacer les imports et la fonction `getPage()` :
- Supprimer imports des pages mortes (Feed, Agents, Docs, Create, Creator, Verify, Affiliate, Admin, Tag, Share)
- Ajouter imports HomePage et LiveGamePage
- Modifier `getPage()` : `/` → `'home'`, `/live` → `'live'`
- Modifier le rendu : `page === 'home' && <HomePage />`, `page === 'live' && <LiveGamePage />`
- Rebrand footer : BETLY → WOLVES, betly-icon.png → logo texte
- Supprimer les routes mortes du JSX

Le fichier App.jsx complet est trop long a inclure ici. Les modifications cles :

Dans `getPage()` remplacer le return `'feed'` par `'home'` et ajouter `if (path === '/live') return 'live';`

Dans `AppInner`, remplacer :
```jsx
{page === 'feed' && <Feed />}
```
par :
```jsx
{page === 'home' && <HomePage />}
{page === 'live' && <LiveGamePage />}
```

Supprimer toutes les lignes pour : create, agents, docs, admin, affiliate, creator, verify-creator, tag, share.

Dans le Footer, remplacer `BETLY` par `WOLVES` et le lien `/affiliate` par `/copy`.

- [ ] **Step 2: Create placeholder HomePage.jsx**

```jsx
import React from 'react';

export default function HomePage() {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 48,
        fontWeight: 900,
        letterSpacing: 6,
        background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 16,
      }}>WOLVES</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
        8 IAs jouent au Loup-Garou. Pariez en direct.
      </p>
      <a href="/live" className="wolves-btn wolves-btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
        Regarder en direct
      </a>
    </div>
  );
}
```

- [ ] **Step 3: Create placeholder LiveGamePage.jsx**

```jsx
import React from 'react';

export default function LiveGamePage() {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 3, color: 'var(--text-primary)', marginBottom: 16 }}>
        EN DIRECT
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Le jeu en direct sera implemente dans les prochaines taches.
      </p>
      <button className="wolves-btn wolves-btn-primary">
        Lancer une partie
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Delete dead pages**

```bash
cd /Users/aifactory/wolves/web/src/pages
rm -f Feed.jsx AgentsPage.jsx DocsPage.jsx CreateMarket.jsx CreatorDashboard.jsx VerifyCreator.jsx AffiliatePage.jsx AdminPage.jsx TagPage.jsx SharePage.jsx
```

- [ ] **Step 5: Verify build**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add -A web/src/
git commit -m "refonte: App.jsx routing WOLVES, supprimer pages mortes, placeholders Home+Live"
```

---

## Task 5: HomePage — Landing Stake-style

**Files:**
- Modify: `web/src/pages/HomePage.jsx`

- [ ] **Step 1: Build full HomePage**

Clone le layout Stake.com : hero plein ecran avec CTA, section trending/live, section features.

```jsx
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

function HeroSection({ isMobile }) {
  return (
    <div style={{
      position: 'relative',
      padding: isMobile ? '60px 0 40px' : '80px 0 60px',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* Gradient bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.05) 0%, transparent 50%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 48 : 72,
          fontWeight: 900,
          letterSpacing: isMobile ? 6 : 12,
          background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
          lineHeight: 1.1,
        }}>WOLVES</div>

        <p style={{
          fontSize: isMobile ? 16 : 20,
          color: 'var(--text-secondary)',
          maxWidth: 500,
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}>
          8 IAs jouent au Loup-Garou en direct. Debats, votes, eliminations — pariez sur l'issue.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/live" className="wolves-btn wolves-btn-primary" style={{
            fontSize: 16, padding: '14px 36px', letterSpacing: 1,
          }}>
            🔴 Regarder en direct
          </a>
          <a href="/copy" className="wolves-btn wolves-btn-ghost" style={{
            fontSize: 14, padding: '14px 28px',
          }}>
            ⚡ Copy Trading
          </a>
        </div>
      </div>
    </div>
  );
}

function HowItWorks({ isMobile }) {
  const steps = [
    { icon: '☀️', title: 'JOUR', desc: 'Les IAs debattent et cherchent les loups parmi elles. Chaque personnage a sa propre personnalite.' },
    { icon: '🗳️', title: 'VOTE', desc: 'Le village vote pour eliminer un suspect. Les loups tentent de manipuler le vote.' },
    { icon: '🌙', title: 'NUIT', desc: 'Les loups choisissent une victime. Le cycle continue jusqu\'a la victoire d\'un camp.' },
  ];

  return (
    <div style={{ padding: '48px 0' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 4,
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginBottom: 28,
      }}>COMMENT CA MARCHE</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {steps.map((step, i) => (
          <div key={i} className="wolves-card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{step.icon}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
              color: 'var(--accent)',
              marginBottom: 8,
            }}>{step.title}</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: 40, padding: '24px 0',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap',
    }}>
      {[
        { value: '∞', label: 'Parties jouees' },
        { value: '8', label: 'IAs par partie' },
        { value: '1,000', label: 'Tokens offerts' },
        { value: '100%', label: 'Transparent' },
      ].map((stat, i) => (
        <div key={i} style={{ textAlign: 'center', minWidth: 100 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--accent)',
          }}>{stat.value}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginTop: 4 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto' }}>
      <HeroSection isMobile={isMobile} />
      <StatsBar />
      <HowItWorks isMobile={isMobile} />
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/HomePage.jsx
git commit -m "feat: HomePage WOLVES — hero Stake-style, stats, how-it-works"
```

---

## Task 6: Game Socket Hook

**Files:**
- Create: `web/src/components/game/useGameSocket.js`

- [ ] **Step 1: Create the hook**

```bash
mkdir -p /Users/aifactory/wolves/web/src/components/game
```

```jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const STARTING_TOKENS = 1000;
const STORAGE_KEY = 'wolves_tokens_v2';

function getBalance() {
  const b = localStorage.getItem(STORAGE_KEY);
  if (b === null) { localStorage.setItem(STORAGE_KEY, STARTING_TOKENS); return STARTING_TOKENS; }
  return parseInt(b, 10) || 0;
}
function setStoredBalance(v) {
  localStorage.setItem(STORAGE_KEY, Math.max(0, v));
}

export function useGameSocket() {
  const socketRef = useRef(null);
  const [matchId, setMatchId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [phase, setPhase] = useState('waiting');
  const [round, setRound] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [balance, setBalance] = useState(getBalance());
  const [totalPayout, setTotalPayout] = useState(0);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateBalance = useCallback((v) => {
    setStoredBalance(v);
    setBalance(v);
  }, []);

  const startMatch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/matches/start', { method: 'POST' });
      if (!res.ok) throw new Error('Erreur serveur: ' + res.status);
      const data = await res.json();
      setMatchId(data.matchId);
      setWinner(null);
      setTotalPayout(0);
      setChatMessages([]);
      setPlayers([]);
      setMarkets([]);
      setMyBets([]);
      setPhase('day');
      setRound(1);
      return data.matchId;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect socket when matchId changes
  useEffect(() => {
    if (!matchId) return;

    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_match', matchId);
      // Catch up
      fetch('/api/matches/' + matchId + '/live')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          if (data.match?.players) {
            setPlayers(data.match.players.map(p => ({
              name: p.characterName || p.name,
              alive: p.alive !== false,
              role: null,
            })));
          }
          const events = data.events || [];
          const msgs = [];
          events.forEach(ev => {
            if (ev.type === 'chat') {
              msgs.push({ type: 'chat', speaker: ev.metadata?.actorName, text: ev.content, eventId: ev._id, modelLabel: ev.metadata?.llm?.modelLabel });
            } else if (ev.type === 'phase_change') {
              let p = ev.metadata?.phase || 'day';
              const base = p.replace(/[0-9]+$/, '');
              if (['day','vote','night'].includes(base)) p = base;
              setPhase(p);
              setRound(ev.metadata?.round || 1);
              msgs.push({ type: 'phase', phase: p, round: ev.metadata?.round || 1 });
            } else if (ev.type === 'elimination') {
              msgs.push({ type: 'elimination', name: ev.metadata?.targetName, method: ev.metadata?.method });
              setPlayers(prev => prev.map(p => p.name === ev.metadata?.targetName ? { ...p, alive: false } : p));
            } else if (ev.type === 'vote') {
              msgs.push({ type: 'vote', voter: ev.metadata?.actorName });
            }
          });
          setChatMessages(msgs);

          // Fetch markets
          fetch('/api/matches/' + matchId + '/markets')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.markets) setMarkets(d.markets); })
            .catch(() => {});
        })
        .catch(() => {});
    });

    socket.on('match_start', (data) => {
      setPlayers((data.players || []).map(p => ({ name: p.name, alive: true, role: null })));
      setChatMessages(prev => [...prev, { type: 'system', text: 'La partie commence avec ' + (data.players?.length || 8) + ' joueurs.' }]);
    });

    socket.on('phase_change', (data) => {
      let p = data.phase;
      const base = p.replace(/[0-9]+$/, '');
      if (['day','vote','night'].includes(base)) p = base;
      setPhase(p);
      setRound(data.round || 1);
      setChatMessages(prev => [...prev, { type: 'phase', phase: p, round: data.round || 1 }]);
    });

    socket.on('chat_message', (data) => {
      setCurrentSpeaker(data.speaker);
      setChatMessages(prev => [...prev, { type: 'chat', speaker: data.speaker, text: data.text, eventId: data.eventId, modelLabel: data.modelLabel }]);
    });

    socket.on('vote_cast', (data) => {
      setChatMessages(prev => [...prev, { type: 'vote', voter: data.voter }]);
    });

    socket.on('vote_result', (data) => {
      if (data.eliminated) {
        setChatMessages(prev => [...prev, { type: 'system', text: 'Resultat : ' + data.eliminated + ' est elimine(e).' }]);
      }
      if (data.tally) {
        const parts = Object.entries(data.tally).map(([k,v]) => k + ': ' + v).join(', ');
        setChatMessages(prev => [...prev, { type: 'system', text: 'Votes — ' + parts }]);
      }
    });

    socket.on('elimination', (data) => {
      setPlayers(prev => prev.map(p => p.name === data.name ? { ...p, alive: false } : p));
      const method = data.method === 'night_kill' ? 'tue(e) par les loups' : 'elimine(e) par le village';
      setChatMessages(prev => [...prev, { type: 'elimination', name: data.name, method }]);
    });

    socket.on('night_kill', (data) => {
      setPlayers(prev => prev.map(p => p.name === data.victim ? { ...p, alive: false } : p));
      setChatMessages(prev => [...prev, { type: 'elimination', name: data.victim, method: 'devore(e) durant la nuit' }]);
    });

    socket.on('match_end', (data) => {
      if (data.roles) {
        setPlayers(prev => prev.map(p => {
          const r = data.roles.find(x => x.name === p.name);
          return r ? { ...p, role: r.role, alive: r.alive } : p;
        }));
      }
      setWinner(data.winnerSide);
    });

    socket.on('markets_init', (data) => setMarkets(data.markets || []));

    socket.on('market_update', (data) => {
      setMarkets(prev => prev.map(m => m.id === data.marketId ? { ...m, totalYes: data.totalYes, totalNo: data.totalNo, odds: data.odds } : m));
    });

    socket.on('market_resolve', (data) => {
      setMarkets(prev => prev.map(m => m.id === data.marketId ? { ...m, resolved: true, result: data.result } : m));
      // Check winnings
      if (data.winnings && socket.id) {
        data.winnings.forEach(w => {
          if (w.socketId === socket.id) {
            setTotalPayout(prev => prev + w.payout);
            updateBalance(getBalance() + w.payout);
          }
        });
      }
      setMyBets(prev => prev.map(b => b.marketId === data.marketId ? { ...b, status: b.side === data.winningSide ? 'won' : 'lost' } : b));
    });

    socket.on('bet_confirmed', () => {});
    socket.on('bet_error', (data) => {
      setError(data.error || 'Pari refuse');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [matchId, updateBalance]);

  const placeBet = useCallback((marketId, side, amount) => {
    if (!socketRef.current || !matchId) return;
    const m = markets.find(x => x.id === marketId);
    updateBalance(balance - amount);
    setMyBets(prev => [...prev, { marketId, label: m?.label || marketId, side, amount, status: 'pending' }]);
    socketRef.current.emit('place_bet', { matchId, marketId, side, amount });
  }, [matchId, markets, balance, updateBalance]);

  return {
    matchId, players, markets, myBets, chatMessages, phase, round,
    currentSpeaker, balance, totalPayout, winner, loading, error,
    startMatch, placeBet, updateBalance,
  };
}
```

- [ ] **Step 2: Install socket.io-client if needed**

```bash
cd /Users/aifactory/wolves/web && npm ls socket.io-client 2>/dev/null || npm install socket.io-client
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add web/src/components/game/
git commit -m "feat: useGameSocket hook — Socket.io, state management, betting"
```

---

## Task 7: LiveGamePage — Full Implementation

**Files:**
- Modify: `web/src/pages/LiveGamePage.jsx`
- Create: `web/src/components/game/GameTable.jsx`
- Create: `web/src/components/game/LiveChat.jsx`
- Create: `web/src/components/game/BettingPanel.jsx`
- Create: `web/src/components/game/BetModal.jsx`
- Create: `web/src/components/game/VerifyModal.jsx`
- Create: `web/src/components/game/PhaseBanner.jsx`
- Create: `web/src/components/game/WinnerOverlay.jsx`

This is the largest task. Each component is a focused file. The engineer should implement them one by one and wire them into LiveGamePage.

**Note:** This task is large enough that it should be split into sub-steps. The subagent should create each file individually, verify build after each, then wire them together in LiveGamePage.

- [ ] **Step 1: Create GameTable.jsx** — Circle of players with avatars, names, speaking indicator, elimination states, phase backgrounds (day/night/vote), speech bubbles. Port the table rendering logic from wolves.html.

- [ ] **Step 2: Create LiveChat.jsx** — Scrollable chat log with message types (chat, system, phase, vote, elimination). Each chat message shows speaker name (colored), model tag, text, and verify button (loupe).

- [ ] **Step 3: Create BettingPanel.jsx** — Right panel with main market (wolves_win) showing OUI/NON percentage bar + odds buttons, identity markets, first eliminated markets, and my bets section. Style Polymarket.

- [ ] **Step 4: Create BetModal.jsx** — Glassmorphism modal: market label, side tag, amount input with presets (10/50/100/250), balance display, potential payout, confirm/cancel buttons.

- [ ] **Step 5: Create VerifyModal.jsx** — Handles both single event verify and global verify. Fetches /api/matches/:id/events/:eventId/raw or /api/matches/:id/events. Shows model, provider, latency, tokens, system prompt, input messages, raw response.

- [ ] **Step 6: Create PhaseBanner.jsx** — Full-screen overlay that appears briefly on phase change. Shows phase name (JOUR/VOTE/NUIT) with appropriate color and animation, fades out after 2.5s.

- [ ] **Step 7: Create WinnerOverlay.jsx** — Victory overlay with winner side, role reveal, payout info, confetti, "Nouvelle Partie" and "Fermer" buttons.

- [ ] **Step 8: Wire LiveGamePage.jsx** — Import all components + useGameSocket. Layout: 2 columns desktop (left=GameTable+LiveChat, right=BettingPanel). Show "Lancer une partie" button when no match. Mobile: tabs switching between game/chat/bets views.

- [ ] **Step 9: Verify build**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 10: Commit**

```bash
git add web/src/components/game/ web/src/pages/LiveGamePage.jsx
git commit -m "feat: LiveGamePage — table de jeu, chat, paris, modals, Socket.io"
```

---

## Task 8: Refonte visuelle — Pages existantes

**Files:**
- Modify: `web/src/pages/BetlyCopy.jsx`
- Modify: `web/src/pages/Profile.jsx`
- Modify: `web/src/pages/Account.jsx`
- Modify: `web/src/pages/PositionsPage.jsx`
- Modify: `web/src/pages/Leaderboard.jsx`
- Modify: `web/src/components/MarketCard.jsx`

Pour chaque fichier :
1. Ouvrir le fichier
2. Remplacer les couleurs inline (tous les `#0a0a0f`, `#7c3aed`, etc.) par les CSS variables (`var(--bg-primary)`, `var(--accent)`, etc.)
3. Remplacer les references "BETLY" par "WOLVES"
4. Appliquer les classes utilitaires (`wolves-card`, `wolves-btn`, `wolves-btn-primary`, `wolves-btn-ghost`)
5. S'assurer que les border-radius utilisent `var(--radius-lg)` pour les cards et `var(--radius-md)` pour les boutons
6. Mettre a jour les hover effects pour matcher le style Stake/Polymarket

- [ ] **Step 1: Refonte MarketCard.jsx** — Appliquer `wolves-card` class, boutons OUI/NON avec `wolves-btn-yes`/`wolves-btn-no`, barre de pourcentage style Polymarket, remplacer couleurs hardcodees par variables.

- [ ] **Step 2: Refonte BetlyCopy.jsx** — Remplacer "BETLY" par "WOLVES", appliquer `wolves-card` aux cards de traders, `wolves-btn-primary` aux boutons, variables CSS partout.

- [ ] **Step 3: Refonte Leaderboard.jsx** — `wolves-card` pour le tableau, variables CSS, rebrand.

- [ ] **Step 4: Refonte Account.jsx** — Variables CSS, rebrand, `wolves-btn` classes.

- [ ] **Step 5: Refonte Profile.jsx** — Variables CSS, rebrand, `wolves-card` classes.

- [ ] **Step 6: Refonte PositionsPage.jsx** — Variables CSS, `wolves-card` pour les positions, rebrand.

- [ ] **Step 7: Verify build**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 8: Commit**

```bash
git add web/src/pages/ web/src/components/MarketCard.jsx
git commit -m "refonte: visuelle de toutes les pages existantes — couleurs, cards, boutons WOLVES"
```

---

## Task 9: Pages annexes + Assets + Build final

**Files:**
- Modify: `web/src/pages/TermsPage.jsx`, `web/src/pages/PrivacyPage.jsx`, `web/src/pages/LegalPage.jsx`, `web/src/pages/ResponsibleGamingPage.jsx`
- Modify: `web/public/favicon.svg`

- [ ] **Step 1: Rebrand pages legales** — Rechercher/remplacer "BETLY" → "WOLVES" dans TermsPage, PrivacyPage, LegalPage, ResponsibleGamingPage.

- [ ] **Step 2: Update favicon.svg** — Creer un SVG simple avec la lettre W en gradient violet/cyan.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0d1117"/>
  <text x="16" y="23" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="url(#g)">W</text>
</svg>
```

- [ ] **Step 3: Build final**

```bash
cd /Users/aifactory/wolves/web && npm run build
```

- [ ] **Step 4: Commit tout**

```bash
git add -A
git commit -m "refonte: WOLVES MVP complet — rebrand, pages legales, favicon, build OK"
```

---

## Task 10: Deploy Vercel

- [ ] **Step 1: Verifier que le build est dans web/dist/**

```bash
ls /Users/aifactory/wolves/web/dist/index.html
```

- [ ] **Step 2: Push sur GitHub**

```bash
cd /Users/aifactory/wolves && git push origin main
```

- [ ] **Step 3: Verifier le deploy Vercel**

Le `vercel.json` est deja configure pour servir `web/dist/` et le backend Express. Le push devrait trigger un auto-deploy.

---

**Self-review notes:**
- Spec coverage: All 3 main pages covered (Home, Live, Copy kept). Profile, Account, Positions, Leaderboard, legal pages all refondus. Dead pages deleted. Assets rebranded.
- No placeholders in design tokens, CSS, or component code. Task 7 (LiveGamePage) is the largest — it references creating 7 sub-component files. The subagent implementing this should build each file one by one.
- Type consistency: useGameSocket exports match what LiveGamePage and its children consume (matchId, players, markets, etc.).

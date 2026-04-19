# WOLVES — Refonte Frontend Totale

## Goal
Transformer l'app BETLY React en WOLVES : plateforme de Loup-Garou IA avec paris en direct. Refonte visuelle totale de toutes les pages en clonant les composants React, boutons, cards et layouts de Stake.com + Polymarket. Garder le concept fonctionnel de chaque page mais tout refaire visuellement.

## Stack
- React 18 + Vite 5 + Tailwind 4
- Socket.io client (jeu live)
- Composants UI existants (button, card, dialog, tabs, etc.) — refonte style
- Auth Firebase + Dynamic wallet (inchangé)
- Backend Express/MongoDB (inchangé)

## Pages

### 1. HomePage `/` (remplace Feed.jsx)
**Clone : Stake.com landing**
- Hero section plein écran : logo WOLVES animé, tagline, CTA "Regarder en direct"
- Match en cours : mini-card live avec phase, joueurs, timer
- Section "Comment ca marche" : 3 cards (Jour/Vote/Nuit)
- Section stats : matchs joues, tokens distribues
- Section Copy Trading : CTA vers /copy
- Dark gaming aesthetic, gradients subtils, glassmorphism

### 2. LiveGamePage `/live` (NEW)
**Clone : Polymarket market detail page**
- Layout 2 colonnes desktop : gauche (jeu+chat) / droite (paris)
- Table de jeu : cercle de joueurs, avatars, speech bubbles, phase backgrounds
- Chat en direct : messages IA, modele tag, bouton loupe transparence
- Panel paris : marche principal (wolves_win) avec barre OUI/NON + cotes, marches identite, premier elimine
- Bet modal glassmorphism
- Verify modal (transparence LLM)
- Phase banners, winner overlay, confetti
- Socket.io : match_start, phase_change, chat_message, vote_cast, vote_result, elimination, night_kill, match_end, markets_init, market_update, market_resolve, bet_confirmed, bet_error
- Mobile : 3 tabs (Jeu / Chat / Paris)
- Bouton "Lancer une partie" quand pas de match actif

### 3. BetlyCopy `/copy` (KEEP concept, REFONTE visuelle)
- Garder toute la logique copy-trading
- Refonte visuelle : cards style Stake, boutons style Polymarket
- Rebrand WOLVES

### 4. Profile `/profile/:id` (KEEP concept, REFONTE visuelle)
- Garder logique profil
- Refonte visuelle : layout style Polymarket profile
- Rebrand WOLVES

### 5. Account `/account` (KEEP concept, REFONTE visuelle)
- Garder logique compte
- Refonte visuelle style Stake account page
- Rebrand WOLVES

### 6. PositionsPage `/positions` (KEEP concept, REFONTE visuelle)
- Garder logique positions/bets
- Refonte visuelle : table style Polymarket positions
- Rebrand WOLVES

### 7. Leaderboard `/leaderboard` (KEEP concept, REFONTE visuelle)
- Garder logique classement
- Refonte visuelle : style Stake leaderboard
- Rebrand WOLVES

### 8. Pages annexes (terms, privacy, legal, responsible-gaming)
- Garder contenu
- Refonte visuelle minimale : rebrander WOLVES, memes composants

## Pages supprimees
- Feed.jsx → remplace par HomePage
- AgentsPage.jsx
- DocsPage.jsx
- CreateMarket.jsx
- CreatorDashboard.jsx
- VerifyCreator.jsx
- AffiliatePage.jsx
- AdminPage.jsx
- TagPage.jsx
- SharePage.jsx

## Composants refondus

### Topbar.jsx (REFONTE)
- Logo WOLVES (gradient violet/cyan, font Orbitron)
- Nav links : Accueil, En Direct (avec indicateur live), Copy Trading, Classement
- Boutons auth/wallet gardes
- Search Ctrl+K garde
- Style : Stake.com topbar (dark, compact, hover effects subtils)

### BottomNav.jsx (REFONTE)
- 4 tabs : Accueil, Live, Copy, Compte
- Icons SVG style Stake
- Badge live pulsant sur "Live"

### Footer (REFONTE)
- Rebrand WOLVES
- Memes liens legaux

### MarketCard.jsx (REFONTE visuelle)
- Garder logique
- Style Polymarket : barre OUI/NON, boutons arrondis, hover glow

### Nouveaux composants
- `LiveGameTable.jsx` — cercle de joueurs, phase backgrounds, speech bubbles
- `LiveChat.jsx` — chat en direct avec messages IA
- `BettingPanel.jsx` — panel de paris avec marches
- `BetModal.jsx` — modal de pari
- `VerifyModal.jsx` — transparence LLM
- `PhaseBanner.jsx` — banner de phase (JOUR/VOTE/NUIT)
- `WinnerOverlay.jsx` — overlay victoire + confetti
- `HeroSection.jsx` — hero homepage
- `LiveMatchPreview.jsx` — mini preview match en cours

## Design System (refonte)

### Couleurs (CSS variables dans index.css)
```
--bg-primary: #0A0A0F
--bg-secondary: #13131A
--bg-tertiary: #1A1A24
--bg-card: rgba(255,255,255,0.02)
--accent-violet: #7C3AED
--accent-cyan: #06B6D4
--danger: #EF4444
--success: #10B981
--warning: #F59E0B
--text-primary: #E2E8F0
--text-secondary: #64748B
--text-muted: #475569
--border: rgba(255,255,255,0.06)
```

### Fonts
- Display : Orbitron (logo, titres sections)
- Body : Inter (texte)
- Mono : JetBrains Mono (odds, stats, code)

### Effets (clone Stake/Polymarket)
- Glassmorphism sur modals et cards hover
- Gradient borders subtils (violet → cyan)
- Hover : translateY(-1px) + box-shadow glow
- Transitions 0.2s ease
- Border-radius : 12-16px cards, 8-10px boutons

## Assets a changer
- betly-logo.png → wolves-logo (genere ou texte Orbitron)
- betly-icon.png → wolves-icon
- favicon.svg → wolves
- manifest.json → WOLVES
- Titre HTML → WOLVES

## Deploiement
- Build : `cd web && npm run build` (Vite → web/dist/)
- Vercel : deja configure, sert web/dist/ + backend Express
- Git push → auto-deploy

# WOLVES — Plan d'implémentation prioritaire

## Priorité 1: Fix Wallet Connection
**Problème:** Le bouton wallet ne fonctionne plus après la refonte UI.
**Cause probable:** WalletButton masqué quand `!user`, ou Dynamic SDK config cassée.
**Fichiers:** `web/src/components/WalletButton.jsx`, `web/src/App.jsx` (DynamicContextProvider)

## Priorité 2: Fix Live Game Page
**Problème:** La page /live est vide — pas de paris, pas de chat, pas d'odds.
**Cause:** Les composants existent (BettingPanel, LiveChat, GameTable) mais le socket ne connecte pas ou l'état n'est pas initialisé correctement.
**Fichiers:** `web/src/pages/LiveGamePage.jsx`, `web/src/components/game/useGameSocket.js`

## Priorité 3: Socket.io Production
**Problème:** Socket.io ne fonctionne PAS sur Vercel serverless.
**Solution:** Déployer le backend sur Railway (ou serveur dédié) séparément du frontend.
**Impact:** Toute la partie live/real-time dépend de ça.

## Priorité 4: Persistance des paris en DB
**Problème:** Les paris sont en mémoire seulement dans MatchEngine.
**Solution:** Connecter WolfMarket/WolfBet models au MatchEngine.

## Priorité 5: Système multijoueur
**Problème:** Actuellement les parties sont IA-only, les users regardent.
**Solution:** Système de lobby, minimum de joueurs, paris crypto via wallets custodial.

import React, { useState, useEffect } from 'react';
import { useGameSocket } from '../components/game/useGameSocket';
import GameTable from '../components/game/GameTable';
import LiveChat from '../components/game/LiveChat';
import BettingPanel from '../components/game/BettingPanel';
import BetModal from '../components/game/BetModal';
import VerifyModal from '../components/game/VerifyModal';
import PhaseBanner from '../components/game/PhaseBanner';
import GameHUD from '../components/game/GameHUD';
import WinnerOverlay from '../components/game/WinnerOverlay';

const TABS = [
  { key: 'game', label: 'Jeu' },
  { key: 'chat', label: 'Chat' },
  { key: 'bets', label: 'Paris' },
];

export default function LiveGamePage() {
  const {
    matchId, players, markets, myBets, chatMessages, phase, round,
    currentSpeaker, balance, totalPayout, winner, loading, error,
    startMatch, placeBet, updateBalance,
  } = useGameSocket();

  // Read game mode from URL params (?mode=lifeboat or ?mode=bunker)
  const gameMode = new URLSearchParams(window.location.search).get('mode') || 'werewolf';
  const handleStart = () => startMatch(gameMode);

  const [mobileTab, setMobileTab] = useState('game');
  const [betModal, setBetModal] = useState(null);
  const [verifyEvent, setVerifyEvent] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (winner) setShowWinner(true);
  }, [winner]);

  const handleBetClick = (marketId, side) => {
    setBetModal({ marketId, side });
  };

  const handleBetConfirm = (amount) => {
    if (betModal) {
      placeBet(betModal.marketId, betModal.side, amount);
      setBetModal(null);
    }
  };

  const selectedMarket = betModal ? markets.find(m => m.id === betModal.marketId) : null;

  // No match — show start screen
  if (!matchId) {
    return (
      <div style={{ padding: '40px 0', maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3,
            color: 'var(--text-primary)', marginBottom: 8,
          }}>
            {gameMode === 'lifeboat' ? 'LIFEBOAT EN DIRECT' : gameMode === 'bunker' ? 'BUNKER EN DIRECT' : 'LOUP-GAROU EN DIRECT'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 0, maxWidth: 420, margin: '0 auto' }}>
            {gameMode === 'lifeboat' ? '8 agents IA sur un bateau qui coule. 4 survivants. Observe les debats ethiques et parie.'
              : gameMode === 'bunker' ? '8 agents IA, apocalypse nucleaire. 3 places dans le bunker. Qui sera sauve ?'
              : '8 agents IA jouent au Loup-Garou en temps reel. Observe, analyse et parie sur l\'issue de chaque partie.'}
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button
            className="wolves-btn wolves-btn-primary"
            onClick={handleStart}
            disabled={loading}
            style={{ fontSize: 15, padding: '12px 36px', opacity: loading ? 0.6 : 1 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            {loading ? 'Lancement...' : 'Lancer une partie'}
          </button>
          {error && (
            <div style={{
              color: 'var(--red)', fontSize: 13, marginTop: 16,
              background: 'var(--red-dim)', padding: '8px 16px',
              borderRadius: 8, display: 'inline-block',
            }}>
              {error}
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            {
              icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
              title: '8 Agents IA',
              desc: 'Chaque agent a sa propre personnalité et stratégie',
            },
            {
              icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
              title: 'Marchés en direct',
              desc: 'Parie sur qui est loup, qui sera éliminé, qui gagnera',
            },
            {
              icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
              title: 'Chat en temps réel',
              desc: "Suis les débats et les votes en direct",
            },
          ].map((item, i) => (
            <div key={i} className="wolves-card" style={{ padding: '16px 14px', textAlign: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(124,58,237,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon}/>
                </svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div style={{
          marginTop: 24, padding: '12px 16px',
          background: 'rgba(124,58,237,0.06)',
          border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 10, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>Comment ça marche ?</strong> — Lance une partie, 8 agents IA sont assignés des rôles (Loups-Garou ou Villageois). Observe les débats, analyse les comportements, et place tes paris sur les marchés prédictifs. Les cotes évoluent en temps réel selon les paris de tous les joueurs.
        </div>
      </div>
    );
  }

  // Desktop layout
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', minHeight: 'calc(100vh - 140px)' }}>
        {/* HUD Bar */}
        <GameHUD phase={phase} round={round} balance={balance} players={players} matchId={matchId} />

        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <GameTable players={players} phase={phase} currentSpeaker={currentSpeaker} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <LiveChat messages={chatMessages} matchId={matchId} onVerify={setVerifyEvent} />
          </div>
        </div>

        {/* Right column — betting */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <BettingPanel markets={markets} myBets={myBets} balance={balance} onBet={handleBetClick} />
        </div>
        </div>

        {/* Overlays */}
        <PhaseBanner phase={phase} round={round} />
        {betModal && (
          <BetModal
            market={selectedMarket}
            side={betModal.side}
            balance={balance}
            onConfirm={handleBetConfirm}
            onClose={() => setBetModal(null)}
          />
        )}
        {verifyEvent && (
          <VerifyModal matchId={matchId} eventId={verifyEvent} onClose={() => setVerifyEvent(null)} />
        )}
        {showWinner && (
          <WinnerOverlay
            winner={winner}
            players={players}
            totalPayout={totalPayout}
            onNewGame={() => { setShowWinner(false); startMatch(); }}
            onClose={() => setShowWinner(false)}
          />
        )}
      </div>
    );
  }

  // Mobile layout — tabs
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' }}>
      {/* HUD Bar — compact on mobile */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <GameHUD phase={phase} round={round} balance={balance} players={players} matchId={matchId} />
      </div>
      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 60, zIndex: 10, background: 'var(--bg-primary)',
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setMobileTab(t.key)} style={{
            flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer',
            color: mobileTab === t.key ? 'var(--accent)' : 'var(--text-muted)',
            borderBottom: mobileTab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
            fontFamily: 'var(--font-body)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 0' }}>
        {mobileTab === 'game' && (
          <GameTable players={players} phase={phase} currentSpeaker={currentSpeaker} />
        )}
        {mobileTab === 'chat' && (
          <LiveChat messages={chatMessages} matchId={matchId} onVerify={setVerifyEvent} />
        )}
        {mobileTab === 'bets' && (
          <BettingPanel markets={markets} myBets={myBets} balance={balance} onBet={handleBetClick} />
        )}
      </div>

      {/* Overlays */}
      <PhaseBanner phase={phase} round={round} />
      {betModal && (
        <BetModal
          market={selectedMarket}
          side={betModal.side}
          balance={balance}
          onConfirm={handleBetConfirm}
          onClose={() => setBetModal(null)}
        />
      )}
      {verifyEvent && (
        <VerifyModal matchId={matchId} eventId={verifyEvent} onClose={() => setVerifyEvent(null)} />
      )}
      {showWinner && (
        <WinnerOverlay
          winner={winner}
          players={players}
          totalPayout={totalPayout}
          onNewGame={() => { setShowWinner(false); startMatch(); }}
          onClose={() => setShowWinner(false)}
        />
      )}
    </div>
  );
}

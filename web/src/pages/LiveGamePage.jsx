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

const MODE_CONFIG = {
  werewolf: { title: 'LOUP-GAROU EN DIRECT', desc: '8 agents IA jouent au Loup-Garou en temps reel. Observe, analyse et parie.', color: '#7c3aed' },
  lifeboat: { title: 'LIFEBOAT EN DIRECT', desc: '8 agents IA sur un bateau qui coule. 4 survivants. Debats ethiques et paris.', color: '#06b6d4' },
  bunker: { title: 'BUNKER EN DIRECT', desc: '8 agents IA, apocalypse nucleaire. 3 places dans le bunker. Qui sera sauve ?', color: '#f59e0b' },
};

/* ── Player Intro Card ── */
function PlayerIntroCard({ player, index, total }) {
  const delay = index * 0.3;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      animation: `introCardIn 0.5s ease ${delay}s both`,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
        border: '2px solid rgba(124,58,237,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, fontWeight: 800, color: '#a78bfa',
        fontFamily: 'var(--font-display)',
      }}>
        {player.name.charAt(0)}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', textAlign: 'center' }}>
        {player.name}
      </div>
    </div>
  );
}

/* ── Loading Spinner ── */
function Spinner({ size = 40, color = '#7c3aed' }) {
  return (
    <div style={{
      width: size, height: size, border: `3px solid rgba(255,255,255,0.06)`,
      borderTopColor: color, borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  );
}

/* ── Connecting / Loading States ── */
function LoadingState({ gameState, players, gameMode, onRetry }) {
  const cfg = MODE_CONFIG[gameMode] || MODE_CONFIG.werewolf;

  if (gameState === 'starting' || gameState === 'connecting') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
        <Spinner size={48} color={cfg.color} />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
          {gameState === 'starting' ? 'CREATION DE LA PARTIE...' : 'CONNEXION AU SERVEUR...'}
        </div>
        <div style={{ fontSize: 13, color: '#64748b', maxWidth: 400, textAlign: 'center' }}>
          Attribution des roles et preparation des agents IA...
        </div>
        <div style={{
          width: 200, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 2, background: cfg.color,
            animation: 'loadingBar 2s ease infinite',
          }} />
        </div>
      </div>
    );
  }

  if (gameState === 'loading_players') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
        <Spinner size={48} color={cfg.color} />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
          CHARGEMENT DES JOUEURS...
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          Les agents IA preparent leurs strategies...
        </div>
      </div>
    );
  }

  if (gameState === 'intro' && players.length > 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 32 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: cfg.color,
          fontFamily: 'var(--font-display)', letterSpacing: 3,
          animation: 'fadeIn 0.5s ease',
        }}>
          {gameMode === 'lifeboat' ? 'LE BATEAU COULE...' : gameMode === 'bunker' ? 'ALERTE NUCLEAIRE...' : 'LA NUIT TOMBE SUR LE VILLAGE...'}
        </div>

        <div style={{
          fontSize: 24, fontWeight: 800, color: '#f8fafc',
          fontFamily: 'var(--font-display)', letterSpacing: 2,
          animation: 'introTitle 1s ease both',
        }}>
          {players.length} JOUEURS
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20, maxWidth: 400,
        }}>
          {players.map((p, i) => (
            <PlayerIntroCard key={p.name} player={p} index={i} total={players.length} />
          ))}
        </div>

        <div style={{
          fontSize: 12, color: '#475569', marginTop: 8,
          animation: `fadeIn 0.5s ease ${players.length * 0.3 + 0.5}s both`,
        }}>
          La partie commence dans quelques instants...
        </div>

        <div style={{
          width: 120, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
          animation: `fadeIn 0.5s ease ${players.length * 0.3 + 0.5}s both`,
        }}>
          <div style={{
            height: '100%', borderRadius: 2, background: cfg.color,
            animation: 'introProgress 3s ease forwards',
          }} />
        </div>
      </div>
    );
  }

  if (gameState === 'engine_down') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          ⏳
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-display)' }}>
          MOTEUR DE JEU EN PAUSE
        </div>
        <div style={{ fontSize: 13, color: '#64748b', maxWidth: 420, textAlign: 'center', lineHeight: 1.6 }}>
          Le serveur de jeu n'est pas disponible sur cet hebergement (Vercel serverless).
          Les parties fonctionnent en local ou sur un serveur persistant.
        </div>
        <div style={{
          padding: '12px 20px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-mono)',
        }}>
          cd wolves && node index.js → localhost:3001/live
        </div>
        <button
          onClick={onRetry}
          style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            marginTop: 8,
          }}
        >
          Reessayer
        </button>
      </div>
    );
  }

  return null;
}

/* ── CSS Keyframes (injected once) ── */
const STYLES_INJECTED = { current: false };
function injectStyles() {
  if (STYLES_INJECTED.current) return;
  STYLES_INJECTED.current = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes loadingBar { 0% { width: 0%; } 50% { width: 80%; } 100% { width: 0%; } }
    @keyframes introCardIn { from { opacity: 0; transform: translateY(20px) scale(0.8); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes introTitle { 0% { opacity: 0; letter-spacing: 12px; } 100% { opacity: 1; letter-spacing: 2px; } }
    @keyframes introProgress { from { width: 0%; } to { width: 100%; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `;
  document.head.appendChild(style);
}

export default function LiveGamePage() {
  const {
    matchId, players, markets, myBets, chatMessages, phase, round,
    currentSpeaker, balance, totalPayout, winner, loading, error,
    gameState, startMatch, placeBet, updateBalance,
  } = useGameSocket();

  const gameMode = new URLSearchParams(window.location.search).get('mode') || 'werewolf';
  const handleStart = () => startMatch(gameMode);
  const cfg = MODE_CONFIG[gameMode] || MODE_CONFIG.werewolf;

  const [mobileTab, setMobileTab] = useState('game');
  const [betModal, setBetModal] = useState(null);
  const [verifyEvent, setVerifyEvent] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (winner) setShowWinner(true);
  }, [winner]);

  const handleBetClick = (marketId, side) => setBetModal({ marketId, side });
  const handleBetConfirm = (amount) => {
    if (betModal) { placeBet(betModal.marketId, betModal.side, amount); setBetModal(null); }
  };
  const selectedMarket = betModal ? markets.find(m => m.id === betModal.marketId) : null;

  // ── No match — Start screen ──
  if (!matchId) {
    return (
      <div style={{ padding: '40px 0', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `${cfg.color}1a`,
              border: `1px solid ${cfg.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3,
            color: 'var(--text-primary)', marginBottom: 8,
          }}>{cfg.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 420, margin: '0 auto' }}>{cfg.desc}</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button
            className="wolves-btn wolves-btn-primary"
            onClick={handleStart}
            disabled={loading}
            style={{ fontSize: 15, padding: '12px 36px', opacity: loading ? 0.6 : 1, background: cfg.color }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            {loading ? 'Lancement...' : 'Lancer une partie'}
          </button>
          {error && (
            <div style={{
              color: '#ef4444', fontSize: 13, marginTop: 16,
              background: 'rgba(239,68,68,0.1)', padding: '8px 16px',
              borderRadius: 8, display: 'inline-block',
            }}>{error}</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', title: '8 Agents IA', desc: 'Personnalites uniques et strategies propres' },
            { icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', title: 'Marches en direct', desc: 'Paris avec cotes dynamiques en temps reel' },
            { icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', title: 'Chat en direct', desc: 'Debats, votes et eliminations en live' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '16px 14px', textAlign: 'center', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon}/>
                </svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Intermediate states: loading, intro, engine_down ──
  if (gameState !== 'live' && gameState !== 'ended') {
    return <LoadingState gameState={gameState} players={players} gameMode={gameMode} onRetry={handleStart} />;
  }

  // ── Game is live — Desktop layout ──
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', minHeight: 'calc(100vh - 140px)' }}>
        <GameHUD phase={phase} round={round} balance={balance} players={players} matchId={matchId} />
        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GameTable players={players} phase={phase} currentSpeaker={currentSpeaker} />
            <div style={{ flex: 1, minHeight: 0 }}>
              <LiveChat messages={chatMessages} matchId={matchId} onVerify={setVerifyEvent} />
            </div>
          </div>
          <div style={{ width: 340, flexShrink: 0 }}>
            <BettingPanel markets={markets} myBets={myBets} balance={balance} onBet={handleBetClick} />
          </div>
        </div>
        <PhaseBanner phase={phase} round={round} />
        {betModal && <BetModal market={selectedMarket} side={betModal.side} balance={balance} onConfirm={handleBetConfirm} onClose={() => setBetModal(null)} />}
        {verifyEvent && <VerifyModal matchId={matchId} eventId={verifyEvent} onClose={() => setVerifyEvent(null)} />}
        {showWinner && <WinnerOverlay winner={winner} players={players} totalPayout={totalPayout} onNewGame={() => { setShowWinner(false); startMatch(gameMode); }} onClose={() => setShowWinner(false)} />}
      </div>
    );
  }

  // ── Game is live — Mobile layout ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <GameHUD phase={phase} round={round} balance={balance} players={players} matchId={matchId} />
      </div>
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 60, zIndex: 10, background: 'var(--bg-primary)',
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setMobileTab(t.key)} style={{
            flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer',
            color: mobileTab === t.key ? cfg.color : '#475569',
            borderBottom: mobileTab === t.key ? `2px solid ${cfg.color}` : '2px solid transparent',
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, padding: '12px 0' }}>
        {mobileTab === 'game' && <GameTable players={players} phase={phase} currentSpeaker={currentSpeaker} />}
        {mobileTab === 'chat' && <LiveChat messages={chatMessages} matchId={matchId} onVerify={setVerifyEvent} />}
        {mobileTab === 'bets' && <BettingPanel markets={markets} myBets={myBets} balance={balance} onBet={handleBetClick} />}
      </div>
      <PhaseBanner phase={phase} round={round} />
      {betModal && <BetModal market={selectedMarket} side={betModal.side} balance={balance} onConfirm={handleBetConfirm} onClose={() => setBetModal(null)} />}
      {verifyEvent && <VerifyModal matchId={matchId} eventId={verifyEvent} onClose={() => setVerifyEvent(null)} />}
      {showWinner && <WinnerOverlay winner={winner} players={players} totalPayout={totalPayout} onNewGame={() => { setShowWinner(false); startMatch(gameMode); }} onClose={() => setShowWinner(false)} />}
    </div>
  );
}

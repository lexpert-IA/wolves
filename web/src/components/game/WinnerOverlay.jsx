import React from 'react';

export default function WinnerOverlay({ winner, players = [], totalPayout = 0, onNewGame, onClose }) {
  if (!winner) return null;

  const isWolves = winner === 'wolves' || winner === 'loups';
  const title = isWolves ? 'LES LOUPS GAGNENT' : 'LE VILLAGE GAGNE';
  const color = isWolves ? 'var(--red)' : 'var(--green)';
  const icon = isWolves ? '\uD83D\uDC3A' : '\uD83C\uDFE1';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: 'rgba(28,33,40,0.95)',
        border: '1px solid var(--border-hover)',
        borderRadius: 'var(--radius-xl)',
        padding: 28, width: '92%', maxWidth: 440, maxHeight: '85vh', overflowY: 'auto',
        backdropFilter: 'blur(20px)',
        animation: 'fadeInUp 0.3s ease',
        textAlign: 'center',
      }}>
        {/* Icon + title */}
        <div style={{ fontSize: 48, marginBottom: 8 }}>{icon}</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 900, letterSpacing: 4,
          color, marginBottom: 16,
        }}>
          {title}
        </div>

        {/* Payout info */}
        {totalPayout > 0 && (
          <div className="wolves-card" style={{ padding: '10px 16px', marginBottom: 16, display: 'inline-block' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Gains totaux</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>
              +{totalPayout} W$
            </div>
          </div>
        )}

        {/* Role reveal */}
        {players.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)',
            }}>
              ROLES REVELES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {players.map(p => {
                const isWolf = p.role === 'loup' || p.role === 'wolf' || p.role === 'werewolf';
                return (
                  <div key={p.name} style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: p.alive ? 1 : 0.5,
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: p.alive ? 'var(--text-primary)' : 'var(--text-muted)',
                      textDecoration: p.alive ? 'none' : 'line-through',
                    }}>
                      {p.name}
                    </span>
                    <span className="wolves-badge" style={{
                      background: isWolf ? 'var(--red-dim)' : 'var(--green-dim)',
                      color: isWolf ? 'var(--red)' : 'var(--green)',
                      fontSize: 9,
                    }}>
                      {isWolf ? '\uD83D\uDC3A Loup' : '\uD83D\uDE4B Village'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="wolves-btn wolves-btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            Fermer
          </button>
          <button className="wolves-btn wolves-btn-primary" style={{ flex: 2 }} onClick={onNewGame}>
            Nouvelle Partie
          </button>
        </div>
      </div>
    </div>
  );
}

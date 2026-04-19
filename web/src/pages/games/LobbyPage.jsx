import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const FAKE_PLAYERS = [
  { id: 1, name: 'wolf_hunter', avatar: '#7c3aed', elo: 1342, ready: true },
  { id: 2, name: 'crypto_bet', avatar: '#2563eb', elo: 1189, ready: true },
  { id: 3, name: 'night_owl', avatar: '#059669', elo: 1456, ready: false },
  { id: 4, name: 'luna_rise', avatar: '#dc2626', elo: 1278, ready: true },
  { id: 5, name: 'dark_mind', avatar: '#f59e0b', elo: 1103, ready: true },
];

const REQUIRED_PLAYERS = 8;

function PlayerAvatar({ color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}88)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="4" fill="rgba(255,255,255,0.4)" />
        <path d="M3 18C3 14 6 12 10 12C14 12 17 14 17 18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

function EmptySlot({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: '2px dashed var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <line x1="7" y1="2" x2="7" y2="12" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="7" x2="12" y2="7" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function LobbyPage() {
  const isMobile = useIsMobile();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const emptySlots = REQUIRED_PLAYERS - FAKE_PLAYERS.length;

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: isMobile ? '24px 16px' : '48px 40px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40, maxWidth: 500 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <circle cx="16" cy="12" r="4" fill="rgba(255,255,255,0.3)" />
            <path d="M8 26C8 22 11 19 16 19C21 19 24 22 24 26" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          </svg>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 28,
          fontWeight: 800, marginBottom: 8,
        }}>Pleine Lune</h1>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 20,
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
        }}>
          LOBBY PRIVE
        </div>
      </div>

      {/* Player count */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 16, padding: isMobile ? '24px 20px' : '32px',
        width: '100%', maxWidth: 480, border: '1px solid var(--border)',
        marginBottom: 24,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Joueurs connectes</span>
          <span style={{
            fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)',
          }}>
            <span style={{ color: '#7c3aed' }}>{FAKE_PLAYERS.length}</span>
            <span style={{ color: 'var(--text-muted)' }}> / {REQUIRED_PLAYERS}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 6, borderRadius: 3, background: 'var(--bg-tertiary)',
          marginBottom: 24, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 3,
            width: `${(FAKE_PLAYERS.length / REQUIRED_PLAYERS) * 100}%`,
            background: 'linear-gradient(90deg, #7c3aed, #6d28d9)',
            transition: 'width 0.5s ease',
          }} />
        </div>

        {/* Player list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAKE_PLAYERS.map(player => (
            <div key={player.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              background: 'var(--bg-tertiary)',
            }}>
              <PlayerAvatar color={player.avatar} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)',
                  color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{player.name}</div>
                <div style={{
                  fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                }}>ELO {player.elo}</div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: player.ready ? 'var(--green, #22c55e)' : 'var(--yellow, #f59e0b)',
              }} />
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              background: 'var(--bg-tertiary)', opacity: 0.4,
            }}>
              <EmptySlot size={36} />
              <div style={{
                fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
              }}>En attente{dots}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status message */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 12,
        padding: '16px 24px', width: '100%', maxWidth: 480,
        border: '1px solid var(--border)', textAlign: 'center',
        marginBottom: 24,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{
            animation: 'spin 2s linear infinite',
          }}>
            <circle cx="9" cy="9" r="7" stroke="var(--border)" strokeWidth="2" />
            <path d="M9 2A7 7 0 0 1 16 9" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{
            fontSize: 15, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
          }}>
            En attente de joueurs{dots}
          </span>
        </div>
        <div style={{
          fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-body)',
        }}>
          La partie demarrera automatiquement quand {REQUIRED_PLAYERS} joueurs seront connectes
        </div>
      </div>

      {/* Cancel button */}
      <button
        onClick={() => window.history.back()}
        style={{
          padding: '12px 32px', borderRadius: 'var(--radius-lg)',
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14,
          fontFamily: 'var(--font-body)', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--red, #dc2626)';
          e.currentTarget.style.color = 'var(--red, #dc2626)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        Quitter le lobby
      </button>

      {/* Inline keyframes for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

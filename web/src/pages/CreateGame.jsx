import React, { useState, useMemo, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

/* ── SVG Icons ── */
const MoonIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
  </svg>
);
const SkullIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="8"/><path d="M8 22h8"/><path d="M9 14l-1 8"/><path d="M15 14l1 8"/>
    <circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/>
  </svg>
);
const EyeOffIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const BoltIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const LockIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);
const UsersIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/>
    <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
  </svg>
);
const PlayIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

/* ── Game modes ── */
const GAME_MODES = [
  {
    id: 'pleine-lune',
    name: 'Pleine Lune',
    tagline: 'Le classique',
    desc: '2 loups infiltres parmi 6 villageois. Debats, votes, elimination. Le mode originel.',
    players: 8,
    wolves: 2,
    duration: '~15 min',
    color: '#7c3aed',
    icon: MoonIcon,
    available: true,
    popular: true,
  },
  {
    id: 'village-maudit',
    name: 'Village Maudit',
    tagline: 'Le chaos',
    desc: '3 loups, 5 villageois. Roles speciaux, retournements de situation. Chaos garanti.',
    players: 8,
    wolves: 3,
    duration: '~20 min',
    color: '#2563eb',
    icon: SkullIcon,
    available: false,
  },
  {
    id: 'nuit-noire',
    name: 'Nuit Noire',
    tagline: 'Hardcore',
    desc: 'Votes aveugles — personne ne voit qui vote pour qui. La paranoia a l\'etat pur.',
    players: 8,
    wolves: 2,
    duration: '~18 min',
    color: '#dc2626',
    icon: EyeOffIcon,
    available: false,
  },
  {
    id: 'wolf-hunt',
    name: 'Wolf Hunt',
    tagline: 'Speed run',
    desc: '4 joueurs, 1 loup, 3 minutes. Pas le temps de reflechir. Instinct pur.',
    players: 4,
    wolves: 1,
    duration: '~3 min',
    color: '#f59e0b',
    icon: BoltIcon,
    available: false,
    badge: 'BIENTOT',
  },
];

/* ── Fake lobbies ── */
const FAKE_LOBBIES = [
  { id: 1, mode: 'Pleine Lune', color: '#7c3aed', host: 'wolf_hunter42', current: 5, max: 8, bet: 10 },
  { id: 2, mode: 'Pleine Lune', color: '#7c3aed', host: 'crypto_moon', current: 3, max: 8, bet: 25 },
  { id: 3, mode: 'Pleine Lune', color: '#7c3aed', host: 'night_owl', current: 7, max: 8, bet: 5 },
];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ── Animated online count ── */
function useAnimatedCount(target, duration = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      start += Math.ceil(target / (duration / 16));
      if (start >= target) { setCount(target); return; }
      setCount(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return count;
}

/* ── Mode Card — Stake style ── */
function ModeCard({ mode, selected, onSelect, isMobile }) {
  const isSelected = selected === mode.id;
  const disabled = !mode.available;
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => mode.available && onSelect(mode.id)}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        border: isSelected ? `2px solid ${mode.color}` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        background: isSelected
          ? `${mode.color}12`
          : hovered && !disabled ? 'rgba(255,255,255,0.04)' : 'var(--bg-secondary)',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        width: '100%',
        outline: 'none',
        overflow: 'hidden',
        filter: disabled ? 'grayscale(0.6)' : 'none',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {/* Top colored bar */}
      <div style={{
        height: 3,
        background: mode.color,
        opacity: isSelected ? 1 : 0.4,
        transition: 'opacity 0.2s',
      }} />

      <div style={{ padding: isMobile ? '16px 14px' : '20px 18px' }}>
        {/* Icon + title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, flexShrink: 0,
            background: `${mode.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: mode.color,
          }}>
            {disabled ? <LockIcon size={24} /> : <mode.icon size={28} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                fontSize: 15, color: 'var(--text-primary)',
              }}>
                {mode.name}
              </span>
              {mode.popular && (
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '2px 7px',
                  borderRadius: 4, background: '#22c55e22', color: '#22c55e',
                  letterSpacing: '0.5px',
                }}>
                  POPULAIRE
                </span>
              )}
              {mode.badge && (
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '2px 7px',
                  borderRadius: 4, background: `${mode.color}22`, color: mode.color,
                  letterSpacing: '0.5px',
                }}>
                  {mode.badge}
                </span>
              )}
            </div>
            <span style={{
              fontSize: 12, color: mode.color, fontWeight: 600, opacity: 0.8,
            }}>
              {mode.tagline}
            </span>
          </div>

          {/* Radio */}
          {mode.available && (
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${isSelected ? mode.color : 'rgba(255,255,255,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {isSelected && (
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: mode.color }} />
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{
          fontSize: 12, color: 'var(--text-tertiary)', margin: '0 0 12px 0',
          lineHeight: 1.5,
        }}>
          {mode.desc}
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-tertiary)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
          }}>
            <UsersIcon size={12} />
            <span>{mode.players} joueurs</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
          }}>
            <span style={{ color: '#ef4444' }}>🐺</span>
            <span>{mode.wolves} loup{mode.wolves > 1 ? 's' : ''}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
          }}>
            <span>{mode.duration}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Config Panel ── */
function ConfigPanel({ isMobile, selectedMode }) {
  const [playerCount, setPlayerCount] = useState(8);
  const [minBet, setMinBet] = useState('10');
  const [isPrivate, setIsPrivate] = useState(true);
  const [survivorPool, setSurvivorPool] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const inviteCode = useMemo(() => generateCode(), []);
  const mode = GAME_MODES.find(m => m.id === selectedMode);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const playerOptions = [4, 6, 8];
  const betPresets = [5, 10, 25, 50];

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden',
    }}>
      {/* Header with mode info */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${mode?.color || '#7c3aed'}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: mode?.color || '#7c3aed',
        }}>
          {mode && <mode.icon size={20} />}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {mode?.name || 'Configuration'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            Configure les regles de ta partie
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? '16px' : '20px' }}>
        {/* Player count */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
            marginBottom: 10,
          }}>
            Nombre de joueurs
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {playerOptions.map(n => (
              <button
                key={n}
                onClick={() => setPlayerCount(n)}
                style={{
                  flex: 1, height: 40, borderRadius: 10,
                  border: playerCount === n ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
                  background: playerCount === n ? '#7c3aed15' : 'transparent',
                  color: playerCount === n ? '#a78bfa' : 'var(--text-tertiary)',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Min bet with presets */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Mise minimum
            </span>
            <span style={{
              fontSize: 14, fontWeight: 800, color: '#a78bfa',
              fontFamily: "'Orbitron', sans-serif",
            }}>
              {minBet} W$
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {betPresets.map(a => (
              <button
                key={a}
                onClick={() => setMinBet(String(a))}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8,
                  border: String(minBet) === String(a) ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
                  background: String(minBet) === String(a) ? '#7c3aed15' : 'transparent',
                  color: String(minBet) === String(a) ? '#a78bfa' : 'var(--text-tertiary)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {a}$
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 0,
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {/* Private toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                Partie privee
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                Accessible uniquement par code
              </div>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none',
                background: isPrivate ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: isPrivate ? 23 : 3,
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          {/* Survivor pool */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Survivor Pool
                </span>
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: '1px 5px',
                  borderRadius: 3, background: '#f59e0b22', color: '#f59e0b',
                }}>
                  NEW
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, maxWidth: 200 }}>
                Le meilleur predicteur rafle tout le pot
              </div>
            </div>
            <button
              onClick={() => setSurvivorPool(!survivorPool)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none',
                background: survivorPool ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: survivorPool ? 23 : 3,
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </div>

        {/* Invite code */}
        {isPrivate && (
          <div style={{
            marginTop: 16, padding: '14px 16px', borderRadius: 12,
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.15)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 }}>
              Code d'invitation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                background: 'rgba(0,0,0,0.3)',
                fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 800,
                color: '#a78bfa', letterSpacing: '4px', textAlign: 'center',
              }}>
                {inviteCode}
              </div>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '10px 14px', borderRadius: 8, border: 'none',
                  background: copied ? '#059669' : 'rgba(255,255,255,0.08)',
                  color: copied ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                <CopyIcon />
                {copied ? 'OK!' : 'Copier'}
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleCreate}
          style={{
            width: '100%', marginTop: 20, padding: '14px 0',
            borderRadius: 12, border: 'none',
            background: '#7c3aed',
            color: '#fff', fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            transition: 'opacity 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          <PlayIcon size={16} />
          Lancer la partie
        </button>

        {showMessage && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 8,
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            fontSize: 12, color: '#a78bfa', textAlign: 'center',
          }}>
            Connexion backend requise — bientot disponible
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Lobby Card ── */
function LobbyCard({ lobby }) {
  const fillPercent = (lobby.current / lobby.max) * 100;
  const isFull = lobby.current >= lobby.max - 1;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 12,
        background: hovered ? 'rgba(255,255,255,0.03)' : 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.15s', cursor: 'pointer',
      }}
    >
      {/* Mode indicator */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${lobby.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: lobby.color, flexShrink: 0,
      }}>
        <MoonIcon size={22} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {lobby.host}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            · {lobby.bet}W$
          </span>
          {isFull && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 6px',
              borderRadius: 3, background: '#f59e0b22', color: '#f59e0b',
            }}>
              PRESQUE PLEIN
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)',
            maxWidth: 120,
          }}>
            <div style={{
              width: `${fillPercent}%`, height: '100%', borderRadius: 2,
              background: isFull ? '#f59e0b' : lobby.color,
              transition: 'width 0.3s',
            }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>
            {lobby.current}/{lobby.max}
          </span>
        </div>
      </div>

      {/* Join button */}
      <button style={{
        padding: '7px 16px', borderRadius: 8, border: 'none',
        background: hovered ? lobby.color : `${lobby.color}22`,
        color: hovered ? '#fff' : '#a78bfa',
        fontWeight: 700, fontSize: 12, cursor: 'pointer',
        transition: 'all 0.15s', flexShrink: 0,
      }}>
        Rejoindre
      </button>
    </div>
  );
}

/* ── Live Stats Banner ── */
function LiveStatsBanner() {
  const onlinePlayers = useAnimatedCount(47);
  const activeLobby = useAnimatedCount(3);

  return (
    <div style={{
      display: 'flex', gap: 16, marginBottom: 24,
      flexWrap: 'wrap',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: 10,
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.15)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
          boxShadow: '0 0 6px #22c55e',
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>
          {onlinePlayers} en ligne
        </span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: 10,
        background: 'rgba(124,58,237,0.08)',
        border: '1px solid rgba(124,58,237,0.15)',
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>
          {activeLobby} parties en cours
        </span>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function CreateGame() {
  const isMobile = useIsMobile();
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: isMobile ? '20px 16px' : '32px 24px',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isMobile ? 22 : 28,
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 6px 0',
        }}>
          Creer une partie
        </h1>
        <p style={{
          fontSize: 13, color: 'var(--text-tertiary)',
          margin: '0 0 20px 0', lineHeight: 1.5,
        }}>
          Choisis ton mode, configure les regles et invite tes amis.
        </p>
      </div>

      {/* Live stats */}
      <LiveStatsBanner />

      {/* Main layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 340px',
        gap: 24,
        alignItems: 'start',
      }}>
        {/* Left column — mode selection */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase', letterSpacing: '1.5px',
            marginBottom: 14,
          }}>
            Mode de jeu
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: 10,
            marginBottom: 24,
          }}>
            {GAME_MODES.map(mode => (
              <ModeCard
                key={mode.id}
                mode={mode}
                selected={selectedMode}
                onSelect={setSelectedMode}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* Config panel — appears when mode selected */}
          {selectedMode && <ConfigPanel isMobile={isMobile} selectedMode={selectedMode} />}
        </div>

        {/* Right column — Lobbies */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '1.5px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <TrophyIcon />
              Parties en attente
            </div>
            <span style={{
              fontSize: 11, color: 'var(--text-tertiary)',
              fontWeight: 600,
            }}>
              {FAKE_LOBBIES.length} lobby{FAKE_LOBBIES.length > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAKE_LOBBIES.map(lobby => (
              <LobbyCard key={lobby.id} lobby={lobby} />
            ))}
          </div>

          {/* How it works */}
          <div style={{
            marginTop: 16, padding: '16px', borderRadius: 12,
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
              marginBottom: 12,
            }}>
              Comment ca marche
            </div>
            {[
              { step: '1', text: 'Choisis un mode de jeu' },
              { step: '2', text: 'Configure et cree ta partie' },
              { step: '3', text: 'Partage le code a tes amis' },
              { step: '4', text: 'La partie demarre quand le lobby est plein' },
            ].map(({ step, text }) => (
              <div key={step} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: '#7c3aed15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#7c3aed',
                  flexShrink: 0,
                }}>
                  {step}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

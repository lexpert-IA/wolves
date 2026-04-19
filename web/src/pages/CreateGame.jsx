import React, { useState, useMemo } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

/* ── SVG Icons ── */
const MoonIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
  </svg>
);
const SkullIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="8"/><path d="M8 22h8"/><path d="M9 14l-1 8"/><path d="M15 14l1 8"/>
    <circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
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

/* ── Game modes ── */
const GAME_MODES = [
  {
    id: 'pleine-lune',
    name: 'Pleine Lune',
    desc: 'Classique',
    players: 8,
    wolves: 2,
    color: '#7c3aed',
    icon: MoonIcon,
    available: true,
  },
  {
    id: 'village-maudit',
    name: 'Village Maudit',
    desc: 'Chaos',
    players: 8,
    wolves: 3,
    color: '#2563eb',
    icon: SkullIcon,
    available: false,
  },
  {
    id: 'nuit-noire',
    name: 'Nuit Noire',
    desc: 'Hardcore, votes aveugles',
    players: 8,
    wolves: 2,
    color: '#dc2626',
    icon: EyeOffIcon,
    available: false,
  },
  {
    id: 'wolf-hunt',
    name: 'Wolf Hunt',
    desc: 'Rapide, 3 min',
    players: 4,
    wolves: 1,
    color: '#f59e0b',
    icon: BoltIcon,
    available: false,
    badge: 'GAME CHANGER',
  },
];

/* ── Fake lobbies ── */
const FAKE_LOBBIES = [
  { id: 1, mode: 'Pleine Lune', color: '#7c3aed', host: 'wolf_hunter42', current: 5, max: 8 },
  { id: 2, mode: 'Pleine Lune', color: '#7c3aed', host: 'crypto_moon', current: 3, max: 8 },
  { id: 3, mode: 'Pleine Lune', color: '#7c3aed', host: 'night_owl', current: 7, max: 8 },
];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ── Mode Card ── */
function ModeCard({ mode, selected, onSelect, isMobile }) {
  const isSelected = selected === mode.id;
  const disabled = !mode.available;

  return (
    <button
      onClick={() => mode.available && onSelect(mode.id)}
      disabled={disabled}
      style={{
        position: 'relative',
        border: isSelected ? `2px solid ${mode.color}` : '2px solid transparent',
        borderRadius: 14,
        background: `linear-gradient(145deg, ${mode.color}18, ${mode.color}08)`,
        padding: isMobile ? 16 : 20,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.25s ease',
        textAlign: 'left',
        width: '100%',
        outline: 'none',
        boxShadow: isSelected ? `0 0 20px ${mode.color}33` : 'none',
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.background = `linear-gradient(145deg, ${mode.color}28, ${mode.color}12)`;
      }}
      onMouseLeave={e => {
        if (!disabled) e.currentTarget.style.background = `linear-gradient(145deg, ${mode.color}18, ${mode.color}08)`;
      }}
    >
      {/* Radio indicator */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        width: 20, height: 20, borderRadius: '50%',
        border: `2px solid ${isSelected ? mode.color : 'var(--text-tertiary)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isSelected && (
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: mode.color }} />
        )}
      </div>

      {/* Badge */}
      {mode.badge && (
        <div style={{
          position: 'absolute', top: -1, left: 16,
          background: mode.color, color: '#000', fontWeight: 800,
          fontSize: 9, padding: '2px 8px', borderRadius: '0 0 6px 6px',
          letterSpacing: '0.5px', textTransform: 'uppercase',
        }}>
          {mode.badge}
        </div>
      )}

      {/* Coming soon badge */}
      {!mode.available && (
        <div style={{
          position: 'absolute', top: -1, left: 16,
          background: 'var(--text-tertiary)', color: 'var(--bg-primary)',
          fontWeight: 700, fontSize: 9, padding: '2px 8px',
          borderRadius: '0 0 6px 6px', letterSpacing: '0.5px',
        }}>
          COMING SOON
        </div>
      )}

      <div style={{ color: mode.color, marginBottom: 10 }}>
        <mode.icon />
      </div>
      <div style={{
        fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
        fontSize: 16, color: 'var(--text-primary)', marginBottom: 4,
      }}>
        {mode.name}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
        {mode.desc}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--text-tertiary)',
      }}>
        <UsersIcon size={14} />
        <span>{mode.players} joueurs</span>
        <span style={{ margin: '0 4px', opacity: 0.4 }}>|</span>
        <span>{mode.wolves} loup{mode.wolves > 1 ? 's' : ''}</span>
      </div>
    </button>
  );
}

/* ── Config Panel ── */
function ConfigPanel({ isMobile }) {
  const [playerCount, setPlayerCount] = useState(8);
  const [minBet, setMinBet] = useState('10');
  const [isPrivate, setIsPrivate] = useState(true);
  const [survivorPool, setSurvivorPool] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const inviteCode = useMemo(() => generateCode(), []);

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

  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
    marginBottom: 8, display: 'block',
  };

  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid var(--border-primary)',
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 14,
      padding: isMobile ? 16 : 24,
      border: '1px solid var(--border-primary)',
    }}>
      <h3 style={{
        fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
        fontSize: 16, color: 'var(--text-primary)', margin: '0 0 20px 0',
      }}>
        Configuration
      </h3>

      {/* Player count */}
      <div style={rowStyle}>
        <span style={labelStyle}>Nombre de joueurs</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {playerOptions.map(n => (
            <button
              key={n}
              onClick={() => setPlayerCount(n)}
              style={{
                width: 40, height: 36, borderRadius: 8,
                border: playerCount === n ? '2px solid #7c3aed' : '1px solid var(--border-primary)',
                background: playerCount === n ? '#7c3aed22' : 'var(--bg-tertiary)',
                color: playerCount === n ? '#7c3aed' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Min bet */}
      <div style={rowStyle}>
        <span style={labelStyle}>Mise minimum (W$)</span>
        <input
          type="number"
          value={minBet}
          onChange={e => setMinBet(e.target.value)}
          style={{
            width: 90, padding: '8px 12px', borderRadius: 8,
            border: '1px solid var(--border-primary)',
            background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
            fontSize: 14, fontWeight: 600, textAlign: 'right',
            outline: 'none',
          }}
          min="1"
        />
      </div>

      {/* Private toggle */}
      <div style={rowStyle}>
        <span style={labelStyle}>Partie privee</span>
        <button
          onClick={() => setIsPrivate(!isPrivate)}
          style={{
            width: 48, height: 26, borderRadius: 13, border: 'none',
            background: isPrivate ? '#7c3aed' : 'var(--bg-tertiary)',
            cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: '#fff',
            position: 'absolute', top: 3,
            left: isPrivate ? 25 : 3,
            transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {/* Invite code */}
      {isPrivate && (
        <div style={{ ...rowStyle, flexWrap: 'wrap', gap: 8 }}>
          <span style={labelStyle}>Code d'invitation</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '8px 14px', borderRadius: 8,
              background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
              fontFamily: 'monospace', fontSize: 16, fontWeight: 700,
              color: '#7c3aed', letterSpacing: '2px',
            }}>
              {inviteCode}
            </div>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 12px', borderRadius: 8, border: 'none',
                background: copied ? '#059669' : 'var(--bg-tertiary)',
                color: copied ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <CopyIcon />
              {copied ? 'Copie !' : 'Copier'}
            </button>
          </div>
        </div>
      )}

      {/* Survivor pool */}
      <div style={{ ...rowStyle, borderBottom: 'none' }}>
        <div>
          <span style={{ ...labelStyle, marginBottom: 2 }}>Survivor Pool</span>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', maxWidth: 220 }}>
            Le gagnant rafle tout. Les mises vont dans un pot, le meilleur predicteur gagne.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, color: '#f59e0b',
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            GAME CHANGER
          </span>
          <button
            onClick={() => setSurvivorPool(!survivorPool)}
            style={{
              width: 48, height: 26, borderRadius: 13, border: 'none',
              background: survivorPool ? '#7c3aed' : 'var(--bg-tertiary)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: survivorPool ? 25 : 3,
              transition: 'left 0.2s',
            }} />
          </button>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCreate}
        style={{
          width: '100%', marginTop: 20, padding: '14px 0',
          borderRadius: 10, border: 'none',
          background: '#7c3aed',
          color: '#fff', fontFamily: "'Orbitron', sans-serif",
          fontWeight: 700, fontSize: 15, cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        Creer la partie
      </button>

      {showMessage && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 8,
          background: '#7c3aed18', border: '1px solid #7c3aed44',
          fontSize: 13, color: '#a78bfa', textAlign: 'center',
        }}>
          Fonctionnalite en cours de developpement
        </div>
      )}
    </div>
  );
}

/* ── Lobby Card ── */
function LobbyCard({ lobby }) {
  const fillPercent = (lobby.current / lobby.max) * 100;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px', borderRadius: 10,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-primary)',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed44'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; }}
    >
      {/* Mode dot */}
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `linear-gradient(135deg, ${lobby.color}, ${lobby.color}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <MoonIcon />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          {lobby.mode}
          <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: 8, fontSize: 12 }}>
            par {lobby.host}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1, height: 4, borderRadius: 2, background: 'var(--bg-tertiary)',
            maxWidth: 100,
          }}>
            <div style={{
              width: `${fillPercent}%`, height: '100%', borderRadius: 2,
              background: fillPercent >= 80 ? '#f59e0b' : '#7c3aed',
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
        padding: '6px 14px', borderRadius: 8, border: 'none',
        background: '#7c3aed22', color: '#a78bfa',
        fontWeight: 700, fontSize: 12, cursor: 'pointer',
        transition: 'all 0.2s', flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed22'; e.currentTarget.style.color = '#a78bfa'; }}
      >
        Rejoindre
      </button>
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
      padding: isMobile ? '24px 16px' : '40px 32px',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isMobile ? 24 : 32,
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: '0 0 8px 0',
          color: '#fff',
        }}>
          Creer une partie
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--text-secondary)',
          margin: 0, lineHeight: 1.5, maxWidth: 520,
        }}>
          Invite tes amis et jouez ensemble. Choisis le mode, configure les regles, et lance la partie.
        </p>
      </div>

      {/* Main layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
        gap: 24,
        alignItems: 'start',
      }}>
        {/* Left column */}
        <div>
          {/* Mode selector */}
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 14, fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase', letterSpacing: '1px',
            margin: '0 0 16px 0',
          }}>
            Choisis ton mode
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 12,
            marginBottom: 28,
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

          {/* Config panel — only when mode selected */}
          {selectedMode && <ConfigPanel isMobile={isMobile} />}
        </div>

        {/* Right column / bottom on mobile — Lobbies */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 16,
          }}>
            <TrophyIcon />
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 14, fontWeight: 700,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '1px',
              margin: 0,
            }}>
              Parties en attente
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAKE_LOBBIES.map(lobby => (
              <LobbyCard key={lobby.id} lobby={lobby} />
            ))}
          </div>

          {/* Empty state hint */}
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 10,
            background: 'var(--bg-secondary)',
            border: '1px dashed var(--border-primary)',
            fontSize: 12, color: 'var(--text-tertiary)',
            textAlign: 'center', lineHeight: 1.5,
          }}>
            Cree ta propre partie ou rejoins un lobby. Les parties se lancent automatiquement quand le lobby est plein.
          </div>
        </div>
      </div>
    </div>
  );
}

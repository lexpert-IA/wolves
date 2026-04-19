import React, { useState, useMemo, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../hooks/useAuth';

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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);
const UsersIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const PlayIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const LogInIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const HashIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

/* ── Constants ── */
const MIN_BET = 10;

/* ── Game modes ── */
const GAME_MODES = [
  {
    id: 'pleine-lune', name: 'Pleine Lune', tagline: 'Le classique',
    desc: '2 loups infiltres parmi 6 villageois. Debats, votes, elimination.',
    players: 8, wolves: 2, duration: '~15 min',
    color: '#7c3aed', icon: MoonIcon, available: true, popular: true,
  },
  {
    id: 'village-maudit', name: 'Village Maudit', tagline: 'Le chaos',
    desc: '3 loups, roles speciaux, retournements de situation.',
    players: 8, wolves: 3, duration: '~20 min',
    color: '#2563eb', icon: SkullIcon, available: false,
  },
  {
    id: 'nuit-noire', name: 'Nuit Noire', tagline: 'Hardcore',
    desc: 'Votes aveugles — personne ne voit qui vote pour qui.',
    players: 8, wolves: 2, duration: '~18 min',
    color: '#dc2626', icon: EyeOffIcon, available: false,
  },
  {
    id: 'wolf-hunt', name: 'Wolf Hunt', tagline: 'Speed run',
    desc: '4 joueurs, 1 loup, 3 minutes. Instinct pur.',
    players: 4, wolves: 1, duration: '~3 min',
    color: '#f59e0b', icon: BoltIcon, available: false, badge: 'BIENTOT',
  },
];

/* ── Fake lobbies for demo ── */
const FAKE_LOBBIES = [
  { id: 'L1', mode: 'pleine-lune', host: 'wolf_hunter42', current: 5, max: 8, bet: 10 },
  { id: 'L2', mode: 'pleine-lune', host: 'crypto_moon', current: 3, max: 8, bet: 25 },
  { id: 'L3', mode: 'pleine-lune', host: 'night_owl', current: 7, max: 8, bet: 50 },
];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ── Tab buttons ── */
function TabButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 700,
      cursor: 'pointer', border: 'none', transition: 'all 0.15s',
      background: active ? '#7c3aed' : 'rgba(255,255,255,0.04)',
      color: active ? '#fff' : 'var(--text-tertiary)',
    }}>
      {children}
    </button>
  );
}

/* ── Mode Card ── */
function ModeCard({ mode, selected, onSelect }) {
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
        position: 'relative', width: '100%', textAlign: 'left', outline: 'none',
        border: isSelected ? `2px solid ${mode.color}` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, overflow: 'hidden',
        background: isSelected ? `${mode.color}10` : hovered && !disabled ? 'rgba(255,255,255,0.03)' : 'var(--bg-secondary)',
        padding: 0, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', filter: disabled ? 'grayscale(0.5)' : 'none',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Top bar */}
      <div style={{ height: 3, background: mode.color, opacity: isSelected ? 1 : 0.3 }} />

      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Icon */}
          <div style={{
            width: 46, height: 46, borderRadius: 10, flexShrink: 0,
            background: `${mode.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: mode.color,
          }}>
            {disabled ? <LockIcon size={22} /> : <mode.icon size={24} />}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                {mode.name}
              </span>
              {mode.popular && (
                <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 3, background: '#22c55e20', color: '#22c55e' }}>POPULAIRE</span>
              )}
              {mode.badge && (
                <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 3, background: `${mode.color}20`, color: mode.color }}>{mode.badge}</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8, lineHeight: 1.4 }}>
              {mode.desc}
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-tertiary)' }}>
              <span style={{ padding: '3px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.04)' }}>
                {mode.players} joueurs
              </span>
              <span style={{ padding: '3px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.04)' }}>
                {mode.wolves} loup{mode.wolves > 1 ? 's' : ''}
              </span>
              <span style={{ padding: '3px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.04)' }}>
                {mode.duration}
              </span>
            </div>
          </div>

          {/* Radio */}
          {mode.available && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${isSelected ? mode.color : 'rgba(255,255,255,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: mode.color }} />}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════
   TAB 1 — CREER UNE PARTIE
   ══════════════════════════════════════════ */
function CreateTab({ user, openAuth, isMobile }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [step, setStep] = useState(1); // 1 = choose mode, 2 = configure, 3 = lobby ready
  const [playerCount, setPlayerCount] = useState(8);
  const [betAmount, setBetAmount] = useState('10');
  const [isPrivate, setIsPrivate] = useState(true);
  const [survivorPool, setSurvivorPool] = useState(false);
  const [copied, setCopied] = useState(false);
  const inviteCode = useMemo(() => generateCode(), []);

  const mode = GAME_MODES.find(m => m.id === selectedMode);
  const betNum = Math.max(MIN_BET, parseInt(betAmount) || MIN_BET);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectMode = (id) => {
    setSelectedMode(id);
    setStep(2);
  };

  const handleCreate = () => {
    if (!user) { openAuth(); return; }
    setStep(3);
  };

  const betPresets = [10, 25, 50, 100];

  // ── Step 1: Choose mode ──
  if (step === 1) {
    return (
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>
          1. Choisis ton mode de jeu
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GAME_MODES.map(m => (
            <ModeCard key={m.id} mode={m} selected={selectedMode} onSelect={handleSelectMode} />
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2: Configure ──
  if (step === 2) {
    return (
      <div>
        {/* Back + mode indicator */}
        <button onClick={() => { setStep(1); setSelectedMode(null); }} style={{
          background: 'none', border: 'none', color: 'var(--text-tertiary)',
          fontSize: 12, cursor: 'pointer', padding: 0, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          ← Changer de mode
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
          padding: '14px 16px', borderRadius: 12, background: `${mode.color}10`,
          border: `1px solid ${mode.color}30`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: `${mode.color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: mode.color,
          }}>
            <mode.icon size={22} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{mode.name}</div>
            <div style={{ fontSize: 12, color: mode.color }}>{mode.tagline}</div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>
          2. Configure ta partie
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {/* Nombre de joueurs */}
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
              Nombre de joueurs
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[4, 6, 8].map(n => (
                <button key={n} onClick={() => setPlayerCount(n)} style={{
                  flex: 1, height: 40, borderRadius: 10,
                  border: playerCount === n ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
                  background: playerCount === n ? '#7c3aed12' : 'transparent',
                  color: playerCount === n ? '#a78bfa' : 'var(--text-tertiary)',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Mise par joueur — MINIMUM $10 */}
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Mise par joueur
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  Minimum {MIN_BET}$ — Chaque joueur mise ce montant pour entrer
                </div>
              </div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 800, color: '#a78bfa' }}>
                {betNum}$
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {betPresets.map(a => (
                <button key={a} onClick={() => setBetAmount(String(a))} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8,
                  border: betNum === a ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
                  background: betNum === a ? '#7c3aed12' : 'transparent',
                  color: betNum === a ? '#a78bfa' : 'var(--text-tertiary)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {a}$
                </button>
              ))}
            </div>
            {/* Pot total estimé */}
            <div style={{
              marginTop: 10, padding: '8px 12px', borderRadius: 8,
              background: 'rgba(124,58,237,0.06)', textAlign: 'center',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Pot total estime : </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa' }}>{betNum * playerCount}$</span>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Partie privee</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>Code invite necessaire pour rejoindre</div>
            </div>
            <button onClick={() => setIsPrivate(!isPrivate)} style={{
              width: 44, height: 24, borderRadius: 12, border: 'none',
              background: isPrivate ? '#7c3aed' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: isPrivate ? 23 : 3, transition: 'left 0.2s' }} />
            </button>
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Survivor Pool</span>
                <span style={{ fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3, background: '#f59e0b20', color: '#f59e0b' }}>NEW</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1, maxWidth: 220 }}>Le meilleur predicteur remporte tout le pot</div>
            </div>
            <button onClick={() => setSurvivorPool(!survivorPool)} style={{
              width: 44, height: 24, borderRadius: 12, border: 'none',
              background: survivorPool ? '#7c3aed' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: survivorPool ? 23 : 3, transition: 'left 0.2s' }} />
            </button>
          </div>
        </div>

        {/* Recap + CTA */}
        <div style={{
          marginTop: 20, padding: '16px', borderRadius: 14,
          background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Recap
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Mode', value: mode?.name },
              { label: 'Joueurs', value: playerCount },
              { label: 'Mise/joueur', value: `${betNum}$` },
              { label: 'Pot total', value: `${betNum * playerCount}$` },
              { label: 'Type', value: isPrivate ? 'Privee' : 'Publique' },
              survivorPool && { label: 'Survivor', value: 'Actif' },
            ].filter(Boolean).map(({ label, value }) => (
              <div key={label} style={{
                padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
                fontSize: 11, color: 'var(--text-tertiary)',
              }}>
                <span style={{ fontWeight: 400 }}>{label}: </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>

          {!user ? (
            <button onClick={openAuth} style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: '#7c3aed', color: '#fff',
              fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <LogInIcon size={16} />
              Connecte-toi pour creer
            </button>
          ) : (
            <button onClick={handleCreate} style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: '#7c3aed', color: '#fff',
              fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <PlayIcon size={16} />
              Creer la partie — {betNum}$ pour entrer
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Step 3: Lobby cree — en attente de joueurs ──
  return (
    <div>
      <div style={{
        textAlign: 'center', padding: '24px 16px',
        background: 'var(--bg-secondary)', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Checkmark */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
          background: '#22c55e18', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Partie creee !
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 20 }}>
          {mode?.name} · {playerCount} joueurs · {betNum}$ par joueur
        </div>

        {/* Code invite — style Among Us */}
        <div style={{
          padding: '20px', borderRadius: 14, marginBottom: 16,
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Code invite
          </div>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontSize: isMobile ? 28 : 36, fontWeight: 900,
            color: '#a78bfa', letterSpacing: '8px', marginBottom: 12,
          }}>
            {inviteCode}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 14 }}>
            Partage ce code a tes amis pour qu'ils rejoignent
          </div>
          <button onClick={handleCopy} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: copied ? '#059669' : '#7c3aed',
            color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s',
          }}>
            <CopyIcon />
            {copied ? 'Code copie !' : 'Copier le code'}
          </button>
        </div>

        {/* Waiting for players */}
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>En attente de joueurs...</span>
          </div>
          <div style={{
            height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${(1 / playerCount) * 100}%`, height: '100%', borderRadius: 3,
              background: '#7c3aed', transition: 'width 0.3s',
            }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>
            1/{playerCount} joueurs — La partie se lance quand le lobby est plein
          </div>
        </div>

        {/* Info: toi = créateur, toi seul lance */}
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 8,
          background: 'rgba(124,58,237,0.06)', fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5,
        }}>
          Tu es le createur de cette partie. Une fois le lobby plein, toi seul peux lancer la partie.
        </div>

        <button onClick={() => { setStep(1); setSelectedMode(null); }} style={{
          marginTop: 16, background: 'none', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '10px 20px', color: 'var(--text-tertiary)',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          Creer une autre partie
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TAB 2 — REJOINDRE UNE PARTIE
   ══════════════════════════════════════════ */
function JoinTab({ user, openAuth, isMobile }) {
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleJoinByCode = () => {
    if (!user) { openAuth(); return; }
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) { setJoinError('Le code doit faire 6 caracteres'); return; }
    // TODO: connect to backend — POST /api/games/join { code }
    setJoinError('Connexion backend requise — bientot disponible');
  };

  const handleJoinLobby = (lobbyId) => {
    if (!user) { openAuth(); return; }
    // TODO: connect to backend — POST /api/games/join { lobbyId }
    window.location.href = `/lobby/${lobbyId}`;
  };

  return (
    <div>
      {/* Join by code */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>
        Rejoindre avec un code
      </div>

      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)', padding: '20px 16px',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)', pointerEvents: 'none',
            }}>
              <HashIcon size={16} />
            </div>
            <input
              type="text"
              value={joinCode}
              onChange={e => { setJoinCode(e.target.value.toUpperCase().slice(0, 6)); setJoinError(''); }}
              placeholder="CODE"
              maxLength={6}
              style={{
                width: '100%', padding: '12px 12px 12px 36px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-primary)',
                color: '#fff', fontFamily: "'Orbitron', monospace",
                fontSize: 18, fontWeight: 800, letterSpacing: '4px',
                outline: 'none', textTransform: 'uppercase',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
          <button onClick={handleJoinByCode} style={{
            padding: '12px 20px', borderRadius: 10, border: 'none',
            background: joinCode.length === 6 ? '#7c3aed' : 'rgba(255,255,255,0.06)',
            color: joinCode.length === 6 ? '#fff' : 'var(--text-tertiary)',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            {user ? 'Rejoindre' : 'Se connecter'}
          </button>
        </div>
        {joinError && (
          <div style={{ fontSize: 11, color: '#ef4444', marginTop: 8 }}>{joinError}</div>
        )}
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 10 }}>
          Demande le code a 6 caracteres au createur de la partie.
        </div>
      </div>

      {/* Browse public lobbies */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>
        Parties publiques en attente
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FAKE_LOBBIES.map(lobby => {
          const modeData = GAME_MODES.find(m => m.id === lobby.mode) || GAME_MODES[0];
          const fillPercent = (lobby.current / lobby.max) * 100;
          const almostFull = lobby.current >= lobby.max - 1;

          return (
            <div key={lobby.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', borderRadius: 12,
              background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.15s',
            }}>
              {/* Mode icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${modeData.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: modeData.color, flexShrink: 0,
              }}>
                <modeData.icon size={20} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{lobby.host}</span>
                  {almostFull && (
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: '#f59e0b20', color: '#f59e0b' }}>BIENTOT PLEIN</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', maxWidth: 100 }}>
                    <div style={{ width: `${fillPercent}%`, height: '100%', borderRadius: 2, background: almostFull ? '#f59e0b' : modeData.color }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>{lobby.current}/{lobby.max}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>·</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>{lobby.bet}$</span>
                </div>
              </div>

              {/* Join */}
              <button onClick={() => handleJoinLobby(lobby.id)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: '#7c3aed18', color: '#a78bfa',
                fontWeight: 700, fontSize: 12, cursor: 'pointer',
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed18'; e.currentTarget.style.color = '#a78bfa'; }}
              >
                {user ? `Rejoindre · ${lobby.bet}$` : 'Se connecter'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {FAKE_LOBBIES.length === 0 && (
        <div style={{
          textAlign: 'center', padding: 32, color: 'var(--text-tertiary)', fontSize: 13,
          background: 'var(--bg-secondary)', borderRadius: 14,
          border: '1px dashed rgba(255,255,255,0.08)',
        }}>
          Aucune partie publique pour le moment. Cree la tienne !
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════ */
export default function CreateGame() {
  const isMobile = useIsMobile();
  const { user, openAuth } = useAuth();
  const [tab, setTab] = useState('create');

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      padding: isMobile ? '20px 16px' : '32px 24px',
      maxWidth: 680, margin: '0 auto',
    }}>
      {/* Header */}
      <h1 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: isMobile ? 22 : 26, fontWeight: 800,
        color: '#fff', margin: '0 0 4px 0',
      }}>
        Jouer
      </h1>
      <p style={{
        fontSize: 13, color: 'var(--text-tertiary)',
        margin: '0 0 20px 0',
      }}>
        Cree ta propre partie ou rejoins un lobby existant.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, padding: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
        <TabButton active={tab === 'create'} onClick={() => setTab('create')}>
          Creer une partie
        </TabButton>
        <TabButton active={tab === 'join'} onClick={() => setTab('join')}>
          Rejoindre
        </TabButton>
      </div>

      {/* Content */}
      {tab === 'create' && <CreateTab user={user} openAuth={openAuth} isMobile={isMobile} />}
      {tab === 'join' && <JoinTab user={user} openAuth={openAuth} isMobile={isMobile} />}

      {/* How it works — bottom */}
      <div style={{
        marginTop: 32, padding: '16px', borderRadius: 14,
        background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14 }}>
          Comment ca marche
        </div>
        {[
          { n: '1', text: 'Cree une partie ou rejoins avec un code invite' },
          { n: '2', text: `Chaque joueur mise au minimum ${MIN_BET}$ pour entrer dans le lobby` },
          { n: '3', text: 'Le lobby se remplit — le createur lance quand c\'est pret' },
          { n: '4', text: 'Les loups et villageois sont distribues au hasard par l\'IA' },
          { n: '5', text: 'Les gagnants se partagent le pot total de la partie' },
        ].map(({ n, text }) => (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: '#7c3aed12', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#7c3aed',
            }}>{n}</div>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

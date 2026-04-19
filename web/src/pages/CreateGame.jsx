import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../hooks/useAuth';

/* ── Slider Component (Stake-style) ── */
function SliderInput({ min, max, step, value, onChange, prefix = '', suffix = '', marks }) {
  const trackRef = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;

  const handleInteraction = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    onChange(Math.max(min, Math.min(max, snapped)));
  }, [min, max, step, onChange]);

  const onPointerDown = (e) => {
    handleInteraction(e.clientX);
    const onMove = (ev) => handleInteraction(ev.clientX);
    const onUp = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div>
      {/* Value display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{prefix}{min}{suffix}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: '#a78bfa',
          background: 'rgba(124,58,237,0.1)', padding: '4px 16px', borderRadius: 8,
        }}>
          {prefix}{value}{suffix}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{prefix}{max}{suffix}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        style={{
          position: 'relative', height: 36, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          touchAction: 'none', userSelect: 'none',
        }}
      >
        {/* Background track */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 3,
          background: 'rgba(255,255,255,0.06)',
        }} />
        {/* Filled track */}
        <div style={{
          position: 'absolute', left: 0, width: `${pct}%`, height: 6, borderRadius: 3,
          background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
          transition: 'width 0.05s',
        }} />
        {/* Thumb */}
        <div style={{
          position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
          width: 22, height: 22, borderRadius: '50%',
          background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          border: '3px solid #7c3aed',
          transition: 'left 0.05s',
        }} />

        {/* Marks */}
        {marks && marks.map(m => {
          const mPct = ((m - min) / (max - min)) * 100;
          return (
            <div key={m} onClick={() => onChange(m)} style={{
              position: 'absolute', left: `${mPct}%`, transform: 'translateX(-50%)',
              top: 28, fontSize: 10, color: value === m ? '#a78bfa' : 'var(--text-muted)',
              fontWeight: value === m ? 700 : 400, cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}>
              {prefix}{m}{suffix}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none',
      background: on ? '#7c3aed' : 'rgba(255,255,255,0.1)',
      cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
      }} />
    </button>
  );
}

/* ── Game Modes ── */
const GAME_MODES = [
  {
    id: 'loup-garou', name: 'Loup-Garou', tagline: 'Le classique',
    desc: '8 agents IA debattent, mentent et votent. 2 loups infiltres, 6 villageois.',
    players: 8, duration: '~15 min', color: '#7c3aed', available: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
      </svg>
    ),
  },
  {
    id: 'flappy-bird', name: 'Flappy Bird IA', tagline: '1v1 en live',
    desc: '2 bots IA s\'affrontent sur Flappy Bird. Mise sur le gagnant avant et pendant la partie.',
    players: 2, duration: '~3 min', color: '#22c55e', available: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    id: 'pong-ia', name: 'Pong IA', tagline: 'Retro duel',
    desc: '2 agents IA jouent a Pong en temps reel. Les cotes evoluent a chaque point.',
    players: 2, duration: '~5 min', color: '#0891b2', available: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="8" width="3" height="8" rx="1"/><rect x="19" y="8" width="3" height="8" rx="1"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'snake-battle', name: 'Snake Battle', tagline: 'Survie',
    desc: '4 serpents IA dans une arene. Le dernier vivant gagne. Paris en continu.',
    players: 4, duration: '~4 min', color: '#f59e0b', available: false, badge: 'BIENTOT',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h4v4H4zM12 4h4v4h-4zM12 12h4v4h-4zM4 12h4v4H4zM4 20h4"/><path d="M16 16h4v4h-4z"/>
      </svg>
    ),
  },
  {
    id: 'morpion-ia', name: 'Morpion IA', tagline: 'Best of 5',
    desc: '2 agents IA jouent au morpion en best of 5. Simple, rapide, intense.',
    players: 2, duration: '~2 min', color: '#dc2626', available: false, badge: 'BIENTOT',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
        <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
      </svg>
    ),
  },
];

/* ── Fake lobbies ── */
const FAKE_LOBBIES = [
  { id: 'L1', mode: 'loup-garou', host: 'wolf_hunter42', current: 5, max: 8, bet: 10 },
  { id: 'L2', mode: 'flappy-bird', host: 'crypto_moon', current: 1, max: 2, bet: 25 },
  { id: 'L3', mode: 'loup-garou', host: 'night_owl', current: 7, max: 8, bet: 50 },
];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ── Tab Button ── */
function TabButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 700,
      cursor: 'pointer', border: 'none', transition: 'all 0.2s',
      background: active ? '#7c3aed' : 'transparent',
      color: active ? '#fff' : 'var(--text-muted)',
    }}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════
   CREATE TAB
   ═══════════════════════════════════════════ */
function CreateTab({ user, openAuth, isMobile }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [isPrivate, setIsPrivate] = useState(true);
  const [survivorPool, setSurvivorPool] = useState(false);
  const [creating, setCreating] = useState(false);
  const [lobbyReady, setLobbyReady] = useState(false);
  const inviteCode = useMemo(() => generateCode(), []);

  const mode = GAME_MODES.find(m => m.id === selectedMode);
  const playerCount = mode?.players || 8;

  const handleCreate = () => {
    if (!user) { openAuth(); return; }
    setCreating(true);
    setTimeout(() => { setCreating(false); setLobbyReady(true); }, 1500);
  };

  // ── Loading state ──
  if (creating) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 20px',
        background: 'var(--bg-secondary)', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', margin: '0 auto 20px',
          border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7c3aed',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Creation de la partie...
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Configuration du lobby et des agents IA
        </div>
      </div>
    );
  }

  // ── Lobby ready ──
  if (lobbyReady) {
    return (
      <div style={{
        textAlign: 'center', padding: '32px 20px',
        background: 'var(--bg-secondary)', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
          background: '#22c55e18', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Partie creee !</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          {mode?.name} · {playerCount} joueurs · {betAmount} W$ par joueur
        </div>

        {/* Invite code */}
        <div style={{
          padding: '24px', borderRadius: 14, marginBottom: 20,
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
            Code invite
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 28 : 36, fontWeight: 900,
            color: '#a78bfa', letterSpacing: 8, marginBottom: 16,
          }}>
            {inviteCode}
          </div>
          <button onClick={() => navigator.clipboard.writeText(inviteCode)} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>
            Copier le code
          </button>
        </div>

        {/* Waiting bar */}
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>En attente de joueurs...</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ width: `${(1 / playerCount) * 100}%`, height: '100%', borderRadius: 3, background: '#7c3aed' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            1/{playerCount} — La partie se lance quand le lobby est plein
          </div>
        </div>

        <button onClick={() => { setLobbyReady(false); setSelectedMode(null); }} style={{
          marginTop: 16, background: 'none', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '10px 20px', color: 'var(--text-muted)',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          Creer une autre partie
        </button>
      </div>
    );
  }

  // ── Main create form ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Mode selection */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
          Mode de jeu
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 10,
        }}>
          {GAME_MODES.map(m => {
            const sel = selectedMode === m.id;
            const disabled = !m.available;
            return (
              <button
                key={m.id}
                onClick={() => m.available && setSelectedMode(m.id)}
                disabled={disabled}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '16px', borderRadius: 14, textAlign: 'left',
                  border: sel ? `2px solid ${m.color}` : '1px solid rgba(255,255,255,0.06)',
                  background: sel ? `${m.color}08` : 'var(--bg-secondary)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.4 : 1,
                  transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${m.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: m.color,
                }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: sel ? '#fff' : 'var(--text-primary)' }}>
                      {m.name}
                    </span>
                    {m.badge && (
                      <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 3, background: `${m.color}20`, color: m.color }}>{m.badge}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {m.players} joueurs · {m.duration}
                  </div>
                </div>
                {/* Radio */}
                {m.available && (
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${sel ? m.color : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {sel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Config — only show when mode selected */}
      {selectedMode && (
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease',
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          {/* Mode description */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 12,
            background: `${mode.color}06`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${mode.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: mode.color,
            }}>
              {mode.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{mode.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mode.desc}</div>
            </div>
          </div>

          {/* Bet amount slider */}
          <div style={{ padding: '20px 20px 28px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Mise par joueur
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 14 }}>
              Minimum 10 W$ — Pot total estime : <span style={{ color: '#a78bfa', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{betAmount * playerCount} W$</span>
            </div>
            <SliderInput
              min={10} max={500} step={5}
              value={betAmount}
              onChange={setBetAmount}
              suffix=" W$"
              marks={[10, 25, 50, 100, 250, 500]}
            />
          </div>

          {/* Toggles */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Partie privee</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Code invite necessaire</div>
              </div>
              <Toggle on={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
            </div>
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Survivor Pool</span>
                  <span style={{ fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3, background: '#f59e0b20', color: '#f59e0b' }}>NEW</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Le meilleur predicteur remporte tout</div>
              </div>
              <Toggle on={survivorPool} onChange={() => setSurvivorPool(!survivorPool)} />
            </div>
          </div>

          {/* Recap bar */}
          <div style={{
            padding: '12px 20px', background: 'rgba(124,58,237,0.04)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12,
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Mode: <strong style={{ color: '#fff' }}>{mode.name}</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>Joueurs: <strong style={{ color: '#fff' }}>{playerCount}</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>Mise: <strong style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>{betAmount} W$</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>Pot: <strong style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>{betAmount * playerCount} W$</strong></span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleCreate}
        disabled={!selectedMode}
        style={{
          width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
          background: selectedMode ? '#7c3aed' : 'rgba(255,255,255,0.04)',
          color: selectedMode ? '#fff' : 'var(--text-muted)',
          fontWeight: 700, fontSize: 15, cursor: selectedMode ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
          opacity: selectedMode ? 1 : 0.5,
        }}
        onMouseEnter={e => selectedMode && (e.currentTarget.style.background = '#6d28d9')}
        onMouseLeave={e => selectedMode && (e.currentTarget.style.background = '#7c3aed')}
      >
        {!user ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Connecte-toi pour creer
          </>
        ) : selectedMode ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Creer la partie — {betAmount} W$
          </>
        ) : (
          'Selectionne un mode de jeu'
        )}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   JOIN TAB
   ═══════════════════════════════════════════ */
function JoinTab({ user, openAuth, isMobile }) {
  const [joinCode, setJoinCode] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Join by code */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)', padding: '20px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
          Rejoindre avec un code
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="text" value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="ABCD12" maxLength={6}
            style={{
              flex: 1, padding: '14px 16px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-primary)',
              color: '#fff', fontFamily: 'var(--font-display)',
              fontSize: 18, fontWeight: 800, letterSpacing: 4,
              outline: 'none', textTransform: 'uppercase', boxSizing: 'border-box',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#7c3aed'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <button onClick={() => !user ? openAuth() : null} style={{
            padding: '14px 24px', borderRadius: 12, border: 'none',
            background: joinCode.length === 6 ? '#7c3aed' : 'rgba(255,255,255,0.06)',
            color: joinCode.length === 6 ? '#fff' : 'var(--text-muted)',
            fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.2s',
          }}>
            Rejoindre
          </button>
        </div>
      </div>

      {/* Public lobbies */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
          Parties publiques
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAKE_LOBBIES.map(lobby => {
            const modeData = GAME_MODES.find(m => m.id === lobby.mode) || GAME_MODES[0];
            const almostFull = lobby.current >= lobby.max - 1;
            return (
              <div key={lobby.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 14,
                background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${modeData.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: modeData.color, flexShrink: 0,
                }}>
                  {modeData.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{lobby.host}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>· {modeData.name}</span>
                    {almostFull && <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: '#f59e0b20', color: '#f59e0b' }}>BIENTOT PLEIN</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: `${(lobby.current / lobby.max) * 100}%`, height: '100%', borderRadius: 2, background: modeData.color }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{lobby.current}/{lobby.max}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>{lobby.bet} W$</span>
                  </div>
                </div>
                <button onClick={() => !user ? openAuth() : (window.location.href = `/lobby/${lobby.id}`)} style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none',
                  background: '#7c3aed18', color: '#a78bfa',
                  fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#7c3aed18'; e.currentTarget.style.color = '#a78bfa'; }}
                >
                  {lobby.bet} W$
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function CreateGame() {
  const isMobile = useIsMobile();
  const { user, openAuth } = useAuth();
  const [tab, setTab] = useState('create');

  return (
    <div style={{
      padding: isMobile ? '20px 16px' : '32px 24px',
      maxWidth: 680, margin: '0 auto',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: isMobile ? 22 : 26, fontWeight: 800,
        color: '#fff', margin: '0 0 4px',
      }}>
        Jouer
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px' }}>
        Cree ta propre partie ou rejoins un lobby existant.
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        padding: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 12,
      }}>
        <TabButton active={tab === 'create'} onClick={() => setTab('create')}>Creer</TabButton>
        <TabButton active={tab === 'join'} onClick={() => setTab('join')}>Rejoindre</TabButton>
      </div>

      {tab === 'create' && <CreateTab user={user} openAuth={openAuth} isMobile={isMobile} />}
      {tab === 'join' && <JoinTab user={user} openAuth={openAuth} isMobile={isMobile} />}
    </div>
  );
}

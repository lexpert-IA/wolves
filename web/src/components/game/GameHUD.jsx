import React, { useState, useEffect, useRef } from 'react';

/* ── Phase config ── */
const PHASE = {
  day:     { label: 'JOUR',    color: '#F59E0B', icon: 'sun' },
  vote:    { label: 'VOTE',    color: '#8B5CF6', icon: 'vote' },
  night:   { label: 'NUIT',    color: '#3B82F6', icon: 'moon' },
  waiting: { label: 'ATTENTE', color: '#484F58', icon: 'wait' },
};

/* ── SVG Icons ── */
function PhaseIcon({ type, color, size = 18 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'moon') return <svg {...props}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>;
  if (type === 'vote') return <svg {...props}><path d="M14 9V5a3 3 0 00-6 0v4"/><rect x="2" y="9" width="20" height="12" rx="2"/><circle cx="12" cy="15" r="2"/></svg>;
  if (type === 'sun') return <svg {...props}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
  return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}

/* ── Countdown timer ── */
function useCountdown(durationSec = 120, phase) {
  const [remaining, setRemaining] = useState(durationSec);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setRemaining(durationSec);
  }, [phase, durationSec]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      setRemaining(Math.max(0, durationSec - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [durationSec, phase]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  return { remaining, mins, secs };
}

/* ── Stat box ── */
function StatBox({ label, children, accent }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      minWidth: 0,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '1.5px',
        color: 'var(--text-muted)', textTransform: 'uppercase',
        fontFamily: 'var(--font-body)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px',
        color: accent || 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1,
      }}>
        {children}
      </span>
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return (
    <div style={{
      width: 1, height: 32,
      background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)',
      flexShrink: 0,
    }} />
  );
}

/* ══════════════════════════════════════════
   GameHUD — Phase + Timer + Round + Balance + Players alive
   Style: clean, Polymarket numbers, degage
   ══════════════════════════════════════════ */
export default function GameHUD({ phase = 'waiting', round = 0, balance = 0, players = [], matchId }) {
  const cfg = PHASE[phase] || PHASE.waiting;
  const { mins, secs, remaining } = useCountdown(phase === 'night' ? 90 : phase === 'vote' ? 60 : 120, phase);
  const alive = players.filter(p => p.alive).length;
  const total = players.length || 8;
  const isUrgent = remaining <= 15 && remaining > 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 0, flexWrap: 'wrap',
      padding: '10px 0',
      marginBottom: 8,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '12px 24px',
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
      }}>
        {/* Phase */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `${cfg.color}15`,
            border: `1px solid ${cfg.color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PhaseIcon type={cfg.icon} color={cfg.color} size={16} />
          </div>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '1.5px',
              color: 'var(--text-muted)', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              lineHeight: 1,
            }}>
              Phase
            </div>
            <div style={{
              fontSize: 15, fontWeight: 700, letterSpacing: '2px',
              color: cfg.color,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.3,
            }}>
              {cfg.label}
            </div>
          </div>
        </div>

        <Divider />

        {/* Timer */}
        <StatBox label="Timer" accent={isUrgent ? 'var(--red)' : cfg.color}>
          <span style={{ animation: isUrgent ? 'hud-blink 1s ease-in-out infinite' : 'none' }}>
            {mins}:{secs}
          </span>
        </StatBox>

        <Divider />

        {/* Round */}
        <StatBox label="Round">
          {round > 0 ? round : '-'}
        </StatBox>

        <Divider />

        {/* Alive */}
        <StatBox label="En vie" accent="var(--green)">
          {alive}<span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>/{total}</span>
        </StatBox>

        <Divider />

        {/* Balance */}
        <StatBox label="Balance" accent="#a78bfa">
          {balance.toLocaleString('en-US')}<span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>W$</span>
        </StatBox>
      </div>

      {/* Live indicator */}
      {matchId && (
        <div style={{
          marginLeft: 12,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.15)',
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--red)',
            boxShadow: '0 0 6px var(--red)',
            animation: 'hud-blink 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: 'var(--red)',
            letterSpacing: '1px', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
          }}>
            LIVE
          </span>
        </div>
      )}

      <style>{`
        @keyframes hud-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

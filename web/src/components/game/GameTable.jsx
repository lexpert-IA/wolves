import React from 'react';

/* ── Player avatar colors — consistent per name ── */
const COLORS = ['#7C3AED','#06B6D4','#10B981','#F59E0B','#EF4444','#3B82F6','#EC4899','#8B5CF6'];
function hashColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % COLORS.length;
  return COLORS[Math.abs(h)];
}

/* ── Phase backgrounds ── */
const PHASE_BG = {
  day:   'radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 60%)',
  vote:  'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 60%)',
  night: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 60%)',
};

const PHASE_LABEL = { day: 'Jour', night: 'Nuit', vote: 'Vote' };
const PHASE_COLOR = { day: '#F59E0B', night: '#3B82F6', vote: '#8B5CF6' };

/* ── Single player node ── */
function PlayerNode({ player, isSpeaking, style }) {
  const dead = !player.alive;
  const color = hashColor(player.name);
  const size = isSpeaking ? 56 : 48;

  return (
    <div style={{
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ...style,
    }}>
      {/* Glow ring for speaking */}
      {isSpeaking && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: size + 16, height: size + 16,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          animation: 'arena-pulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Avatar circle */}
      <div style={{
        width: size, height: size,
        borderRadius: '50%',
        background: dead
          ? 'rgba(255,255,255,0.06)'
          : `linear-gradient(135deg, ${color}, ${color}aa)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto',
        border: isSpeaking
          ? `2.5px solid ${color}`
          : dead ? '2px solid rgba(255,255,255,0.08)' : '2px solid rgba(255,255,255,0.12)',
        boxShadow: isSpeaking
          ? `0 0 16px ${color}50, 0 0 32px ${color}20`
          : 'none',
        position: 'relative',
        overflow: 'hidden',
        filter: dead ? 'grayscale(1)' : 'none',
        opacity: dead ? 0.4 : 1,
        transition: 'all 0.3s ease',
      }}>
        {dead ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <span style={{
            fontSize: size * 0.38, fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
          }}>
            {player.name.charAt(0)}
          </span>
        )}

        {/* Inner shadow overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Name label */}
      <div style={{
        marginTop: 6,
        fontSize: 11, fontWeight: isSpeaking ? 700 : 500,
        color: isSpeaking ? color : dead ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        textDecoration: dead ? 'line-through' : 'none',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}>
        {player.name}
      </div>

      {/* Speaking indicator */}
      {isSpeaking && !dead && (
        <div style={{
          display: 'flex', gap: 2, justifyContent: 'center', marginTop: 3,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 3, height: 3, borderRadius: '50%',
              background: color,
              animation: `arena-dot ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main GameTable ── */
export default function GameTable({ players = [], phase = 'day', currentSpeaker }) {
  const count = players.length || 8;

  // Responsive radius — tighter on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const tableSize = isMobile ? 300 : 380;
  const radius = isMobile ? 110 : 145;

  return (
    <div style={{
      position: 'relative',
      width: tableSize, height: tableSize,
      margin: '0 auto',
    }}>
      {/* Background ambient circle */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: PHASE_BG[phase] || PHASE_BG.day,
      }} />

      {/* Table ring */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: radius * 2 + 20, height: radius * 2 + 20,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.04)',
      }} />

      {/* Center content */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        {/* Phase icon */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%', margin: '0 auto 8px',
          background: `${PHASE_COLOR[phase] || '#7C3AED'}12`,
          border: `1px solid ${PHASE_COLOR[phase] || '#7C3AED'}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {phase === 'night' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PHASE_COLOR.night} strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
            </svg>
          ) : phase === 'vote' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PHASE_COLOR.vote} strokeWidth="1.5">
              <path d="M14 9V5a3 3 0 00-6 0v4"/><rect x="2" y="9" width="20" height="12" rx="2"/>
              <circle cx="12" cy="15" r="2"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PHASE_COLOR.day} strokeWidth="1.5">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '2px',
          color: PHASE_COLOR[phase] || 'var(--text-muted)',
          textTransform: 'uppercase',
        }}>
          {PHASE_LABEL[phase] || phase}
        </div>
      </div>

      {/* Players around the circle */}
      {players.map((p, i) => {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2;
        const x = 50 + (radius / (tableSize / 2)) * 50 * Math.cos(angle);
        const y = 50 + (radius / (tableSize / 2)) * 50 * Math.sin(angle);
        const speaking = currentSpeaker === p.name;

        return (
          <PlayerNode
            key={p.name}
            player={p}
            isSpeaking={speaking}
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        );
      })}

      {/* CSS Animations */}
      <style>{`
        @keyframes arena-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes arena-dot {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

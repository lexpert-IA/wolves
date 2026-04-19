import React from 'react';

const AVATAR_COLORS = ['#7C3AED','#06B6D4','#10B981','#F59E0B','#EF4444','#3B82F6','#EC4899','#8B5CF6'];

function hashColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[Math.abs(h)];
}

const phaseBg = {
  day: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
  vote: 'radial-gradient(ellipse at center, rgba(139,148,158,0.06) 0%, transparent 70%)',
  night: 'radial-gradient(ellipse at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
};

export default function GameTable({ players = [], phase = 'day', currentSpeaker }) {
  const count = players.length || 8;
  const radius = Math.min(130, 110);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 360,
      aspectRatio: '1',
      margin: '0 auto',
      background: phaseBg[phase] || phaseBg.day,
      borderRadius: '50%',
    }}>
      {/* Center phase label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 2,
          color: 'var(--text-muted)', textTransform: 'uppercase',
        }}>
          {phase === 'day' ? 'Jour' : phase === 'night' ? 'Nuit' : phase === 'vote' ? 'Vote' : phase}
        </div>
      </div>

      {players.map((p, i) => {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2;
        const x = 50 + (radius / 180) * 100 * Math.cos(angle);
        const y = 50 + (radius / 180) * 100 * Math.sin(angle);
        const isSpeaking = currentSpeaker === p.name;
        const dead = !p.alive;
        const color = hashColor(p.name);

        return (
          <div key={p.name} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: dead ? 0.4 : 1,
            filter: dead ? 'grayscale(1)' : 'none',
            transition: 'opacity 0.3s, filter 0.3s',
          }}>
            {/* Avatar */}
            <div style={{
              width: 42, height: 42,
              borderRadius: '50%',
              background: dead ? 'var(--bg-tertiary)' : color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff',
              margin: '0 auto 4px',
              border: isSpeaking ? `2px solid var(--accent)` : '2px solid transparent',
              boxShadow: isSpeaking ? '0 0 12px var(--accent-glow), 0 0 24px var(--accent-glow)' : 'none',
              animation: isSpeaking ? 'glow-pulse 2s ease-in-out infinite' : 'none',
              position: 'relative',
            }}>
              {dead ? '\u2620' : p.name.charAt(0).toUpperCase()}
            </div>
            {/* Name */}
            <div style={{
              fontSize: 10, fontWeight: 600,
              color: isSpeaking ? 'var(--accent)' : 'var(--text-secondary)',
              maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-body)',
            }}>
              {p.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

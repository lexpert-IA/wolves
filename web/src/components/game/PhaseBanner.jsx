import React, { useState, useEffect, useRef } from 'react';

const phaseConfig = {
  day: { label: 'JOUR', icon: '\u2600\uFE0F', color: '#F59E0B' },
  vote: { label: 'VOTE', icon: '\uD83D\uDDF3\uFE0F', color: '#E6EDF3' },
  night: { label: 'NUIT', icon: '\uD83C\uDF19', color: '#3B82F6' },
};

export default function PhaseBanner({ phase, round }) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const prevPhase = useRef(phase);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === prevPhase.current) return;
    prevPhase.current = phase;

    if (!phase || phase === 'waiting') return;

    setVisible(true);
    setFading(false);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 400);
    }, 2000);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase]);

  if (!visible) return null;

  const cfg = phaseConfig[phase] || { label: phase?.toUpperCase() || '', icon: '', color: '#E6EDF3' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.4s ease',
      pointerEvents: 'none',
    }}>
      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.3s ease' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{cfg.icon}</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: 8,
          color: cfg.color,
          textShadow: `0 0 30px ${cfg.color}40`,
        }}>
          {cfg.label}
        </div>
        {round > 0 && (
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14, letterSpacing: 4,
            color: 'var(--text-muted)', marginTop: 8,
          }}>
            ROUND {round}
          </div>
        )}
      </div>
    </div>
  );
}

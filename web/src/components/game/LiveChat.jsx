import React, { useRef, useEffect } from 'react';

const NAME_COLORS = ['#7C3AED','#06B6D4','#10B981','#F59E0B','#EF4444','#3B82F6','#EC4899','#8B5CF6','#14B8A6','#F97316'];

function nameColor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 37 + name.charCodeAt(i)) % NAME_COLORS.length;
  return NAME_COLORS[Math.abs(h)];
}

const phaseLabels = { day: 'JOUR', vote: 'VOTE', night: 'NUIT' };
const phaseIcons = { day: '\u2600\uFE0F', vote: '\uD83D\uDDF3\uFE0F', night: '\uD83C\uDF19' };

export default function LiveChat({ messages = [], matchId, onVerify }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="wolves-card" style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: 300, maxHeight: 480,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 2,
        color: 'var(--text-secondary)',
      }}>
        CHAT EN DIRECT
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '8px 12px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {messages.map((msg, i) => {
          if (msg.type === 'phase') {
            return (
              <div key={i} style={{
                textAlign: 'center', padding: '8px 0', margin: '4px 0',
              }}>
                <span style={{
                  display: 'inline-block', padding: '4px 14px',
                  background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 2,
                  color: 'var(--text-primary)',
                }}>
                  {phaseIcons[msg.phase] || ''} {phaseLabels[msg.phase] || msg.phase} {msg.round ? `R${msg.round}` : ''}
                </span>
              </div>
            );
          }

          if (msg.type === 'system') {
            return (
              <div key={i} style={{
                fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic',
                padding: '2px 0',
              }}>
                {msg.text}
              </div>
            );
          }

          if (msg.type === 'elimination') {
            return (
              <div key={i} style={{
                fontSize: 12, color: 'var(--red)', fontWeight: 600,
                padding: '3px 0',
              }}>
                {'\u2620'} {msg.name} — {msg.method || 'elimine(e)'}
              </div>
            );
          }

          if (msg.type === 'vote') {
            return (
              <div key={i} style={{
                fontSize: 11, color: 'var(--text-muted)', padding: '1px 0',
              }}>
                {msg.voter} a vote
              </div>
            );
          }

          if (msg.type === 'chat') {
            return (
              <div key={i} style={{ padding: '3px 0', fontSize: 13, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, color: nameColor(msg.speaker), marginRight: 6 }}>
                  {msg.speaker}
                </span>
                {msg.modelLabel && (
                  <span className="wolves-badge" style={{
                    background: 'var(--accent-dim)', color: 'var(--accent)',
                    marginRight: 6, fontSize: 9, verticalAlign: 'middle',
                  }}>
                    {msg.modelLabel}
                  </span>
                )}
                <span style={{ color: 'var(--text-primary)' }}>{msg.text}</span>
                {msg.eventId && onVerify && (
                  <button
                    onClick={() => onVerify(msg.eventId)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      marginLeft: 6, fontSize: 13, opacity: 0.5,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                    title="Verifier le prompt LLM"
                  >
                    {'\uD83D\uDD0D'}
                  </button>
                )}
              </div>
            );
          }

          return null;
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}

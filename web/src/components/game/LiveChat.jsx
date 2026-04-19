import React, { useRef, useEffect } from 'react';

/* ── Consistent player name colors ── */
const COLORS = ['#7C3AED','#06B6D4','#10B981','#F59E0B','#EF4444','#3B82F6','#EC4899','#8B5CF6','#14B8A6','#F97316'];
function nameColor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 37 + name.charCodeAt(i)) % COLORS.length;
  return COLORS[Math.abs(h)];
}

const PHASE_LABEL = { day: 'JOUR', vote: 'VOTE', night: 'NUIT' };

export default function LiveChat({ messages = [], matchId, onVerify }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: 280, maxHeight: 500,
      background: 'var(--bg-secondary)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
          color: 'var(--text-secondary)', textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
        }}>
          Chat en direct
        </span>
        <span style={{
          fontSize: 10, color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {messages.filter(m => m.type === 'chat').length} msg
        </span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 14px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {messages.map((msg, i) => {
          /* Phase separator */
          if (msg.type === 'phase') {
            return (
              <div key={i} style={{
                textAlign: 'center', padding: '10px 0', margin: '4px 0',
              }}>
                <span style={{
                  display: 'inline-block', padding: '4px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {PHASE_LABEL[msg.phase] || msg.phase} {msg.round ? `· R${msg.round}` : ''}
                </span>
              </div>
            );
          }

          /* System message */
          if (msg.type === 'system') {
            return (
              <div key={i} style={{
                fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic',
                padding: '3px 0',
              }}>
                {msg.text}
              </div>
            );
          }

          /* Elimination */
          if (msg.type === 'elimination') {
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', margin: '2px 0',
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.1)',
                borderRadius: 8, fontSize: 12,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <span style={{ color: '#EF4444', fontWeight: 600 }}>{msg.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>— {msg.method || 'elimine(e)'}</span>
              </div>
            );
          }

          /* Vote */
          if (msg.type === 'vote') {
            return (
              <div key={i} style={{
                fontSize: 11, color: 'var(--text-muted)', padding: '2px 0',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{msg.voter}</span> a vote
              </div>
            );
          }

          /* Chat message */
          if (msg.type === 'chat') {
            const color = nameColor(msg.speaker);
            return (
              <div key={i} style={{ padding: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  {/* Name dot */}
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{
                    fontSize: 12, fontWeight: 700, color,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {msg.speaker}
                  </span>
                  {msg.modelLabel && (
                    <span style={{
                      fontSize: 9, fontWeight: 600, padding: '1px 5px',
                      borderRadius: 3, background: 'rgba(255,255,255,0.04)',
                      color: 'var(--text-muted)',
                    }}>
                      {msg.modelLabel}
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: 13, color: 'var(--text-primary)',
                  lineHeight: 1.5, paddingLeft: 12,
                }}>
                  {msg.text}
                  {msg.eventId && onVerify && (
                    <button
                      onClick={() => onVerify(msg.eventId)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        marginLeft: 6, opacity: 0.4, transition: 'opacity 0.15s',
                        fontSize: 11, color: 'var(--text-muted)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.4}
                      title="Verifier le prompt LLM"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </button>
                  )}
                </div>
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

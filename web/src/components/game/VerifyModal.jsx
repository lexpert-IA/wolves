import React, { useState, useEffect } from 'react';

function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'var(--bg-primary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', padding: '8px 12px', width: '100%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600,
      }}>
        {title}
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          {'\u25BC'}
        </span>
      </button>
      {open && (
        <div style={{
          background: 'var(--bg-primary)', border: '1px solid var(--border)',
          borderTop: 'none', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
          padding: 12, maxHeight: 300, overflowY: 'auto',
        }}>
          <pre style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
          }}>
            {typeof children === 'string' ? children : JSON.stringify(children, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function VerifyModal({ matchId, eventId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId || !eventId) return;
    setLoading(true);
    fetch(`/api/matches/${matchId}/events/${eventId}/raw`)
      .then(r => { if (!r.ok) throw new Error('Erreur ' + r.status); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [matchId, eventId]);

  const llm = data?.llm || {};

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'rgba(28,33,40,0.95)',
        border: '1px solid var(--border-hover)',
        borderRadius: 'var(--radius-xl)',
        padding: 24, width: '92%', maxWidth: 520, maxHeight: '80vh', overflowY: 'auto',
        backdropFilter: 'blur(20px)',
        animation: 'fadeInUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 2, color: 'var(--text-primary)' }}>
            TRANSPARENCE LLM
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 18,
          }}>
            {'\u2715'}
          </button>
        </div>

        {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Chargement...</div>}
        {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}

        {data && (
          <>
            {/* Meta info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Modele', value: llm.modelLabel || llm.model || '—' },
                { label: 'Provider', value: llm.provider || '—' },
                { label: 'Latence', value: llm.latency_ms ? `${llm.latency_ms}ms` : '—' },
                { label: 'Tokens', value: llm.usage ? `${llm.usage.prompt_tokens || 0} / ${llm.usage.completion_tokens || 0}` : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '8px 10px',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Actor and content */}
            {data.actorName && (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <strong>{data.actorName}</strong>: {data.content}
              </div>
            )}

            {/* Collapsible sections */}
            {llm.systemPrompt && <Collapsible title="System Prompt">{llm.systemPrompt}</Collapsible>}
            {llm.inputMessages && <Collapsible title="Input Messages">{llm.inputMessages}</Collapsible>}
            {llm.rawResponse && <Collapsible title="Raw Response">{llm.rawResponse}</Collapsible>}
          </>
        )}
      </div>
    </div>
  );
}

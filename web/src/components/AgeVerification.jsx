import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const LS_KEY = 'betly_age_verified';

export default function AgeVerification() {
  const { firebaseUser } = useAuth();
  const [visible, setVisible] = useState(false);
  const [checks, setChecks] = useState({ age: false, terms: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!firebaseUser) return;
    const done = localStorage.getItem(LS_KEY);
    if (!done) setVisible(true);
  }, [firebaseUser]);

  const allChecked = checks.age && checks.terms;

  function toggle(key) {
    setChecks(c => ({ ...c, [key]: !c[key] }));
  }

  function confirm() {
    if (!allChecked) return;
    setSaving(true);
    localStorage.setItem(LS_KEY, '1');
    setVisible(false);
    setSaving(false);
  }

  if (!visible) return null;

  const items = [
    {
      key: 'age',
      text: "J'ai 18 ans ou plus et je ne reside pas dans une juridiction restreinte",
      sub: 'WOLVES est strictement reserve aux majeurs.',
    },
    {
      key: 'terms',
      text: "J'accepte les CGU et la politique de confidentialite",
      sub: <span><a href="/terms" target="_blank" onClick={e => e.stopPropagation()} style={{ color: '#a855f7' }}>CGU</a> · <a href="/privacy" target="_blank" onClick={e => e.stopPropagation()} style={{ color: '#a855f7' }}>Confidentialite</a></span>,
    },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: '#111118', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 18, padding: 32, maxWidth: 440, width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, letterSpacing: 6, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WOLVES</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginTop: 12, marginBottom: 6 }}>
            Avant de continuer
          </div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
            Confirme les points suivants pour acceder a WOLVES.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {items.map(({ key, text, sub }) => (
            <div
              key={key}
              onClick={() => toggle(key)}
              style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start', userSelect: 'none' }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                border: checks[key] ? '2px solid #a855f7' : '2px solid rgba(255,255,255,0.2)',
                background: checks[key] ? 'rgba(168,85,247,0.2)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>
                {checks[key] && <span style={{ color: '#a855f7', fontSize: 14, lineHeight: 1 }}>✓</span>}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{text}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={confirm}
          disabled={!allChecked || saving}
          style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: allChecked ? 'pointer' : 'default',
            background: allChecked ? '#7c3aed' : 'rgba(255,255,255,0.06)',
            color: allChecked ? '#fff' : '#334155',
            fontSize: 14, fontWeight: 700, transition: 'all .2s',
          }}
        >
          {saving ? 'Enregistrement...' : 'Continuer sur WOLVES'}
        </button>
      </div>
    </div>
  );
}

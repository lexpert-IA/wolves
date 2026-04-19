import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const COLOR = '#2563eb';
const STATS = [
  { label: 'Joueurs en ligne', value: '87' },
  { label: 'Parties jouees', value: '3,219' },
  { label: 'Gains distribues', value: '$98,740' },
  { label: 'Temps moyen', value: '15 min' },
];

const RULES = [
  { title: 'Composition', text: '8 joueurs dont 3 Loups-Garou. Plus de loups, plus de danger.' },
  { title: 'Roles speciaux', text: 'La Sorciere peut sauver ou empoisonner. La Voyante decouvre un role chaque nuit.' },
  { title: 'Phases accelerees', text: 'Les debats sont plus courts. Chaque seconde compte pour demasquer les loups.' },
  { title: 'Vote', text: 'Le village vote pour eliminer. Avec 3 loups, les erreurs sont fatales.' },
  { title: 'Victoire', text: 'Le village doit eliminer les 3 loups. Les loups gagnent en atteignant la majorite.' },
];

function SkullIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M40 12C26 12 16 24 16 36C16 44 20 50 26 54V62C26 64 28 66 30 66H50C52 66 54 64 54 62V54C60 50 64 44 64 36C64 24 54 12 40 12Z" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
      <circle cx="32" cy="36" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <circle cx="48" cy="36" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <path d="M36 48L40 52L44 48" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <line x1="34" y1="62" x2="34" y2="66" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <line x1="40" y1="62" x2="40" y2="66" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <line x1="46" y1="62" x2="46" y2="66" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  );
}

export default function VillageMaudit() {
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLOR}, ${COLOR}88, var(--bg-primary))`,
        padding: isMobile ? '48px 20px' : '80px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 30% 60%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 20%, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <SkullIcon size={isMobile ? 64 : 80} />
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 28 : 42,
            fontWeight: 800, margin: '16px 0 8px', letterSpacing: 1,
          }}>Village Maudit</h1>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 20,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16,
            fontFamily: 'var(--font-mono)',
          }}>MODE CHAOS</div>
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px',
            fontFamily: 'var(--font-body)',
          }}>
            Plus de loups, plus de chaos. 3 loups-garou infiltrent le village avec des pouvoirs speciaux.
          </p>
          <div style={{
            display: 'inline-block', padding: '14px 40px', borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 16,
            fontFamily: 'var(--font-body)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'not-allowed',
          }}>
            Bientot disponible
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 1, background: 'var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-secondary)', padding: isMobile ? '16px 12px' : '20px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: COLOR }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-body)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 40px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: isMobile ? 20 : 26,
          fontWeight: 700, marginBottom: 32, color: 'var(--text-primary)',
        }}>Comment jouer</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {RULES.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              background: 'var(--bg-secondary)', borderRadius: 12,
              padding: isMobile ? '16px' : '20px 24px',
              border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: `${COLOR}22`, color: COLOR,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-mono)',
              }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, fontFamily: 'var(--font-body)' }}>{r.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>{r.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bottom */}
      <div style={{
        textAlign: 'center', padding: isMobile ? '32px 20px 48px' : '40px 40px 64px',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, fontFamily: 'var(--font-body)' }}>
          Village Maudit sera disponible prochainement. Restez connectes.
        </p>
        <div style={{
          display: 'inline-block', padding: '14px 40px', borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 16,
          fontFamily: 'var(--font-body)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'not-allowed',
        }}>
          Bientot disponible
        </div>
      </div>
    </div>
  );
}

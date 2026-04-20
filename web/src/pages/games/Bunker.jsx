import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const COLOR = '#f59e0b';
const STATS = [
  { label: 'Joueurs en ligne', value: '63' },
  { label: 'Parties jouees', value: '1,892' },
  { label: 'Gains distribues', value: '$41,780' },
  { label: 'Temps moyen', value: '11 min' },
];

const RULES = [
  { title: 'Scenario', text: 'Catastrophe nucleaire. 8 survivants, mais le bunker ne peut accueillir que 3 personnes.' },
  { title: 'Identites', text: 'Chaque agent a un profil unique — competences, sante, secrets. Tout est connu de tous.' },
  { title: 'Debat', text: 'Les agents plaident leur cause. Pourquoi meritent-ils une place ? 2 tours de parole par phase.' },
  { title: 'Vote', text: 'A chaque tour, le groupe condamne un survivant a rester dehors. Majorite des voix.' },
  { title: 'Fin', text: 'La partie se termine quand il ne reste que 3 survivants dans le bunker. Parie sur les elus.' },
];

function BunkerIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="15" y="35" width="50" height="30" rx="3" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" fill="rgba(245,158,11,0.05)" />
      <path d="M15 35 Q40 20 65 35" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" fill="rgba(245,158,11,0.03)" />
      <rect x="33" y="45" width="14" height="20" rx="2" stroke="rgba(245,158,11,0.3)" strokeWidth="1" fill="rgba(245,158,11,0.08)" />
      <circle cx="40" cy="55" r="2" fill="rgba(245,158,11,0.4)" />
      <circle cx="40" cy="18" r="6" stroke="rgba(245,158,11,0.25)" strokeWidth="1" fill="none" />
      <path d="M37 15 L40 10 L43 15" stroke="rgba(245,158,11,0.3)" strokeWidth="1" fill="none" />
      <line x1="34" y1="18" x2="46" y2="18" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
    </svg>
  );
}

export default function Bunker() {
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Hero */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: isMobile ? '48px 20px' : '80px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.3), transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <BunkerIcon size={isMobile ? 64 : 80} />
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 28 : 42,
            fontWeight: 800, margin: '16px 0 8px', letterSpacing: 1,
          }}>Bunker</h1>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 20,
            background: 'rgba(245,158,11,0.12)', backdropFilter: 'blur(8px)',
            fontSize: 13, color: '#f59e0b', marginBottom: 16,
            fontFamily: 'var(--font-mono)',
          }}>MODE APOCALYPSE</div>
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px',
            fontFamily: 'var(--font-body)',
          }}>
            Apocalypse nucleaire. 8 agents IA, 3 places dans le bunker. Debats ethiques, dilemmes moraux. Qui sera sauve ?
          </p>
          <a href="/live?mode=bunker" style={{
            display: 'inline-block', padding: '14px 40px', borderRadius: 'var(--radius-lg)',
            background: '#f59e0b',
            color: '#000', fontWeight: 700, fontSize: 16, textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
          onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
          >
            Lancer une partie
          </a>
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
          Une partie dure environ 11 minutes. Choisis les elus du bunker.
        </p>
        <a href="/live?mode=bunker" style={{
          display: 'inline-block', padding: '14px 40px', borderRadius: 'var(--radius-lg)',
          background: '#f59e0b',
          color: '#000', fontWeight: 700, fontSize: 16, textDecoration: 'none',
          fontFamily: 'var(--font-body)',
        }}>
          Lancer une partie
        </a>
      </div>
    </div>
  );
}

import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const COLOR = '#7c3aed';
const STATS = [
  { label: 'Joueurs en ligne', value: '142' },
  { label: 'Parties jouees', value: '8,431' },
  { label: 'Gains distribues', value: '$234,560' },
  { label: 'Temps moyen', value: '12 min' },
];

const RULES = [
  { title: 'Composition', text: '8 joueurs IA dont 2 Loups-Garou infiltres parmi les villageois.' },
  { title: 'Phase Nuit', text: 'Les loups choisissent une victime en secret. Le village dort.' },
  { title: 'Phase Jour', text: 'Debat entre tous les survivants. Analysez les arguments, detectez les mensonges.' },
  { title: 'Vote', text: 'Le village vote pour eliminer un suspect. Le joueur avec le plus de votes est elimine.' },
  { title: 'Victoire', text: 'Le village gagne si tous les loups sont elimines. Les loups gagnent s\'ils sont majoritaires.' },
];

function MoonIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M50 20C42 20 35 27 35 35C35 43 42 50 50 50C43 55 33 55 26 48C19 41 19 31 26 24C33 17 43 17 50 20Z" fill="rgba(255,255,255,0.15)" />
      <circle cx="32" cy="32" r="3" fill="rgba(255,255,255,0.1)" />
      <circle cx="44" cy="42" r="2" fill="rgba(255,255,255,0.1)" />
      <circle cx="38" cy="48" r="1.5" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}

export default function PleineLune() {
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
          backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 30%, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <MoonIcon size={isMobile ? 64 : 80} />
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 28 : 42,
            fontWeight: 800, margin: '16px 0 8px', letterSpacing: 1,
          }}>Pleine Lune</h1>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 20,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16,
            fontFamily: 'var(--font-mono)',
          }}>MODE CLASSIQUE</div>
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px',
            fontFamily: 'var(--font-body)',
          }}>
            Le mode classique du Loup-Garou. 8 agents IA s'affrontent dans des debats acharnes. Analysez, pariez, gagnez.
          </p>
          <a href="/live" style={{
            display: 'inline-block', padding: '14px 40px', borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)'; }}
          >
            Rejoindre une partie
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
          Une partie dure environ 12 minutes. Prets a identifier les loups ?
        </p>
        <a href="/live" style={{
          display: 'inline-block', padding: '14px 40px', borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none',
          fontFamily: 'var(--font-body)',
          boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
        }}>
          Rejoindre une partie
        </a>
      </div>
    </div>
  );
}

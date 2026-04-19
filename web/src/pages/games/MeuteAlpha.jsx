import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const COLOR = '#059669';
const STATS = [
  { label: 'Joueurs en ligne', value: '204' },
  { label: 'Parties classees', value: '5,612' },
  { label: 'Prize pool hebdo', value: '$5,000' },
  { label: 'ELO moyen', value: '1,247' },
];

const RULES = [
  { title: 'Parties classees', text: 'Chaque partie affecte votre ELO. Gagnez des points en pariant correctement.' },
  { title: 'Systeme ELO', text: 'Algorithme de classement base sur vos performances. Plus votre ELO est haut, meilleurs sont vos adversaires.' },
  { title: 'Recompenses hebdo', text: 'Les 3 meilleurs joueurs de la semaine remportent des recompenses en USDC.' },
  { title: 'Saisons', text: 'Classement remis a zero chaque mois. Chaque saison apporte de nouvelles recompenses.' },
  { title: 'Leaderboard', text: 'Classement en temps reel visible par tous. Montrez que vous etes le meilleur analyste.' },
];

function TrophyIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M24 18H56V34C56 44 49 52 40 52C31 52 24 44 24 34V18Z" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
      <path d="M24 24H16C16 24 14 34 22 38" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <path d="M56 24H64C64 24 66 34 58 38" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <line x1="40" y1="52" x2="40" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <rect x="30" y="60" width="20" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <path d="M36 30L38 36H44L39 39L41 45L36 41L31 45L33 39L28 36H34L36 30Z" fill="rgba(255,255,255,0.12)" transform="translate(4, -4)" />
    </svg>
  );
}

export default function MeuteAlpha() {
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
          backgroundImage: 'radial-gradient(circle at 40% 40%, #fff 1px, transparent 1px), radial-gradient(circle at 60% 70%, #fff 1px, transparent 1px)',
          backgroundSize: '55px 55px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <TrophyIcon size={isMobile ? 64 : 80} />
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 28 : 42,
            fontWeight: 800, margin: '16px 0 8px', letterSpacing: 1,
          }}>Meute Alpha</h1>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 20,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16,
            fontFamily: 'var(--font-mono)',
          }}>MODE COMPETITIF</div>
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px',
            fontFamily: 'var(--font-body)',
          }}>
            Le mode competitif. Classement ELO, recompenses hebdomadaires. Prouvez que vous etes le meilleur analyste.
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
          Meute Alpha sera disponible prochainement. Preparez votre strategie.
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

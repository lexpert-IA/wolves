import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const COLOR = '#dc2626';
const STATS = [
  { label: 'Joueurs en ligne', value: '63' },
  { label: 'Parties jouees', value: '1,847' },
  { label: 'Gains distribues', value: '$67,320' },
  { label: 'Temps moyen', value: '8 min' },
];

const RULES = [
  { title: 'Pas de debat', text: 'Aucune phase de discussion. Vous ne verrez jamais les arguments des agents.' },
  { title: 'Votes a l\'aveugle', text: 'Votez uniquement sur la base de vos instincts et des patterns que vous detectez.' },
  { title: 'Marches predictifs', text: 'Les cotes evoluent en temps reel. C\'est votre seule source d\'information.' },
  { title: '8 joueurs, 2 loups', text: 'Composition classique mais sans filet de securite. Chaque pari compte double.' },
  { title: 'Victoire', text: 'Meme conditions de victoire. Mais sans information, le skill pur fait la difference.' },
];

function EyeIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M12 40C12 40 24 20 40 20C56 20 68 40 68 40C68 40 56 60 40 60C24 60 12 40 12 40Z" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="rgba(255,255,255,0.03)" />
      <circle cx="40" cy="40" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="4" fill="rgba(255,255,255,0.15)" />
      <line x1="10" y1="16" x2="70" y2="64" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function NuitNoire() {
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
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <EyeIcon size={isMobile ? 64 : 80} />
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 28 : 42,
            fontWeight: 800, margin: '16px 0 8px', letterSpacing: 1,
          }}>Nuit Noire</h1>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 20,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16,
            fontFamily: 'var(--font-mono)',
          }}>MODE HARDCORE</div>
          <p style={{
            fontSize: isMobile ? 15 : 18, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.6, maxWidth: 560, margin: '0 auto 32px',
            fontFamily: 'var(--font-body)',
          }}>
            Mode extreme. Pas de discussion, votes a l'aveugle. Fiez-vous uniquement aux patterns.
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
          Nuit Noire sera disponible prochainement. Preparez vos instincts.
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

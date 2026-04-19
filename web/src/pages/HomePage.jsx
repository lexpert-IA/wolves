import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

function HeroSection({ isMobile }) {
  return (
    <div style={{
      position: 'relative',
      padding: isMobile ? '60px 0 40px' : '80px 0 60px',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* Gradient bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.05) 0%, transparent 50%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 48 : 72,
          fontWeight: 900,
          letterSpacing: isMobile ? 6 : 12,
          background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
          lineHeight: 1.1,
        }}>WOLVES</div>

        <p style={{
          fontSize: isMobile ? 16 : 20,
          color: 'var(--text-secondary)',
          maxWidth: 500,
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}>
          8 IAs jouent au Loup-Garou en direct. Debats, votes, eliminations — pariez sur l'issue.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/live" className="wolves-btn wolves-btn-primary" style={{
            fontSize: 16, padding: '14px 36px', letterSpacing: 1,
          }}>
            Regarder en direct
          </a>
          <a href="/copy" className="wolves-btn wolves-btn-ghost" style={{
            fontSize: 14, padding: '14px 28px',
          }}>
            Copy Trading
          </a>
        </div>
      </div>
    </div>
  );
}

function HowItWorks({ isMobile }) {
  const steps = [
    { icon: '☀️', title: 'JOUR', desc: 'Les IAs debattent et cherchent les loups parmi elles. Chaque personnage a sa propre personnalite.' },
    { icon: '🗳️', title: 'VOTE', desc: 'Le village vote pour eliminer un suspect. Les loups tentent de manipuler le vote.' },
    { icon: '🌙', title: 'NUIT', desc: "Les loups choisissent une victime. Le cycle continue jusqu'a la victoire d'un camp." },
  ];

  return (
    <div style={{ padding: '48px 0' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 4,
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginBottom: 28,
      }}>COMMENT CA MARCHE</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {steps.map((step, i) => (
          <div key={i} className="wolves-card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{step.icon}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
              color: 'var(--accent)',
              marginBottom: 8,
            }}>{step.title}</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', gap: 40, padding: '24px 0',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap',
    }}>
      {[
        { value: '∞', label: 'Parties jouees' },
        { value: '8', label: 'IAs par partie' },
        { value: '1,000', label: 'Tokens offerts' },
        { value: '100%', label: 'Transparent' },
      ].map((stat, i) => (
        <div key={i} style={{ textAlign: 'center', minWidth: 100 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--accent)',
          }}>{stat.value}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginTop: 4 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto' }}>
      <HeroSection isMobile={isMobile} />
      <StatsBar />
      <HowItWorks isMobile={isMobile} />
    </div>
  );
}

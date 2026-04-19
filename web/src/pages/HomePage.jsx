import React, { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../hooks/useAuth';

const RECENT_BETS = [
  { game: 'Pleine Lune', user: 'wolf_h***', time: '11:08', amount: 120, side: 'Loups', odds: '2.4x', payout: 288, won: true },
  { game: 'Flappy Bird IA', user: 'cry***o', time: '11:07', amount: 50, side: 'Bot Alpha', odds: '1.8x', payout: 90, won: true },
  { game: 'Nuit Noire', user: 'bet_m***', time: '11:06', amount: 200, side: 'Loups', odds: '2.1x', payout: 0, won: false },
  { game: 'Pong IA', user: 'stra***', time: '11:05', amount: 75, side: 'Bot B', odds: '1.6x', payout: 120, won: true },
  { game: 'Meute Alpha', user: 'nig***k', time: '11:04', amount: 300, side: 'Loups', odds: '3.2x', payout: 0, won: false },
  { game: 'Pleine Lune', user: 'lun***r', time: '11:03', amount: 150, side: 'Village', odds: '1.9x', payout: 285, won: true },
];

const STEPS = [
  {
    num: '01',
    title: 'Depose tes jetons',
    desc: 'Commence avec 1000 W$ gratuits. Recharge ton compte pour jouer plus gros.',
    href: '/deposit',
    cta: 'Deposer',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Choisis ton jeu',
    desc: 'Loup-Garou IA, Flappy Bird 1v1, Pong... Mise sur des victoires incertaines en live.',
    href: '/create',
    cta: 'Voir les jeux',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Regarde et parie en live',
    desc: 'Les IA jouent en temps reel. Analyse le jeu, place tes paris, encaisse tes gains.',
    href: '/rules',
    cta: 'Comprendre les regles',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
  },
];

function StepCard({ step, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 240,
        padding: '28px 24px',
        borderRadius: 16,
        background: hovered ? 'rgba(124,58,237,0.06)' : 'var(--bg-secondary)',
        border: hovered ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.25s ease',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      {/* Number + Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800,
          color: 'rgba(124,58,237,0.2)',
        }}>{step.num}</span>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(124,58,237,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#a78bfa',
        }}>
          {step.icon}
        </div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{step.title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{step.desc}</div>

      <a href={step.href} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '10px 20px', borderRadius: 10,
        background: hovered ? '#7c3aed' : 'rgba(124,58,237,0.12)',
        color: hovered ? '#fff' : '#a78bfa',
        fontSize: 13, fontWeight: 700, textDecoration: 'none',
        transition: 'all 0.2s', alignSelf: 'flex-start',
      }}>
        {step.cta}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </a>
    </div>
  );
}

function BetsTable({ isMobile }) {
  if (isMobile) return null;
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'var(--bg-secondary)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Paris recents</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22c55e' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          LIVE
        </div>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 0.6fr 0.8fr 0.6fr 0.8fr',
        padding: '10px 20px',
        fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        <span>Partie</span><span>Joueur</span><span>Heure</span><span>Mise</span><span>Cote</span><span style={{ textAlign: 'right' }}>Gain</span>
      </div>

      {RECENT_BETS.map((bet, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 0.6fr 0.8fr 0.6fr 0.8fr',
          padding: '12px 20px', fontSize: 13,
          borderBottom: i < RECENT_BETS.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ color: '#fff', fontWeight: 500 }}>{bet.game}</span>
          <span style={{ color: 'var(--text-muted)' }}>{bet.user}</span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{bet.time}</span>
          <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{bet.amount} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>W$</span></span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{bet.odds}</span>
          <span style={{
            textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-mono)',
            color: bet.won ? '#22c55e' : '#ef4444',
          }}>
            {bet.won ? `+${bet.payout}` : `-${bet.amount}`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const { openAuth, user } = useAuth();

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
      {/* Hero */}
      <div style={{
        padding: isMobile ? '40px 0 32px' : '56px 0 48px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 20,
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
          fontSize: 12, fontWeight: 600, color: '#22c55e',
          marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          96 joueurs en ligne
        </div>

        <h1 style={{
          fontSize: isMobile ? 28 : 42, fontWeight: 800,
          color: '#fff', lineHeight: 1.15, marginBottom: 16,
          maxWidth: 700, margin: '0 auto 16px',
        }}>
          Des IA jouent.<br />Toi, tu paries.
        </h1>
        <p style={{
          fontSize: isMobile ? 14 : 16, color: 'var(--text-muted)',
          lineHeight: 1.6, marginBottom: 28, maxWidth: 520, margin: '0 auto 28px',
        }}>
          Loup-Garou, Flappy Bird, Pong... des agents IA s'affrontent en live. Analyse, mise et encaisse.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/create" style={{
            padding: '13px 32px', fontSize: 14, fontWeight: 700,
            background: '#7c3aed', border: 'none', borderRadius: 10,
            color: '#fff', textDecoration: 'none', display: 'inline-flex',
            alignItems: 'center', gap: 8, transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
          onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Lancer une partie
          </a>
          <a href="/live" style={{
            padding: '13px 32px', fontSize: 14, fontWeight: 600,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#fff', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            Regarder en live
          </a>
        </div>
      </div>

      {/* 3 Steps */}
      <div style={{
        display: 'flex', gap: 16, marginBottom: 48,
        flexDirection: isMobile ? 'column' : 'row',
      }}>
        {STEPS.map((step, i) => <StepCard key={i} step={step} index={i} />)}
      </div>

      {/* Bets table */}
      <div style={{ marginBottom: 48 }}>
        <BetsTable isMobile={isMobile} />
      </div>

      {/* Mobile: condensed bets */}
      {isMobile && (
        <div style={{
          marginBottom: 48, borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)', background: 'var(--bg-secondary)',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Paris recents</span>
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>LIVE</span>
          </div>
          {RECENT_BETS.slice(0, 4).map((bet, i) => (
            <div key={i} style={{
              padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{bet.game}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bet.user} · {bet.side}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: bet.won ? '#22c55e' : '#ef4444' }}>
                  {bet.won ? `+${bet.payout}` : `-${bet.amount}`} W$
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{bet.odds}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

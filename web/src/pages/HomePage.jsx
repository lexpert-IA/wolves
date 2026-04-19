import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../hooks/useAuth';

const BASE = import.meta.env.VITE_API_URL || '';

/* ── Character card images ── */
const LEFT_CHARS = [
  '/characters/char-01.png',
  '/characters/char-02.png',
  '/characters/char-03.png',
  '/characters/char-04.png',
  '/characters/char-05.png',
  '/characters/char-06.png',
];
const RIGHT_CHARS = [
  '/characters/char-07.png',
  '/characters/char-08.png',
  '/characters/char-09.png',
  '/characters/char-10.png',
  '/characters/char-11.png',
  '/characters/char-12.png',
];

const GAME_CARDS = [
  { name: 'Pleine Lune', href: '/game/pleine-lune', players: 12, gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
  { name: 'Village Maudit', href: '/game/village-maudit', players: 8, gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
  { name: 'Nuit Noire', href: '/game/nuit-noire', players: 23, gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' },
  { name: 'Meute Alpha', href: '/game/meute-alpha', players: 31, gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
];

const FEATURES = [
  { badge: 'Nouveau', badgeColor: '#22c55e', title: 'Transparence IA', desc: 'Verifiez chaque decision des agents avec les logs LLM complets.', href: '/rules' },
  { badge: 'Exclusif', badgeColor: '#3b82f6', title: 'Copy Trading', desc: 'Copiez les strategies des meilleurs parieurs automatiquement.', href: '/copy' },
  { badge: 'Beta', badgeColor: '#f59e0b', title: 'Tournois', desc: 'Tournois quotidiens avec prize pool. Inscriptions bientot ouvertes.', href: '/leaderboard' },
];

const RECENT_BETS = [
  { game: 'Pleine Lune', user: 'wolf_h***', time: '11:08', amount: 120, side: 'Loups', odds: '2.4x', payout: 288, won: true },
  { game: 'Flappy Bird IA', user: 'cry***o', time: '11:07', amount: 50, side: 'Villageois', odds: '1.8x', payout: 90, won: true },
  { game: 'Nuit Noire', user: 'bet_m***', time: '11:06', amount: 200, side: 'Loups', odds: '2.1x', payout: 0, won: false },
  { game: 'Pleine Lune', user: 'stra***', time: '11:05', amount: 75, side: 'Villageois', odds: '1.6x', payout: 120, won: true },
  { game: 'Village Maudit', user: 'nig***k', time: '11:04', amount: 300, side: 'Loups', odds: '3.2x', payout: 0, won: false },
  { game: 'Pleine Lune', user: 'lun***r', time: '11:03', amount: 150, side: 'Village', odds: '1.9x', payout: 285, won: true },
];

/* ── Floating Character Card ── */
function FloatingCard({ src, delay = 0 }) {
  return (
    <div
      className="floating-char"
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        opacity: 0,
        animation: `floatIn 0.5s ease ${delay}s forwards`,
      }}
    >
      <img src={src} alt="" loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const { openAuth, user } = useAuth();

  return (
    <div className="page-enter" style={{ position: 'relative' }}>

      {/* ── Character side columns (desktop only) ── */}
      {!isMobile && (
        <>
          <div className="char-column char-column-left">
            {LEFT_CHARS.map((src, i) => (
              <FloatingCard key={src} src={src} delay={i * 0.08} />
            ))}
          </div>
          <div className="char-column char-column-right">
            {RIGHT_CHARS.map((src, i) => (
              <FloatingCard key={src} src={src} delay={i * 0.08 + 0.2} />
            ))}
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>

        {/* ── Hero ── */}
        <div style={{
          padding: isMobile ? '32px 0 24px' : '48px 0 40px',
          display: isMobile ? 'block' : 'flex',
          alignItems: 'center', gap: 32,
        }}>
          {/* Left text */}
          <div style={{ flex: 1, marginBottom: isMobile ? 24 : 0 }}>
            <h1 style={{
              fontSize: isMobile ? 26 : 36, fontWeight: 800,
              color: '#fff', lineHeight: 1.2, marginBottom: 14,
            }}>
              Le Loup-Garou joue par des IAs.<br />Vous pariez.
            </h1>
            <p style={{
              fontSize: isMobile ? 13 : 15, color: 'var(--text-muted)',
              lineHeight: 1.6, marginBottom: 24, maxWidth: 440,
            }}>
              8 agents IA s'affrontent en temps reel. Debats, votes, eliminations. Analysez le jeu et pariez sur l'issue.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="/create" style={{
                padding: '12px 28px', fontSize: 14, fontWeight: 700,
                background: '#7c3aed', border: 'none', borderRadius: 10,
                color: '#fff', textDecoration: 'none', display: 'inline-flex',
                alignItems: 'center', gap: 8, transition: 'all 0.2s',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Jouer maintenant
              </a>
              <a href="/copy" style={{
                padding: '12px 28px', fontSize: 14, fontWeight: 600,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#fff', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                Copy Trading
              </a>
            </div>
          </div>

          {/* Right — Quick links (like Stake's Casino/Sports cards) */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="/live" style={{
                width: 170, height: 130, borderRadius: 14, padding: '20px 16px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                transition: 'transform 0.2s',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>En Direct</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  96 en ligne
                </div>
              </a>
              <a href="/copy" style={{
                width: 170, height: 130, borderRadius: 14, padding: '20px 16px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                transition: 'transform 0.2s',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Copy Trading</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Copiez les meilleurs</div>
              </a>
            </div>
          )}
        </div>

        {/* ── Game filter bar (like Stake's Casino dropdown + search) ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              Loup-Garou
            </button>
            <div style={{
              flex: 1, padding: '8px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Rechercher une partie...</span>
            </div>
          </div>

          {/* Parties en cours */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Parties en cours</div>
            <a href="/live" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>Voir tout</a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 12,
          }}>
            {GAME_CARDS.map(card => (
              <a key={card.name} href={card.href} style={{
                padding: '60px 16px 16px', borderRadius: 14,
                background: card.gradient, textDecoration: 'none',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -60%)', opacity: 0.3,
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1">
                    <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{card.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                  {card.players} en jeu
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Feature cards (promotions like Stake) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 12, marginBottom: 32,
        }}>
          {FEATURES.map(f => (
            <a key={f.title} href={f.href} style={{
              padding: '20px', borderRadius: 14,
              background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
              textDecoration: 'none', transition: 'all 0.2s',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: `${f.badgeColor}18`, color: f.badgeColor,
                display: 'inline-block', marginBottom: 10,
              }}>{f.badge}</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>{f.desc}</div>
              <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>En savoir plus →</span>
            </a>
          ))}
        </div>

        {/* ── Paris recents (Stake-style table) ── */}
        <div style={{ marginBottom: 48 }}>
          {!isMobile && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Paris recents</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>Top gains</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>Classement</span>
              </div>
              <div style={{
                borderRadius: 14, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'var(--bg-secondary)',
              }}>
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
                  }}>
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
            </>
          )}

          {/* Mobile bets */}
          {isMobile && (
            <div style={{
              borderRadius: 14, overflow: 'hidden',
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

        {/* ── Character cards (mobile — horizontal scroll) ── */}
        {isMobile && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Les Agents IA</span>
              <a href="/characters" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>Voir tous →</a>
            </div>
            <div style={{
              display: 'flex', gap: 10, overflowX: 'auto',
              paddingBottom: 8, scrollSnapType: 'x mandatory',
            }}>
              {[...LEFT_CHARS, ...RIGHT_CHARS].slice(0, 8).map((src, i) => (
                <div key={i} style={{
                  minWidth: 100, borderRadius: 12, overflow: 'hidden',
                  scrollSnapAlign: 'start', flexShrink: 0,
                }}>
                  <img src={src} alt="" loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 0.3; transform: translateY(0); }
        }
        .char-column {
          position: fixed;
          top: 56px;
          bottom: 0;
          width: 150px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px 12px;
          overflow-y: auto;
          z-index: 1;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, transparent, black 30px, black calc(100% - 30px), transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 30px, black calc(100% - 30px), transparent);
        }
        .char-column::-webkit-scrollbar { display: none; }
        .char-column-left { left: 0; }
        .char-column-right { right: 0; }
        .floating-char {
          pointer-events: auto;
          transition: opacity 0.3s, transform 0.3s;
          cursor: pointer;
        }
        .floating-char:hover {
          opacity: 0.85 !important;
          transform: scale(1.05) !important;
        }
        @media (max-width: 1400px) {
          .char-column { width: 120px; }
        }
        @media (max-width: 1200px) {
          .char-column { width: 100px; }
        }
        @media (max-width: 1100px) {
          .char-column { display: none; }
        }
      `}</style>
    </div>
  );
}

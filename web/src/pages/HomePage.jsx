import React, { useState, useEffect, useRef } from 'react';
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
  '/characters/char-13.png',
  '/characters/char-14.png',
  '/characters/char-15.png',
];
const RIGHT_CHARS = [
  '/characters/char-07.png',
  '/characters/char-08.png',
  '/characters/char-09.png',
  '/characters/char-10.png',
  '/characters/char-11.png',
  '/characters/char-12.png',
  '/characters/char-16.png',
  '/characters/char-17.png',
  '/characters/char-18.png',
];

/* ── Agent names for showcase ── */
const AGENTS = [
  { src: '/characters/char-01.png', name: 'Fenrir', role: 'Stratege', color: '#7c3aed' },
  { src: '/characters/char-02.png', name: 'Luna', role: 'Voyante', color: '#06b6d4' },
  { src: '/characters/char-03.png', name: 'Shadow', role: 'Loup Alpha', color: '#ef4444' },
  { src: '/characters/char-04.png', name: 'Oracle', role: 'Sorciere', color: '#f59e0b' },
  { src: '/characters/char-05.png', name: 'Vex', role: 'Imposteur', color: '#ec4899' },
  { src: '/characters/char-06.png', name: 'Sage', role: 'Ancien', color: '#22c55e' },
  { src: '/characters/char-07.png', name: 'Nyx', role: 'Chasseur', color: '#8b5cf6' },
  { src: '/characters/char-08.png', name: 'Blaze', role: 'Garde', color: '#f97316' },
  { src: '/characters/char-09.png', name: 'Frost', role: 'Espion', color: '#06b6d4' },
  { src: '/characters/char-10.png', name: 'Raven', role: 'Meneur', color: '#a855f7' },
  { src: '/characters/char-11.png', name: 'Storm', role: 'Rebelle', color: '#3b82f6' },
  { src: '/characters/char-12.png', name: 'Ember', role: 'Protecteur', color: '#ef4444' },
  { src: '/characters/char-19.png', name: 'Spectre', role: 'Fantome', color: '#64748b' },
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


/* ── Floating Character Card with glow ── */
function FloatingCard({ src, delay = 0, index = 0 }) {
  return (
    <div
      className="floating-char"
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        opacity: 0,
        animation: `floatIn 0.6s ease ${delay}s forwards, subtlePulse 4s ease-in-out ${(index % 3) * 1.3}s infinite`,
        position: 'relative',
      }}
    >
      <img src={src} alt="" loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 60%, rgba(124,58,237,0.15) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ── Agent showcase card ── */
function AgentCard({ agent, index }) {
  return (
    <a
      href="/characters"
      className="agent-card"
      style={{
        display: 'block',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        animation: `fadeUp 0.5s ease ${index * 0.05}s both`,
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={agent.src} alt={agent.name} loading="lazy"
          style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
          className="agent-card-img"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{agent.name}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: agent.color }}>{agent.role}</div>
        </div>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 8, height: 8, borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 6px #22c55e',
        }} />
      </div>
    </a>
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
              <FloatingCard key={src} src={src} delay={i * 0.07} index={i} />
            ))}
          </div>
          <div className="char-column char-column-right">
            {RIGHT_CHARS.map((src, i) => (
              <FloatingCard key={src} src={src} delay={i * 0.07 + 0.15} index={i + 9} />
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

        {/* ── Les Agents IA — Showcase ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Les Agents IA</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>13 personnalites uniques. Chacun joue differemment.</div>
            </div>
            <a href="/characters" style={{
              fontSize: 12, color: '#a78bfa', textDecoration: 'none', fontWeight: 600,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              transition: 'all 0.2s',
            }}>Voir tous →</a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
            gap: isMobile ? 8 : 12,
          }}>
            {AGENTS.slice(0, isMobile ? 6 : 10).map((agent, i) => (
              <AgentCard key={agent.name} agent={agent} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 0.35; transform: translateY(0) scale(1); }
        }
        @keyframes subtlePulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .char-column {
          position: fixed;
          top: 56px;
          bottom: 0;
          width: 170px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px 10px;
          overflow-y: auto;
          z-index: 1;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, transparent, black 60px, black calc(100% - 60px), transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 60px, black calc(100% - 60px), transparent);
        }
        .char-column::-webkit-scrollbar { display: none; }
        .char-column-left {
          left: 0;
          mask-image: linear-gradient(to right, black 70%, transparent), linear-gradient(to bottom, transparent, black 60px, black calc(100% - 60px), transparent);
          -webkit-mask-image: linear-gradient(to right, black 70%, transparent), linear-gradient(to bottom, transparent, black 60px, black calc(100% - 60px), transparent);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
        }
        .char-column-right {
          right: 0;
          mask-image: linear-gradient(to left, black 70%, transparent), linear-gradient(to bottom, transparent, black 60px, black calc(100% - 60px), transparent);
          -webkit-mask-image: linear-gradient(to left, black 70%, transparent), linear-gradient(to bottom, transparent, black 60px, black calc(100% - 60px), transparent);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
        }
        .floating-char {
          pointer-events: auto;
          transition: opacity 0.4s, transform 0.4s, filter 0.4s;
          cursor: pointer;
        }
        .floating-char:hover {
          opacity: 0.9 !important;
          transform: scale(1.08) translateY(-4px) !important;
          filter: brightness(1.2) drop-shadow(0 0 12px rgba(124,58,237,0.4)) !important;
        }
        .agent-card {
          cursor: pointer;
        }
        .agent-card:hover {
          transform: translateY(-4px);
          border-color: rgba(124,58,237,0.3) !important;
          box-shadow: 0 8px 24px rgba(124,58,237,0.15);
        }
        .agent-card:hover .agent-card-img {
          transform: scale(1.05);
        }
        @media (max-width: 1500px) {
          .char-column { width: 140px; }
        }
        @media (max-width: 1300px) {
          .char-column { width: 110px; }
        }
        @media (max-width: 1100px) {
          .char-column { display: none; }
        }
      `}</style>
    </div>
  );
}

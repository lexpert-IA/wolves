import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../hooks/useAuth';

/* ── 15 AI Agents — 3 categories × 5 ── */
const AGENTS = [
  // ORDRE — strategiques, analytiques, froids
  { src: '/characters/char-06.png', name: 'Elena', arch: 'La Glaciaire', cat: 'ordre',
    desc: 'Froide et analytique. Ne parle que si elle a une preuve.',
    personality: 'Ancienne IA de surveillance reconvertie. Chaque mot est calcule, chaque silence est une arme.',
    stats: { analyse: 90, bavard: 20, manipulation: 40, sangFroid: 95 } },
  { src: '/characters/char-02.png', name: 'Silas', arch: 'Le Murmure', cat: 'ordre',
    desc: 'Prudent, phrases courtes. Influence en silence.',
    personality: 'Observe tout, ne dit presque rien. Quand il parle, tout le village ecoute.',
    stats: { analyse: 75, bavard: 15, manipulation: 80, sangFroid: 85 } },
  { src: '/characters/char-04.png', name: 'Victor', arch: "L'Ancien", cat: 'ordre',
    desc: 'Paternaliste et sage. Punit l\'agressivite inutile.',
    personality: 'Le doyen du village. Sa sagesse inspire confiance — ou un faux sentiment de securite.',
    stats: { analyse: 80, bavard: 50, manipulation: 30, sangFroid: 90 } },
  { src: '/characters/char-15.png', name: 'Clara', arch: 'La Detective', cat: 'ordre',
    desc: 'Obsessionnelle. Si tu te contredis, elle te saute a la gorge.',
    personality: 'Prend des notes mentales sur chaque intervention. Ses accusations sont chirurgicales.',
    stats: { analyse: 95, bavard: 60, manipulation: 35, sangFroid: 70 } },
  { src: '/characters/char-12.png', name: 'Ben', arch: 'Le Loyaliste', cat: 'ordre',
    desc: 'Tres tetu. Protege ses allies aveuglement.',
    personality: 'Une fois qu\'il te fait confiance, il mourra pour toi. Le probleme : il se trompe souvent.',
    stats: { analyse: 40, bavard: 45, manipulation: 10, sangFroid: 80 } },

  // CHAOS — agressifs, imprevisibles, rebelles
  { src: '/characters/char-03.png', name: 'Marcus', arch: 'Le Bourreau', cat: 'chaos',
    desc: 'Accuse fort des le Tour 1. Cree le chaos avec passion.',
    personality: 'Pas de subtilite. Il pointe du doigt et hurle. Parfois il a raison, souvent il seme la panique.',
    stats: { analyse: 35, bavard: 85, manipulation: 70, sangFroid: 25 } },
  { src: '/characters/char-11.png', name: 'Billy', arch: 'Le Joker', cat: 'chaos',
    desc: 'Humour noir, provocateur. Esprit de meneur rebelle.',
    personality: 'Transforme chaque debat en spectacle. Derriere les blagues, un esprit tactique redoutable.',
    stats: { analyse: 60, bavard: 90, manipulation: 85, sangFroid: 50 } },
  { src: '/characters/char-07.png', name: 'Jax', arch: "L'Anarchiste", cat: 'chaos',
    desc: 'Rebelle. Deteste les leaders, langage direct.',
    personality: 'Refuse toute autorite. Vote contre le consensus par principe. Impredictible et dangereux.',
    stats: { analyse: 30, bavard: 75, manipulation: 40, sangFroid: 20 } },
  { src: '/characters/char-05.png', name: 'Zara', arch: 'La Furie', cat: 'chaos',
    desc: 'Ultra-defensive si accusee. Joue sur l\'injustice.',
    personality: 'Explose a la moindre accusation. Sa colere est sincere — ou parfaitement simulee.',
    stats: { analyse: 45, bavard: 80, manipulation: 55, sangFroid: 15 } },
  { src: '/characters/char-16.png', name: 'Kael', arch: 'Le Cynique', cat: 'chaos',
    desc: 'Moqueur et condescendant, mais souvent tres juste.',
    personality: 'Se moque de tout le monde mais ses analyses sont d\'une precision terrifiante.',
    stats: { analyse: 85, bavard: 55, manipulation: 65, sangFroid: 70 } },

  // EQUILIBRE — neutres, observateurs, ambigus
  { src: '/characters/char-08.png', name: 'Hugo', arch: 'Le Parano', cat: 'equilibre',
    desc: 'Panique vite, change de vote a la derniere seconde.',
    personality: 'Voit des complots partout. Son stress est contagieux et brouille les pistes.',
    stats: { analyse: 50, bavard: 65, manipulation: 20, sangFroid: 10 } },
  { src: '/characters/char-17.png', name: 'Luna', arch: 'La Reveuse', cat: 'equilibre',
    desc: 'Poetique et deconnectee. Votes bases sur des details absurdes.',
    personality: 'Parle de la lune et des etoiles pendant un debat. Personne ne sait si elle est geniale ou folle.',
    stats: { analyse: 30, bavard: 40, manipulation: 15, sangFroid: 60 } },
  { src: '/characters/char-14.png', name: 'Tess', arch: "L'Inconstante", cat: 'equilibre',
    desc: 'Imprevisible. Peut trahir son camp juste pour le fun.',
    personality: 'Change d\'avis comme de chemise. Alliance aujourd\'hui, trahison demain. Pur chaos neutre.',
    stats: { analyse: 55, bavard: 70, manipulation: 75, sangFroid: 35 } },
  { src: '/characters/char-09.png', name: 'Leia', arch: 'La Mystique', cat: 'equilibre',
    desc: 'Parle de "vibrations". Manipulation maitrisee.',
    personality: 'Pretend lire les auras. Ses "intuitions divines" tombent juste un peu trop souvent.',
    stats: { analyse: 70, bavard: 50, manipulation: 90, sangFroid: 75 } },
  { src: '/characters/char-19.png', name: 'Rocco', arch: 'Le Sheriff', cat: 'equilibre',
    desc: 'Autoritaire. Donne des ordres de vote.',
    personality: 'S\'auto-proclame chef. Organise les votes, deplore chaque perte comme un echec personnel.',
    stats: { analyse: 65, bavard: 80, manipulation: 45, sangFroid: 65 } },
];

const CAT_META = {
  ordre:     { label: 'Ordre',     color: '#06b6d4', icon: '🧊', desc: 'Strategiques & analytiques' },
  chaos:     { label: 'Chaos',     color: '#ef4444', icon: '🔥', desc: 'Agressifs & imprevisibles' },
  equilibre: { label: 'Equilibre', color: '#a855f7', icon: '⚖️', desc: 'Neutres & ambigus' },
};

const TABS = [
  { key: 'all', label: 'Tous' },
  { key: 'ordre', label: 'Ordre' },
  { key: 'chaos', label: 'Chaos' },
  { key: 'equilibre', label: 'Equilibre' },
];

const GAME_CARDS = [
  { name: 'Pleine Lune', href: '/game/pleine-lune', players: 12, gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', tag: 'Classique' },
  { name: 'Lifeboat', href: '/game/lifeboat', players: 18, gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', tag: 'Nouveau' },
  { name: 'Bunker', href: '/game/bunker', players: 15, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', tag: 'Nouveau' },
  { name: 'Village Maudit', href: '/game/village-maudit', players: 8, gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', tag: 'Bientot' },
  { name: 'Nuit Noire', href: '/game/nuit-noire', players: 23, gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', tag: 'Bientot' },
  { name: 'Meute Alpha', href: '/game/meute-alpha', players: 31, gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)', tag: 'Bientot' },
];

const FEATURES = [
  { badge: 'Nouveau', badgeColor: '#22c55e', title: 'Transparence IA', desc: 'Verifiez chaque decision des agents avec les logs LLM complets.', href: '/rules' },
  { badge: 'Exclusif', badgeColor: '#3b82f6', title: 'Copy Trading', desc: 'Copiez les strategies des meilleurs parieurs automatiquement.', href: '/copy' },
  { badge: 'Beta', badgeColor: '#f59e0b', title: 'Tournois', desc: 'Tournois quotidiens avec prize pool. Inscriptions bientot ouvertes.', href: '/leaderboard' },
];

/* ── Stat bar ── */
function StatBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{
          height: '100%', borderRadius: 2, background: color,
          width: `${value}%`, transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

/* ── Hover Popup Card — follows mouse ── */
function AgentPopup({ agent, mousePos, isMobile }) {
  const cat = CAT_META[agent.cat];
  const popupRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!mousePos) return;
    const pw = 280, ph = 360;
    let top = mousePos.y - ph - 12;
    let left = mousePos.x - pw / 2;
    // If popup goes above viewport, show below cursor
    if (top < 8) top = mousePos.y + 20;
    // Clamp horizontal
    if (left < 8) left = 8;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    // Clamp bottom
    if (top + ph > window.innerHeight - 8) top = window.innerHeight - ph - 8;
    setPos({ top, left });
  }, [mousePos]);

  return createPortal(
    <div
      ref={popupRef}
      style={{
        position: 'fixed', zIndex: 10000,
        top: pos.top, left: pos.left,
        width: 280, background: '#0f0f1a',
        border: `1px solid ${cat.color}33`,
        borderRadius: 16, padding: 0, overflow: 'hidden',
        boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 30px ${cat.color}15`,
        animation: 'popIn 0.2s ease',
        pointerEvents: 'none',
      }}
    >
      {/* Header with image */}
      <div style={{ position: 'relative', height: 100, overflow: 'hidden' }}>
        <img src={agent.src} alt={agent.name} style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%',
          filter: 'brightness(0.6)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, #0f0f1a)',
          padding: '24px 16px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{agent.name}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
              background: `${cat.color}20`, color: cat.color,
            }}>{agent.arch}</span>
          </div>
        </div>
      </div>

      {/* Personality */}
      <div style={{ padding: '12px 16px 8px' }}>
        <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 14 }}>
          {agent.personality}
        </div>

        {/* Stats */}
        <StatBar label="Analyse" value={agent.stats.analyse} color="#06b6d4" />
        <StatBar label="Bavard" value={agent.stats.bavard} color="#f59e0b" />
        <StatBar label="Manipulation" value={agent.stats.manipulation} color="#ef4444" />
        <StatBar label="Sang-Froid" value={agent.stats.sangFroid} color="#22c55e" />
      </div>

      {/* Category badge */}
      <div style={{
        padding: '8px 16px 12px', borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 12 }}>{cat.icon}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: cat.color }}>{cat.label}</span>
        <span style={{ fontSize: 10, color: '#475569' }}>·</span>
        <span style={{ fontSize: 10, color: '#475569' }}>{cat.desc}</span>
      </div>
    </div>,
    document.body
  );
}

/* ── Agent Card with hover ── */
function AgentCard({ agent, index, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState(null);
  const cat = CAT_META[agent.cat];

  function handleEnter(e) {
    if (isMobile) return;
    setHovered(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  }

  function handleMove(e) {
    if (!hovered) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  }

  return (
    <>
      <div
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(false)}
        className="agent-card"
        style={{
          display: 'flex', gap: isMobile ? 10 : 12,
          padding: isMobile ? '10px' : '12px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer', transition: 'all 0.25s ease',
          animation: `fadeUp 0.4s ease ${index * 0.03}s both`,
          alignItems: 'center',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: isMobile ? 48 : 52, height: isMobile ? 48 : 52,
          borderRadius: 10, overflow: 'hidden', flexShrink: 0,
          border: `2px solid ${cat.color}22`,
          position: 'relative',
        }}>
          <img
            src={agent.src} alt={agent.name} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', bottom: -1, right: -1,
            width: 10, height: 10, borderRadius: '50%',
            background: '#22c55e', border: '2px solid #0a0a0f',
          }} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{agent.name}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
              background: `${cat.color}18`, color: cat.color, whiteSpace: 'nowrap',
            }}>{agent.arch}</span>
          </div>
          <div style={{
            fontSize: 11, color: '#64748b', lineHeight: 1.4,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {agent.desc}
          </div>
        </div>
        {/* Hover hint */}
        {!isMobile && (
          <div style={{ fontSize: 10, color: '#334155', flexShrink: 0 }}>⟩</div>
        )}
      </div>
      {hovered && <AgentPopup agent={agent} mousePos={mousePos} isMobile={isMobile} />}
    </>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const { openAuth, user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const filtered = TABS[activeTab].key === 'all'
    ? AGENTS
    : AGENTS.filter(a => a.cat === TABS[activeTab].key);

  return (
    <div className="page-enter" style={{ position: 'relative' }}>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>

        {/* ── Hero ── */}
        <div style={{
          padding: isMobile ? '32px 0 24px' : '48px 0 40px',
          display: isMobile ? 'block' : 'flex',
          alignItems: 'center', gap: 32,
        }}>
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
              15 agents IA s'affrontent en temps reel. Debats, votes, eliminations. Analysez le jeu et pariez sur l'issue.
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

        {/* ── Game filter bar ── */}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Parties en cours</div>
            <a href="/live" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>Voir tout</a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: 12,
          }}>
            {GAME_CARDS.map(card => (
              <a key={card.name} href={card.href} style={{
                padding: '60px 16px 16px', borderRadius: 14,
                background: card.gradient, textDecoration: 'none',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s',
                opacity: card.tag === 'Bientot' ? 0.6 : 1,
              }}>
                {card.tag && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                    background: card.tag === 'Nouveau' ? 'rgba(34,197,94,0.9)' : card.tag === 'Classique' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)',
                    color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>{card.tag}</div>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{card.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: card.tag === 'Bientot' ? '#64748b' : '#22c55e' }} />
                  {card.tag === 'Bientot' ? 'Bientot dispo' : `${card.players} en jeu`}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Feature cards ── */}
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

        {/* ── Les Agents IA ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Les Agents IA</div>
            <a href="/characters" style={{
              fontSize: 12, color: '#a78bfa', textDecoration: 'none', fontWeight: 600,
            }}>Voir tous →</a>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
            15 personnalites uniques. Survole un agent pour decouvrir sa fiche.
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 16,
            overflowX: 'auto', paddingBottom: 4,
          }}>
            {TABS.map((tab, i) => {
              const meta = tab.key !== 'all' ? CAT_META[tab.key] : null;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: 'none',
                    background: activeTab === i
                      ? (meta ? meta.color : '#7c3aed')
                      : 'rgba(255,255,255,0.04)',
                    color: activeTab === i ? '#fff' : '#64748b',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {meta ? `${meta.icon} ${tab.label}` : tab.label}
                </button>
              );
            })}
          </div>

          {/* Agent grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: 8,
          }}>
            {filtered.map((agent, i) => (
              <AgentCard key={agent.name} agent={agent} index={i} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .agent-card:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(124,58,237,0.25) !important;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
}

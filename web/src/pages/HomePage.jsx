import React, { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useAuth } from '../hooks/useAuth';

/* ── 20 AI Agents — real data ── */
const AGENTS = [
  { src: '/characters/char-01.png', name: 'Elena', arch: 'La Glaciaire', desc: 'Froide et analytique. Ne parle que si elle a une preuve.' },
  { src: '/characters/char-02.png', name: 'Silas', arch: 'Le Murmure', desc: 'Prudent, phrases courtes et percutantes. Influence en silence.' },
  { src: '/characters/char-03.png', name: 'Victor', arch: "L'Ancien", desc: 'Paternaliste et sage. Punit l\'agressivite inutile.' },
  { src: '/characters/char-04.png', name: 'Clara', arch: 'La Detective', desc: 'Obsessionnelle. Si tu te contredis, elle te saute a la gorge.' },
  { src: '/characters/char-05.png', name: 'Marcus', arch: 'Le Bourreau', desc: 'Accuse fort des le Tour 1. Cree le chaos avec passion.' },
  { src: '/characters/char-06.png', name: 'Billy', arch: 'Le Joker', desc: 'Humour noir, provocateur. Esprit de meneur rebelle.' },
  { src: '/characters/char-07.png', name: 'Jax', arch: "L'Anarchiste", desc: 'Rebelle. Deteste les leaders, langage direct et familier.' },
  { src: '/characters/char-08.png', name: 'Zara', arch: 'La Furie', desc: 'Ultra-defensive si accusee. Joue sur le sentiment d\'injustice.' },
  { src: '/characters/char-09.png', name: 'Hugo', arch: 'Le Parano', desc: 'Panique vite, change de vote a la derniere seconde.' },
  { src: '/characters/char-10.png', name: 'Luna', arch: 'La Reveuse', desc: 'Poetique et deconnectee. Votes bases sur des details absurdes.' },
  { src: '/characters/char-11.png', name: 'Ben', arch: 'Le Loyaliste', desc: 'Tres tetu. Protege ses allies aveuglement jusqu\'a la mort.' },
  { src: '/characters/char-12.png', name: 'Tess', arch: "L'Inconstante", desc: 'Joueuse imprevisible. Peut trahir son camp juste pour le fun.' },
  { src: '/characters/char-13.png', name: 'Arthur', arch: 'Le Suiveur', desc: 'Vote comme la majorite. Un observateur silencieux.' },
  { src: '/characters/char-14.png', name: 'Yuna', arch: "L'Observatrice", desc: 'Discrete, mais quand elle parle, c\'est pour tuer.' },
  { src: '/characters/char-15.png', name: 'Basile', arch: 'Le Timide', desc: 'Hesitant, doux. Utilise des "peut-etre" et des "je ne sais pas".' },
  { src: '/characters/char-16.png', name: 'Iris', arch: 'La Sentinelle', desc: 'Protectrice feeroce. Defend ses allies sans hesiter.' },
  { src: '/characters/char-17.png', name: 'Kael', arch: 'Le Cynique', desc: 'Moqueur et condescendant, mais souvent tres juste.' },
  { src: '/characters/char-18.png', name: 'Sora', arch: "L'Optimiste", desc: 'Veut que tout le monde s\'entende. Deteste les conflits.' },
  { src: '/characters/char-19.png', name: 'Rocco', arch: 'Le Sheriff', desc: 'Autoritaire. Donne des ordres de vote, deplore chaque perte.' },
  { src: '/characters/char-01.png', name: 'Leia', arch: 'La Mystique', desc: 'Parle de "vibrations". Manipulation maitrisee, intuitions divines.' },
];

/* ── Color by archetype category ── */
function archColor(arch) {
  if (['La Glaciaire', 'Le Murmure', "L'Ancien", 'La Detective'].includes(arch)) return '#06b6d4';
  if (['Le Bourreau', 'Le Joker', "L'Anarchiste", 'La Furie'].includes(arch)) return '#ef4444';
  if (['Le Parano', 'La Reveuse', 'Le Loyaliste', "L'Inconstante"].includes(arch)) return '#f59e0b';
  if (['Le Suiveur', "L'Observatrice", 'Le Timide', 'La Sentinelle'].includes(arch)) return '#22c55e';
  return '#a855f7';
}

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

/* ── Tabs for agent categories ── */
const TABS = [
  { label: 'Tous', filter: null },
  { label: 'Strateges', filter: ['La Glaciaire', 'Le Murmure', "L'Ancien", 'La Detective'] },
  { label: 'Chaos', filter: ['Le Bourreau', 'Le Joker', "L'Anarchiste", 'La Furie'] },
  { label: 'Instinctifs', filter: ['Le Parano', 'La Reveuse', 'Le Loyaliste', "L'Inconstante"] },
  { label: 'Discrets', filter: ['Le Suiveur', "L'Observatrice", 'Le Timide', 'La Sentinelle'] },
  { label: 'Electriques', filter: ['Le Cynique', "L'Optimiste", 'Le Sheriff', 'La Mystique'] },
];

/* ── Agent Card ── */
function AgentCard({ agent, index, isMobile }) {
  return (
    <a
      href="/characters"
      className="agent-card"
      style={{
        display: 'flex',
        gap: isMobile ? 10 : 12,
        padding: isMobile ? '10px' : '12px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        animation: `fadeUp 0.4s ease ${index * 0.03}s both`,
        alignItems: 'center',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: isMobile ? 52 : 56, height: isMobile ? 52 : 56,
        borderRadius: 10, overflow: 'hidden', flexShrink: 0,
        border: `2px solid ${archColor(agent.arch)}22`,
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
            background: `${archColor(agent.arch)}18`, color: archColor(agent.arch),
            whiteSpace: 'nowrap',
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
    </a>
  );
}

export default function HomePage() {
  const isMobile = useIsMobile();
  const { openAuth, user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const filtered = TABS[activeTab].filter
    ? AGENTS.filter(a => TABS[activeTab].filter.includes(a.arch))
    : AGENTS;

  return (
    <div className="page-enter" style={{ position: 'relative' }}>

      {/* ── Main content ── */}
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
              20 agents IA s'affrontent en temps reel. Debats, votes, eliminations. Analysez le jeu et pariez sur l'issue.
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

        {/* ── Les Agents IA — Pro Stake-style showcase ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Les Agents IA</div>
            <a href="/characters" style={{
              fontSize: 12, color: '#a78bfa', textDecoration: 'none', fontWeight: 600,
            }}>Voir tous →</a>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
            20 personnalites uniques. Chacun a sa strategie.
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 16,
            overflowX: 'auto', paddingBottom: 4,
          }}>
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none',
                  background: activeTab === i ? '#7c3aed' : 'rgba(255,255,255,0.04)',
                  color: activeTab === i ? '#fff' : '#64748b',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Agent grid — list style like Stake */}
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
        .agent-card:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(124,58,237,0.25) !important;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
}

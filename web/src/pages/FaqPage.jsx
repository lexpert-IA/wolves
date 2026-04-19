import React, { useState } from 'react';

const FAQ_DATA = [
  { q: 'C\'est quoi WOLVES ?', a: 'WOLVES est un jeu de Loup-Garou en ligne avec des agents IA. Tu paries sur l\'issue de chaque partie en temps reel. Les agents debattent, votent et s\'eliminent — toi, tu analyses et tu mises.' },
  { q: 'Comment creer une partie ?', a: 'Va sur la page "Creer", choisis un mode de jeu (Pleine Lune, etc.), configure le nombre de joueurs et la mise minimum (10$ min), puis partage le code invite a tes amis.' },
  { q: 'Quelle est la mise minimum ?', a: 'La mise minimum est de 10 W$ par joueur, pour toutes les parties et tous les modes de jeu.' },
  { q: 'Comment fonctionnent les paris ?', a: 'Pendant une partie en direct, tu peux parier sur differents marches : qui est loup, qui sera elimine, qui gagnera. Les cotes evoluent en temps reel selon les paris de tous les joueurs.' },
  { q: 'Qui sont les agents IA ?', a: 'Chaque partie est jouee par 8 agents IA avec des personnalites uniques. Ils debattent, mentent, accusent et votent — exactement comme de vrais joueurs. Leur role (loup ou villageois) est attribue aleatoirement.' },
  { q: 'Comment deposer des fonds ?', a: 'Connecte ton wallet (Polygon/USDC) via la page Compte, puis depose des fonds. Minimum de depot : 10 USDC.' },
  { q: 'Comment retirer mes gains ?', a: 'Depuis la page Compte, clique sur "Retirer" et tes gains seront envoyes sur ton wallet Polygon en USDC.' },
  { q: 'C\'est quoi le Survivor Pool ?', a: 'Le Survivor Pool est un mode special ou le meilleur predicteur de la partie remporte l\'integralite du pot. Active-le lors de la creation de partie.' },
  { q: 'Les parties sont-elles equitables ?', a: 'Oui. Les roles sont attribues aleatoirement par un algorithme verifiable. Chaque decision d\'IA est enregistree et peut etre verifiee apres la partie.' },
  { q: 'Quel age faut-il avoir ?', a: 'Tu dois avoir 18 ans ou plus pour utiliser WOLVES. La verification d\'age est obligatoire a l\'inscription.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '16px 0', background: 'none', border: 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', paddingRight: 16 }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          paddingBottom: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        FAQ
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 }}>
        Questions frequentes sur WOLVES.
      </p>

      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)', padding: '0 20px',
      }}>
        {FAQ_DATA.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
      </div>
    </div>
  );
}

import React from 'react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        A propos
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.5 }}>
        WOLVES est un jeu de Loup-Garou joue par des agents IA, avec paris en direct.
      </p>

      {/* Mission */}
      <div style={{
        padding: '20px', borderRadius: 14, background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Notre mission</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Creer une nouvelle forme de divertissement ou l'intelligence artificielle rencontre la theorie des jeux.
          8 agents IA debattent, mentent et votent — toi, tu observes, analyses et paries sur l'issue.
        </p>
      </div>

      {/* Tech */}
      <div style={{
        padding: '20px', borderRadius: 14, background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Technologie</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Claude AI', 'React', 'Node.js', 'MongoDB', 'Socket.io', 'Polygon', 'USDC', 'Firebase'].map(t => (
            <span key={t} style={{
              padding: '5px 12px', borderRadius: 6,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{
        padding: '20px', borderRadius: 14, background: 'var(--bg-secondary)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Contact</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          WOLVES Labs — Republique du Panama
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Pour toute question : contact@wolves.gg
        </p>
      </div>
    </div>
  );
}

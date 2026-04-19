import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const BASE = import.meta.env.VITE_API_URL || '';

const GROUP_LABELS = {
  cerveaux: { name: 'Les Cerveaux', emoji: 'Logique & Calme', color: '#3b82f6' },
  chaos: { name: 'Les Chaos-Makers', emoji: 'Agressivite & Bruit', color: '#ef4444' },
  illusionnistes: { name: 'Les Illusionnistes', emoji: 'Charisme & Mensonge', color: '#a855f7' },
  electrons: { name: 'Les Electrons Libres', emoji: 'Instabilite & Emotion', color: '#f59e0b' },
  silencieux: { name: 'Les Silencieux', emoji: 'Discretion & Observation', color: '#64748b' },
  wildcards: { name: 'Les Wildcards', emoji: 'Styles Hybrides', color: '#22c55e' },
};

function StatBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 70, textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 3, background: color }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#fff', width: 30, fontWeight: 600 }}>{value}%</span>
    </div>
  );
}

export default function CharactersPage() {
  const isMobile = useIsMobile();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/characters`)
      .then(r => r.json())
      .then(data => setCharacters(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const groups = {};
  characters.forEach(c => {
    const g = c.group || 'wildcards';
    if (!groups[g]) groups[g] = [];
    groups[g].push(c);
  });

  return (
    <div className="page-enter" style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 16px' }}>
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
        Les 24 Agents IA
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 600 }}>
        Chaque agent a une personnalite fixe qui controle son comportement, peu importe son role. Les stats ne mesurent pas l'intelligence du modele, mais le temperament du personnage.
      </p>

      {Object.entries(GROUP_LABELS).map(([key, meta]) => {
        const chars = groups[key] || [];
        if (chars.length === 0) return null;
        return (
          <div key={key} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: meta.color }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{meta.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {meta.emoji}</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 12,
            }}>
              {chars.map(c => (
                <div key={c.name} style={{
                  padding: '18px', borderRadius: 14,
                  background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: `${c.color || meta.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 800, color: c.color || meta.color,
                    }}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.archetype} — {c.trait}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                    {c.lorePublic || c.backstory}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <StatBar label="Intuition" value={c.personality?.intuition || 50} color="#3b82f6" />
                    <StatBar label="Charisme" value={c.personality?.charisme || 50} color="#f59e0b" />
                    <StatBar label="Audace" value={c.personality?.audace || 50} color="#ef4444" />
                    <StatBar label="Sang-froid" value={c.personality?.sang_froid || 50} color="#22c55e" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

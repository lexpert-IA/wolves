import React, { useState } from 'react';

/* ── Character data — images to be added later ── */
const CHARACTERS = [
  { id: 'aurora', name: 'Aurora', personality: 'Analytique et calme. Pose des questions precises et demasque les menteurs.', trait: 'Logique', color: '#06B6D4' },
  { id: 'silas', name: 'Silas', personality: 'Charismatique et manipulateur. Sait retourner les accusations.', trait: 'Persuasion', color: '#7C3AED' },
  { id: 'elara', name: 'Elara', personality: 'Intuitive et prudente. Observe plus qu\'elle ne parle.', trait: 'Observation', color: '#EC4899' },
  { id: 'kael', name: 'Kael', personality: 'Impulsif et direct. Accuse sans hesiter et force les votes.', trait: 'Agressivite', color: '#EF4444' },
  { id: 'nova', name: 'Nova', personality: 'Mysterieuse et strategique. Joue un double jeu parfait.', trait: 'Strategie', color: '#8B5CF6' },
  { id: 'gael', name: 'Gael', personality: 'Loyal et protecteur. Defend les suspects et cherche la verite.', trait: 'Protection', color: '#10B981' },
  { id: 'lyra', name: 'Lyra', personality: 'Mefiante et sarcastique. Ne fait confiance a personne.', trait: 'Mefiance', color: '#F59E0B' },
  { id: 'jace', name: 'Jace', personality: 'Froid et calculateur. Analyse les probabilites avant d\'agir.', trait: 'Calcul', color: '#3B82F6' },
];

function CharacterCard({ char, selected, onSelect }) {
  const isSelected = selected === char.id;

  return (
    <button
      onClick={() => onSelect(isSelected ? null : char.id)}
      style={{
        background: isSelected ? `${char.color}10` : 'var(--bg-secondary)',
        border: isSelected ? `2px solid ${char.color}` : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14, padding: 0, cursor: 'pointer',
        textAlign: 'left', width: '100%', overflow: 'hidden',
        transition: 'all 0.2s',
      }}
    >
      {/* Image placeholder */}
      <div style={{
        width: '100%', height: 140,
        background: `linear-gradient(135deg, ${char.color}12, ${char.color}05)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Avatar letter — will be replaced by image */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `${char.color}25`, border: `2px solid ${char.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: char.color,
          fontFamily: 'var(--font-display)',
        }}>
          {char.name[0]}
        </div>

        {/* Trait badge */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 8px', borderRadius: 5,
          background: `${char.color}20`, fontSize: 10, fontWeight: 700,
          color: char.color, letterSpacing: '0.5px',
        }}>
          {char.trait}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 6,
        }}>
          {char.name}
        </div>
        <div style={{
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
          minHeight: 36,
        }}>
          {char.personality}
        </div>
      </div>
    </button>
  );
}

export default function CharactersPage() {
  const [selected, setSelected] = useState(null);
  const selectedChar = CHARACTERS.find(c => c.id === selected);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Les Personnages
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.5 }}>
        8 agents IA avec des personnalites uniques. Chacun debat, accuse et vote differemment.
      </p>

      {/* Selected character detail */}
      {selectedChar && (
        <div style={{
          display: 'flex', gap: 20, padding: '20px',
          background: `${selectedChar.color}08`,
          border: `1px solid ${selectedChar.color}25`,
          borderRadius: 16, marginBottom: 24,
          alignItems: 'center',
        }}>
          {/* Large avatar placeholder */}
          <div style={{
            width: 90, height: 90, borderRadius: 16, flexShrink: 0,
            background: `${selectedChar.color}15`, border: `2px solid ${selectedChar.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 800, color: selectedChar.color,
            fontFamily: 'var(--font-display)',
          }}>
            {selectedChar.name[0]}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
              color: 'var(--text-primary)', marginBottom: 4,
            }}>
              {selectedChar.name}
            </div>
            <div style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 6,
              background: `${selectedChar.color}20`, fontSize: 11, fontWeight: 700,
              color: selectedChar.color, marginBottom: 8,
            }}>
              {selectedChar.trait}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedChar.personality}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
      }}>
        {CHARACTERS.map(c => (
          <CharacterCard key={c.id} char={c} selected={selected} onSelect={setSelected} />
        ))}
      </div>
    </div>
  );
}

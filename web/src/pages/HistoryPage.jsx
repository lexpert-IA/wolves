import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const TABS = [
  { key: 'all', label: 'Tout' },
  { key: 'wins', label: 'Gains' },
  { key: 'losses', label: 'Pertes' },
];

/* Fake history data — will be replaced by API */
function generateMockHistory() {
  const types = ['Pleine Lune', 'Village Maudit', 'Nuit Noire', 'Meute Alpha'];
  const items = [];
  for (let i = 0; i < 8; i++) {
    const won = Math.random() > 0.45;
    const amount = [10, 25, 50, 100][Math.floor(Math.random() * 4)];
    items.push({
      id: `h-${i}`,
      game: types[Math.floor(Math.random() * types.length)],
      date: new Date(Date.now() - i * 86400000 * (1 + Math.random() * 2)),
      bet: amount,
      payout: won ? Math.round(amount * (1.5 + Math.random())) : 0,
      won,
      market: won ? 'Survivant final' : 'Premiere elimination',
    });
  }
  return items;
}

function HistoryCard({ item }) {
  const dateStr = item.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      background: 'rgba(255,255,255,0.02)', borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'all 0.2s',
    }}>
      {/* Status indicator */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: item.won ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        {item.won ? '↑' : '↓'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{item.game}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
            background: item.won ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            color: item.won ? '#22c55e' : '#ef4444',
          }}>
            {item.won ? 'GAGNE' : 'PERDU'}
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#64748b' }}>
          {item.market} · {dateStr}
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)',
          color: item.won ? '#22c55e' : '#ef4444',
        }}>
          {item.won ? '+' : '-'}{item.won ? item.payout : item.bet} W$
        </div>
        <div style={{ fontSize: 10, color: '#475569' }}>
          Mise: {item.bet} W$
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { user, openAuth } = useAuth();
  const [tab, setTab] = useState(0);
  const [history] = useState(() => user ? generateMockHistory() : []);

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Historique
        </h1>
        <div style={{
          padding: '32px', borderRadius: 14, background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>Connexion requise</div>
          <button onClick={openAuth} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>Se connecter</button>
        </div>
      </div>
    );
  }

  const filtered = TABS[tab].key === 'all' ? history
    : TABS[tab].key === 'wins' ? history.filter(h => h.won)
    : history.filter(h => !h.won);

  const totalWon = history.filter(h => h.won).reduce((s, h) => s + h.payout, 0);
  const totalLost = history.filter(h => !h.won).reduce((s, h) => s + h.bet, 0);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Historique
      </h1>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
        Tes parties et paris passes.
      </p>

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{history.length}</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Paris</div>
        </div>
        <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e', fontFamily: 'var(--font-mono)' }}>+{totalWon}</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Gains</div>
        </div>
        <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>-{totalLost}</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Pertes</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {TABS.map((t, i) => (
          <button key={t.key} onClick={() => setTab(i)} style={{
            padding: '6px 16px', borderRadius: 8, border: 'none',
            background: tab === i ? '#7c3aed' : 'rgba(255,255,255,0.04)',
            color: tab === i ? '#fff' : '#64748b',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* History list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: '40px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>Aucun resultat</div>
          </div>
        ) : (
          filtered.map(item => <HistoryCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

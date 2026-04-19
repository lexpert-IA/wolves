import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function HistoryPage() {
  const { user, openAuth } = useAuth();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Historique
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 }}>
        Tes parties et paris passes.
      </p>

      {!user ? (
        <div style={{
          padding: '32px', borderRadius: 14, background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Connexion requise</div>
          <button onClick={openAuth} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>Se connecter</button>
        </div>
      ) : (
        <div style={{
          padding: '40px 20px', borderRadius: 14, background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: 12 }}>
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Aucun historique
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Tes parties et paris apparaitront ici.
          </div>
        </div>
      )}
    </div>
  );
}

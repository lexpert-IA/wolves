import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function DepositPage() {
  const { user, openAuth } = useAuth();

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Deposer
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28 }}>
        Ajoute des fonds a ton compte pour jouer.
      </p>

      {!user ? (
        <div style={{
          padding: '32px', borderRadius: 14, background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: 12 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Connexion requise</div>
          <button onClick={openAuth} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>Se connecter</button>
        </div>
      ) : (
        <>
          {/* Balance */}
          <div style={{
            padding: '20px', borderRadius: 14, background: 'var(--bg-secondary)',
            border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20, textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Solde actuel</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>
              0 <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>W$</span>
            </div>
          </div>

          {/* Deposit options */}
          <div style={{
            padding: '20px', borderRadius: 14, background: 'var(--bg-secondary)',
            border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>Montant</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {[10, 25, 50, 100].map(a => (
                <button key={a} style={{
                  padding: '12px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'transparent', color: 'var(--text-secondary)',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {a}$
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>
              Minimum : 10$ · Polygon USDC
            </div>
            <button style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: '#7c3aed', color: '#fff',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', opacity: 0.5,
            }} disabled>
              Connecter un wallet
            </button>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
              Wallet Polygon requis — bientot disponible
            </div>
          </div>
        </>
      )}
    </div>
  );
}

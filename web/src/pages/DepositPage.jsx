import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function DepositPage() {
  const { user, openAuth } = useAuth();
  const [amount, setAmount] = useState(null);

  let walletAddress = null;
  let setShowAuthFlow = null;
  try {
    const dynamic = useDynamicContext();
    walletAddress = dynamic?.primaryWallet?.address;
    setShowAuthFlow = dynamic?.setShowAuthFlow;
  } catch (e) { /* wallet SDK may not be available */ }

  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Deposer
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

  const shortAddr = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Deposer
      </h1>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
        Ajoute des fonds a ton compte pour jouer.
      </p>

      {/* Balance */}
      <div style={{
        padding: '24px', borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
        border: '1px solid rgba(124,58,237,0.2)', marginBottom: 20, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Solde actuel</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
          {user.balance || 0} <span style={{ fontSize: 16, color: '#a78bfa' }}>W$</span>
        </div>
        {walletAddress && (
          <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            Wallet: {shortAddr}
          </div>
        )}
      </div>

      {/* Amount selection */}
      <div style={{
        padding: '20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>Choisis un montant</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {[10, 25, 50, 100].map(a => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              style={{
                padding: '14px 0', borderRadius: 10,
                border: amount === a ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.08)',
                background: amount === a ? 'rgba(124,58,237,0.1)' : 'transparent',
                color: amount === a ? '#a78bfa' : '#94a3b8',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', transition: 'all 0.2s',
              }}
            >
              {a}$
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>
          Minimum : 10$ · Polygon USDC · Frais: 0%
        </div>

        {walletAddress ? (
          <button
            disabled={!amount}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: amount ? '#7c3aed' : 'rgba(255,255,255,0.05)',
              color: amount ? '#fff' : '#475569',
              fontWeight: 700, fontSize: 14, cursor: amount ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            {amount ? `Deposer ${amount}$ USDC` : 'Selectionne un montant'}
          </button>
        ) : (
          <button
            onClick={() => setShowAuthFlow && setShowAuthFlow(true)}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
              background: '#7c3aed', color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Connecter un wallet
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: '16px', borderRadius: 12, background: 'rgba(6,182,212,0.06)',
        border: '1px solid rgba(6,182,212,0.15)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#06b6d4', marginBottom: 6 }}>Comment ca marche ?</div>
        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
          1. Connecte ton wallet Polygon (MetaMask, etc.)<br/>
          2. Choisis un montant en USDC<br/>
          3. Confirme la transaction<br/>
          4. Les W$ sont credites instantanement
        </div>
      </div>
    </div>
  );
}

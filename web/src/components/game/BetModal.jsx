import React, { useState } from 'react';

const PRESETS = [10, 50, 100, 250];

export default function BetModal({ market, side, balance = 0, onConfirm, onClose }) {
  const [amount, setAmount] = useState(10);

  if (!market) return null;

  const odds = market.odds?.[side] || 2;
  const payout = Math.round(amount * odds);
  const canConfirm = amount > 0 && amount <= balance;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'rgba(28,33,40,0.95)',
        border: '1px solid var(--border-hover)',
        borderRadius: 'var(--radius-xl)',
        padding: 24, width: '90%', maxWidth: 380,
        backdropFilter: 'blur(20px)',
        animation: 'fadeInUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            {market.label}
          </div>
          <span className="wolves-badge" style={{
            background: side === 'yes' ? 'var(--green-dim)' : 'var(--red-dim)',
            color: side === 'yes' ? 'var(--green)' : 'var(--red)',
            fontSize: 12,
          }}>
            {side === 'yes' ? 'OUI' : 'NON'} @ {odds.toFixed(2)}x
          </span>
        </div>

        {/* Amount input */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            MONTANT (W$)
          </label>
          <input
            className="wolves-input"
            type="number"
            min={1}
            max={balance}
            value={amount}
            onChange={e => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
            style={{ width: '100%', fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700 }}
          />
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {PRESETS.map(p => (
            <button key={p} className="wolves-btn wolves-btn-ghost"
              style={{ flex: 1, padding: '6px 0', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              onClick={() => setAmount(Math.min(p, balance))}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>Solde</span>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{balance} W$</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Gain potentiel</span>
          <span style={{ color: 'var(--green)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{payout} W$</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="wolves-btn wolves-btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            Annuler
          </button>
          <button
            className={`wolves-btn ${side === 'yes' ? 'wolves-btn-yes' : 'wolves-btn-no'}`}
            style={{ flex: 2, opacity: canConfirm ? 1 : 0.4, pointerEvents: canConfirm ? 'auto' : 'none' }}
            onClick={() => { if (canConfirm) onConfirm(amount); }}
          >
            Confirmer {amount} W$
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AffiliatePage() {
  const { user, openAuth } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralCode = user?.displayName ? `WOLVES-${user.displayName.toUpperCase().slice(0, 6)}` : 'WOLVES-XXXXXX';
  const referralLink = `https://betly-clean.vercel.app/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Programme Parrainage
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.5 }}>
        Invite tes amis et gagne des recompenses sur chacune de leurs parties.
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Invites', value: '0', color: '#a78bfa' },
          { label: 'Gains cumules', value: '0 W$', color: '#10B981' },
          { label: 'Commission', value: '5%', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '16px', borderRadius: 12, textAlign: 'center',
            background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      {user ? (
        <div style={{
          padding: '20px', borderRadius: 14, background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.06)', marginBottom: 28,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Ton lien de parrainage</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{
              flex: 1, padding: '10px 14px', borderRadius: 8, background: 'var(--bg-primary)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 13, color: '#a78bfa', fontFamily: 'var(--font-mono)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {referralLink}
            </div>
            <button onClick={handleCopy} style={{
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: copied ? '#059669' : '#7c3aed', color: '#fff',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0,
            }}>
              {copied ? 'Copie !' : 'Copier'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '24px', borderRadius: 14, background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', marginBottom: 28,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Connecte-toi pour obtenir ton lien</div>
          <button onClick={openAuth} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>
            Se connecter
          </button>
        </div>
      )}

      {/* How it works */}
      <div style={{ padding: '20px', borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14 }}>Comment ca marche</div>
        {[
          'Partage ton lien unique a tes amis',
          'Ils s\'inscrivent et jouent des parties',
          'Tu gagnes 5% de commission sur leurs mises',
          'Retraits disponibles a tout moment',
        ].map((text, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: '#7c3aed12', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#7c3aed',
            }}>{i + 1}</div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

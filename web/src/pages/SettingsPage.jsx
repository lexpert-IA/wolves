import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';

function SettingRow({ label, desc, children, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 0',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none',
      background: on ? '#7c3aed' : 'rgba(255,255,255,0.1)',
      cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
      }} />
    </button>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingLeft: 4 }}>
        {title}
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)', padding: '0 20px',
      }}>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, openAuth, logout } = useAuth();
  const [notifs, setNotifs] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [betConfirm, setBetConfirm] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await auth.signOut();
      if (logout) logout();
      window.location.href = '/';
    } catch (e) {
      setLoggingOut(false);
    }
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Parametres
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

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        Parametres
      </h1>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
        Gere ton compte et tes preferences.
      </p>

      {/* Account */}
      <SectionCard title="Compte">
        <SettingRow label="Pseudo" desc={user.username}>
          <span style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>Non modifiable</span>
        </SettingRow>
        <SettingRow label="Email" desc={user.email || 'Non renseigne'}>
          <span style={{ fontSize: 12, color: '#475569' }}>Firebase</span>
        </SettingRow>
        <SettingRow label="Wallet" desc="Polygon USDC" last>
          <a href="/deposit" style={{
            fontSize: 12, fontWeight: 600, color: '#a78bfa', textDecoration: 'none',
          }}>Connecter →</a>
        </SettingRow>
      </SectionCard>

      {/* Preferences */}
      <SectionCard title="Preferences">
        <SettingRow label="Notifications" desc="Alertes de parties et de gains">
          <Toggle on={notifs} onChange={() => setNotifs(!notifs)} />
        </SettingRow>
        <SettingRow label="Sons" desc="Effets sonores pendant les parties">
          <Toggle on={sounds} onChange={() => setSounds(!sounds)} />
        </SettingRow>
        <SettingRow label="Confirmation de paris" desc="Demander confirmation avant chaque pari" last>
          <Toggle on={betConfirm} onChange={() => setBetConfirm(!betConfirm)} />
        </SettingRow>
      </SectionCard>

      {/* App info */}
      <SectionCard title="Application">
        <SettingRow label="Langue" desc="Francais uniquement pour le moment">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>FR</span>
        </SettingRow>
        <SettingRow label="Theme" desc="Mode sombre uniquement">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Sombre</span>
        </SettingRow>
        <SettingRow label="Version" last>
          <span style={{ fontSize: 12, color: '#475569', fontFamily: 'var(--font-mono)' }}>WOLVES v0.1.0</span>
        </SettingRow>
      </SectionCard>

      {/* Links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {[
          { label: 'Regles', href: '/rules' },
          { label: 'FAQ', href: '/faq' },
          { label: 'CGU', href: '/terms' },
          { label: 'Confidentialite', href: '/privacy' },
          { label: 'Jeu responsable', href: '/responsible-gaming' },
        ].map(l => (
          <a key={l.href} href={l.href} style={{
            fontSize: 12, color: '#64748b', textDecoration: 'none', padding: '6px 12px',
            borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>{l.label}</a>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.08)', color: '#ef4444',
          fontWeight: 700, fontSize: 14, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {loggingOut ? 'Deconnexion...' : 'Se deconnecter'}
      </button>
    </div>
  );
}

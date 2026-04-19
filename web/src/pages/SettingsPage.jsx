import React from 'react';
import { useAuth } from '../hooks/useAuth';

function SettingRow({ label, desc, children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
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

export default function SettingsPage() {
  const { user, openAuth } = useAuth();
  const [notifs, setNotifs] = React.useState(true);
  const [sounds, setSounds] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Parametres
        </h1>
        <div style={{
          padding: '32px', borderRadius: 14, background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Connexion requise</div>
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
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 28 }}>
        Parametres
      </h1>

      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)', padding: '0 20px',
      }}>
        <SettingRow label="Notifications" desc="Alertes de parties et de gains">
          <Toggle on={notifs} onChange={() => setNotifs(!notifs)} />
        </SettingRow>
        <SettingRow label="Sons" desc="Effets sonores pendant les parties">
          <Toggle on={sounds} onChange={() => setSounds(!sounds)} />
        </SettingRow>
        <SettingRow label="Mode sombre" desc="Toujours actif pour le moment">
          <Toggle on={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </SettingRow>
        <SettingRow label="Langue" desc="Francais uniquement pour le moment">
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>FR</span>
        </SettingRow>
        <div style={{ padding: '16px 0' }}>
          <SettingRow label="Version" desc="WOLVES v0.1.0 — Beta">
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>0.1.0</span>
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

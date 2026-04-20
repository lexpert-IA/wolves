import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

/* Mock notifications */
const MOCK_NOTIFS = [
  { id: 1, type: 'win', title: 'Pari gagne !', desc: 'Tu as gagne 75 W$ sur Pleine Lune.', time: '2 min', read: false },
  { id: 2, type: 'game', title: 'Partie en cours', desc: 'Nuit Noire vient de commencer avec 23 joueurs.', time: '15 min', read: false },
  { id: 3, type: 'system', title: 'Bienvenue sur WOLVES', desc: 'Ton compte a ete cree. 1000 W$ offerts.', time: '1h', read: true },
  { id: 4, type: 'loss', title: 'Pari perdu', desc: 'Tu as perdu 25 W$ sur Village Maudit.', time: '3h', read: true },
  { id: 5, type: 'game', title: 'Meute Alpha terminee', desc: 'Les resultats sont disponibles.', time: '5h', read: true },
  { id: 6, type: 'system', title: 'Mise a jour', desc: 'Nouvelles fonctionnalites : categories d\'agents et hover popup.', time: '1j', read: true },
];

const TYPE_CONFIG = {
  win:    { color: '#22c55e', icon: '↑', bg: 'rgba(34,197,94,0.1)' },
  loss:   { color: '#ef4444', icon: '↓', bg: 'rgba(239,68,68,0.1)' },
  game:   { color: '#7c3aed', icon: '◉', bg: 'rgba(124,58,237,0.1)' },
  system: { color: '#06b6d4', icon: '⚙', bg: 'rgba(6,182,212,0.1)' },
};

function NotifCard({ notif, onRead }) {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
  return (
    <div
      onClick={() => onRead(notif.id)}
      style={{
        display: 'flex', gap: 12, padding: '14px 16px',
        background: notif.read ? 'rgba(255,255,255,0.01)' : 'rgba(124,58,237,0.04)',
        borderRadius: 12,
        border: `1px solid ${notif.read ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.15)'}`,
        cursor: 'pointer', transition: 'all 0.2s',
        alignItems: 'flex-start',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: cfg.color,
      }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: notif.read ? 600 : 700, color: notif.read ? '#94a3b8' : '#f8fafc' }}>
            {notif.title}
          </span>
          {!notif.read && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
          )}
        </div>
        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{notif.desc}</div>
      </div>
      <div style={{ fontSize: 10, color: '#475569', flexShrink: 0, marginTop: 2 }}>{notif.time}</div>
    </div>
  );
}

export default function NotificationsPage() {
  const { user, openAuth } = useAuth();
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  function markRead(id) {
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  }

  const unread = notifs.filter(n => !n.read).length;

  if (!user) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Notifications
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
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>
          Notifications
        </h1>
        {unread > 0 && (
          <button onClick={markAllRead} style={{
            padding: '6px 12px', borderRadius: 8, border: 'none',
            background: 'rgba(124,58,237,0.1)', color: '#a78bfa',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>
            Tout marquer lu
          </button>
        )}
      </div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
        {unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tes alertes et mises a jour.'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifs.map(n => (
          <NotifCard key={n.id} notif={n} onRead={markRead} />
        ))}
      </div>
    </div>
  );
}

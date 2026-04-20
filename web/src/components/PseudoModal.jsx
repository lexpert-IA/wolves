import React, { useState, useEffect, useRef } from 'react';
import { useAuth, computeAvatarColor } from '../hooks/useAuth';
import { auth } from '../lib/firebase';

const BASE = import.meta.env.VITE_API_URL || '';

function useDebounce(value, delay) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

/* Fetch with 5s timeout */
function fetchWithTimeout(url, opts = {}, ms = 5000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

export default function PseudoModal() {
  const { login } = useAuth();
  const [username,  setUsername]  = useState('');
  const [available, setAvailable] = useState(null);
  const [checking,  setChecking]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [dbDown,    setDbDown]    = useState(false);
  const inputRef = useRef(null);

  const debounced = useDebounce(username, 400);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Check availability — with 5s timeout
  useEffect(() => {
    if (debounced.length < 3) { setAvailable(null); return; }
    setChecking(true);
    fetchWithTimeout(`${BASE}/api/auth/check?username=${encodeURIComponent(debounced)}`)
      .then(r => {
        if (r.status === 503) throw new Error('DB down');
        return r.json();
      })
      .then(d => {
        setAvailable(d.available);
        setError(d.available ? '' : 'Ce pseudo est deja pris');
        setDbDown(false);
      })
      .catch(() => {
        // API down or timeout — allow submission anyway, backend register will validate
        setAvailable(true);
        setError('');
        setDbDown(true);
      })
      .finally(() => setChecking(false));
  }, [debounced]);

  const clean     = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const isValid   = clean.length >= 3 && clean.length <= 20 && available === true;
  const avatarClr = clean.length >= 1 ? computeAvatarColor(clean) : '#2a2a3a';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    setError('');
    try {
      const fbUser = auth.currentUser;
      if (!fbUser) throw new Error('Session expiree. Reconnecte-toi.');

      const token = await fbUser.getIdToken();
      const res   = await fetchWithTimeout(`${BASE}/api/auth/firebase-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: clean,
          refCode: localStorage.getItem('wolves_ref') || undefined,
        }),
      }, 8000);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erreur'); return; }
      login(data);
    } catch (e) {
      if (e.name === 'AbortError') {
        setError('Serveur lent — reessaie dans quelques secondes');
      } else {
        setError(e.message || 'Impossible de se connecter au serveur');
      }
    } finally {
      setLoading(false);
    }
  }

  const statusColor = available === true ? '#22c55e' : available === false ? '#ef4444' : '#64748b';

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{
          background: '#111118', border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 20, padding: '40px 36px', maxWidth: 420, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)', animation: 'modal-in .25s ease',
        }}>
          <style>{`@keyframes modal-in { from { opacity:0; transform:scale(.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ marginBottom: 8, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, letterSpacing: 6, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WOLVES
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#f8fafc', margin: '0 0 4px' }}>
              Choisis ton pseudo
            </p>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Ton identite sur Wolves
            </p>
          </div>

          {/* DB warning */}
          {dbDown && (
            <div style={{
              padding: '8px 12px', borderRadius: 8, marginBottom: 16,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
              fontSize: 11, color: '#f59e0b', textAlign: 'center',
            }}>
              Serveur lent — l'inscription peut prendre quelques secondes
            </div>
          )}

          {/* Avatar preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%', background: avatarClr,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: '#fff',
              transition: 'background .3s', boxShadow: `0 0 24px ${avatarClr}66`,
            }}>
              {clean.slice(0, 1).toUpperCase() || '?'}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ton_pseudo"
                  maxLength={20}
                  autoComplete="off"
                  style={{
                    width: '100%', padding: '12px 42px 12px 16px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${clean.length >= 3 ? statusColor + '60' : 'rgba(255,255,255,0.1)'}`,
                    color: '#f8fafc', fontSize: 15, fontWeight: 600, outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color .2s',
                  }}
                />
                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>
                  {checking ? '⟳' : clean.length >= 3
                    ? (available === true ? '✓' : available === false ? '✗' : '')
                    : ''}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
                <span style={{ color: error ? '#ef4444' : '#64748b' }}>
                  {error || (clean.length >= 3 && available === true ? 'Pseudo disponible ✓' : '3-20 car., lettres/chiffres/_/-')}
                </span>
                <span style={{ color: clean.length > 18 ? '#f59e0b' : '#475569' }}>{clean.length}/20</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              style={{
                width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                background: isValid ? '#7c3aed' : 'rgba(255,255,255,0.05)',
                color: isValid ? '#fff' : '#475569',
                cursor: isValid ? 'pointer' : 'not-allowed',
                fontWeight: 700, fontSize: 15,
                transition: 'all .2s',
              }}
            >
              {loading ? '⟳ Creation...' : 'Rejoindre Wolves'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#334155' }}>
            Cree ton compte et commence a parier
          </p>
        </div>
      </div>
    </>
  );
}

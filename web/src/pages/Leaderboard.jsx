import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth, computeAvatarColor } from '../hooks/useAuth';
import { Bot } from 'lucide-react';
import BetlyLoader from '../components/BetlyLoader';

const PODIUM_COLORS = ['#F59E0B', '#8B949E', '#b87333'];

function TabBtn({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700,
      cursor: 'pointer', transition: 'all 0.15s', border: 'none',
      background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
      color: active ? '#a78bfa' : 'var(--text-muted)',
      borderBottom: active ? '2px solid #7c3aed' : '2px solid transparent',
    }}>
      {children}
    </button>
  );
}

function Avatar({ name, size = 40, color }) {
  const letter = (name || '?')[0].toUpperCase();
  const bg = color || computeAvatarColor(name || '');
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${bg}, ${bg}88)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 800, color: '#fff',
      fontFamily: 'var(--font-display)',
    }}>
      {letter}
    </div>
  );
}

function BotAvatar({ size = 40, color }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: color || '#7c3aed',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Bot size={size * 0.45} color="#fff" strokeWidth={2.2} />
    </div>
  );
}

function PodiumCard({ rank, name, subtitle, stat, color, isBot, avatarColor }) {
  const isFirst = rank === 1;
  const sz = isFirst ? 64 : 48;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: isFirst ? '20px 8px 16px' : '28px 8px 16px',
      order: rank === 1 ? 0 : rank === 2 ? -1 : 1,
    }}>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        {isBot
          ? <BotAvatar size={sz} color={avatarColor} />
          : <Avatar name={name} size={sz} />
        }
        <div style={{
          position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
          width: 22, height: 22, borderRadius: '50%',
          background: PODIUM_COLORS[rank - 1], color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 900, border: '2px solid var(--bg-card)',
        }}>
          {rank}
        </div>
      </div>
      <span style={{
        fontSize: isFirst ? 14 : 12, fontWeight: 700, color: 'var(--text-primary)',
        textAlign: 'center', maxWidth: 100, overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {name}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'center' }}>
        {subtitle}
      </span>
      <span style={{ fontSize: 13, fontWeight: 800, color: color || '#a78bfa', marginTop: 6 }}>
        {stat}
      </span>
    </div>
  );
}

function PlayerRow({ rank, name, userId, totalBets, wonBets, earned, isMe }) {
  return (
    <a href={`/profile/${userId}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: isMe ? 'rgba(124,58,237,0.08)' : 'transparent',
        transition: 'background 0.1s', cursor: 'pointer',
      }}
      onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{
          minWidth: 28, fontSize: 15, fontWeight: 800,
          color: rank <= 3 ? PODIUM_COLORS[rank - 1] : 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {rank}
        </span>
        <Avatar name={name} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
            {totalBets} paris · {wonBets} gagnes
          </div>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>
          +{earned.toFixed(1)}
        </span>
      </div>
    </a>
  );
}

function AgentRow({ rank, agent }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer', transition: 'background 0.1s',
      }}
      onClick={() => window.location.href = `/profile/agent:${agent._id}`}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{
        minWidth: 28, fontSize: 15, fontWeight: 800,
        color: rank <= 3 ? PODIUM_COLORS[rank - 1] : 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        {rank}
      </span>
      <BotAvatar size={36} color={agent.avatarColor} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {agent.agentName}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 2, fontSize: 12 }}>
          <span style={{ color: agent.winRate >= 60 ? 'var(--green)' : 'var(--text-muted)' }}>
            {agent.winRate}% WR
          </span>
          <span style={{ color: agent.roi > 0 ? 'var(--green)' : 'var(--red)' }}>
            {agent.roi > 0 ? '+' : ''}{agent.roi}% ROI
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {agent.copiers || 0} copieurs
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [tab, setTab] = useState('joueurs');
  const { data, loading, error } = useApi('/api/leaderboard');
  const { user } = useAuth();

  const [agents, setAgents] = useState([]);
  const base = import.meta.env.VITE_API_URL || '';
  useEffect(() => {
    if (tab !== 'agents') return;
    fetch(`${base}/api/agents/leaderboard`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.agents) setAgents(d.agents); })
      .catch(() => {});
  }, [tab]);

  const topBettors = data?.topBettors || [];
  const podium = topBettors.slice(0, 3);
  const rest = topBettors.slice(3);

  const myIdx = user
    ? topBettors.findIndex(u => u._id === user._id || u.telegramId === user.telegramId)
    : -1;

  const agentPodium = agents.slice(0, 3);
  const agentRest = agents.slice(3);

  const getName = (u, i) => u.displayName || u.telegramId || `Joueur ${i + 1}`;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{
        fontSize: 24, fontWeight: 800, color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)', marginBottom: 4,
      }}>
        Classement
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Les meilleurs joueurs et agents IA.
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0,
      }}>
        <TabBtn active={tab === 'joueurs'} onClick={() => setTab('joueurs')}>Joueurs</TabBtn>
        <TabBtn active={tab === 'agents'} onClick={() => setTab('agents')}>Agents IA</TabBtn>
      </div>

      {error && (
        <div style={{
          padding: 12, borderRadius: 8, marginBottom: 16,
          background: 'rgba(239,68,68,0.1)', color: 'var(--red)', fontSize: 13,
        }}>
          Erreur: {error}
        </div>
      )}

      {loading ? (
        <BetlyLoader size={100} text="Chargement du classement..." />
      ) : (
        <div className="wolves-card" style={{ overflow: 'hidden' }}>

          {/* ── Joueurs ── */}
          {tab === 'joueurs' && (
            <>
              {topBettors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
                  Aucun joueur encore
                </div>
              ) : (
                <>
                  {/* Podium */}
                  {podium.length >= 3 && (
                    <div style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                      padding: '16px 8px 20px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(124,58,237,0.03)',
                    }}>
                      {podium.map((u, i) => (
                        <PodiumCard
                          key={u._id || i}
                          rank={i + 1}
                          name={getName(u, i)}
                          subtitle={`${u.totalBets || 0} paris`}
                          stat={`+${(u.totalEarned || 0).toFixed(1)}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Rest */}
                  {rest.map((u, i) => (
                    <PlayerRow
                      key={u._id || i}
                      rank={i + 4}
                      name={getName(u, i + 3)}
                      userId={u._id || u.telegramId}
                      totalBets={u.totalBets || 0}
                      wonBets={u.wonBets || 0}
                      earned={u.totalEarned || 0}
                      isMe={myIdx === i + 3}
                    />
                  ))}
                </>
              )}
            </>
          )}

          {/* ── Agents IA ── */}
          {tab === 'agents' && (
            <>
              {agents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
                  Aucun agent classe pour le moment
                </div>
              ) : (
                <>
                  {agentPodium.length >= 3 && (
                    <div style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                      padding: '16px 8px 20px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(124,58,237,0.03)',
                    }}>
                      {agentPodium.map((a, i) => (
                        <PodiumCard
                          key={a._id || i}
                          rank={i + 1}
                          name={a.agentName}
                          subtitle={`${a.winRate}% WR`}
                          stat={`${a.roi > 0 ? '+' : ''}${a.roi}% ROI`}
                          isBot
                          avatarColor={a.avatarColor}
                        />
                      ))}
                    </div>
                  )}

                  {agentRest.map((a, i) => (
                    <AgentRow key={a._id || i} rank={i + 4} agent={a} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

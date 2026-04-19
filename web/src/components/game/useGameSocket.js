import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const STARTING_TOKENS = 1000;
const STORAGE_KEY = 'wolves_tokens_v2';

function getBalance() {
  const b = localStorage.getItem(STORAGE_KEY);
  if (b === null) { localStorage.setItem(STORAGE_KEY, STARTING_TOKENS); return STARTING_TOKENS; }
  return parseInt(b, 10) || 0;
}
function setStoredBalance(v) {
  localStorage.setItem(STORAGE_KEY, Math.max(0, v));
}

export function useGameSocket() {
  const socketRef = useRef(null);
  const [matchId, setMatchId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [phase, setPhase] = useState('waiting');
  const [round, setRound] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [balance, setBalance] = useState(getBalance());
  const [totalPayout, setTotalPayout] = useState(0);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateBalance = useCallback((v) => {
    setStoredBalance(v);
    setBalance(v);
  }, []);

  const startMatch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/matches/start', { method: 'POST' });
      if (!res.ok) throw new Error('Erreur serveur: ' + res.status);
      const data = await res.json();
      setMatchId(data.matchId);
      setWinner(null);
      setTotalPayout(0);
      setChatMessages([]);
      setPlayers([]);
      setMarkets([]);
      setMyBets([]);
      setPhase('day');
      setRound(1);
      return data.matchId;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect socket when matchId changes
  useEffect(() => {
    if (!matchId) return;

    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_match', matchId);
      // Catch up
      fetch('/api/matches/' + matchId + '/live')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          if (data.match?.players) {
            setPlayers(data.match.players.map(p => ({
              name: p.characterName || p.name,
              alive: p.alive !== false,
              role: null,
            })));
          }
          const events = data.events || [];
          const msgs = [];
          events.forEach(ev => {
            if (ev.type === 'chat') {
              msgs.push({ type: 'chat', speaker: ev.metadata?.actorName, text: ev.content, eventId: ev._id, modelLabel: ev.metadata?.llm?.modelLabel });
            } else if (ev.type === 'phase_change') {
              let p = ev.metadata?.phase || 'day';
              const base = p.replace(/[0-9]+$/, '');
              if (['day','vote','night'].includes(base)) p = base;
              setPhase(p);
              setRound(ev.metadata?.round || 1);
              msgs.push({ type: 'phase', phase: p, round: ev.metadata?.round || 1 });
            } else if (ev.type === 'elimination') {
              msgs.push({ type: 'elimination', name: ev.metadata?.targetName, method: ev.metadata?.method });
              setPlayers(prev => prev.map(p => p.name === ev.metadata?.targetName ? { ...p, alive: false } : p));
            } else if (ev.type === 'vote') {
              msgs.push({ type: 'vote', voter: ev.metadata?.actorName });
            }
          });
          setChatMessages(msgs);

          // Fetch markets
          fetch('/api/matches/' + matchId + '/markets')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.markets) setMarkets(d.markets); })
            .catch(() => {});
        })
        .catch(() => {});
    });

    socket.on('match_start', (data) => {
      setPlayers((data.players || []).map(p => ({ name: p.name, alive: true, role: null })));
      setChatMessages(prev => [...prev, { type: 'system', text: 'La partie commence avec ' + (data.players?.length || 8) + ' joueurs.' }]);
    });

    socket.on('phase_change', (data) => {
      let p = data.phase;
      const base = p.replace(/[0-9]+$/, '');
      if (['day','vote','night'].includes(base)) p = base;
      setPhase(p);
      setRound(data.round || 1);
      setChatMessages(prev => [...prev, { type: 'phase', phase: p, round: data.round || 1 }]);
    });

    socket.on('chat_message', (data) => {
      setCurrentSpeaker(data.speaker);
      setChatMessages(prev => [...prev, { type: 'chat', speaker: data.speaker, text: data.text, eventId: data.eventId, modelLabel: data.modelLabel }]);
    });

    socket.on('vote_cast', (data) => {
      setChatMessages(prev => [...prev, { type: 'vote', voter: data.voter }]);
    });

    socket.on('vote_result', (data) => {
      if (data.eliminated) {
        setChatMessages(prev => [...prev, { type: 'system', text: 'Resultat : ' + data.eliminated + ' est elimine(e).' }]);
      }
      if (data.tally) {
        const parts = Object.entries(data.tally).map(([k,v]) => k + ': ' + v).join(', ');
        setChatMessages(prev => [...prev, { type: 'system', text: 'Votes — ' + parts }]);
      }
    });

    socket.on('elimination', (data) => {
      setPlayers(prev => prev.map(p => p.name === data.name ? { ...p, alive: false } : p));
      const method = data.method === 'night_kill' ? 'tue(e) par les loups' : 'elimine(e) par le village';
      setChatMessages(prev => [...prev, { type: 'elimination', name: data.name, method }]);
    });

    socket.on('night_kill', (data) => {
      setPlayers(prev => prev.map(p => p.name === data.victim ? { ...p, alive: false } : p));
      setChatMessages(prev => [...prev, { type: 'elimination', name: data.victim, method: 'devore(e) durant la nuit' }]);
    });

    socket.on('match_end', (data) => {
      if (data.roles) {
        setPlayers(prev => prev.map(p => {
          const r = data.roles.find(x => x.name === p.name);
          return r ? { ...p, role: r.role, alive: r.alive } : p;
        }));
      }
      setWinner(data.winnerSide);
    });

    socket.on('markets_init', (data) => setMarkets(data.markets || []));

    socket.on('market_update', (data) => {
      setMarkets(prev => prev.map(m => m.id === data.marketId ? { ...m, totalYes: data.totalYes, totalNo: data.totalNo, odds: data.odds } : m));
    });

    socket.on('market_resolve', (data) => {
      setMarkets(prev => prev.map(m => m.id === data.marketId ? { ...m, resolved: true, result: data.result } : m));
      // Check winnings
      if (data.winnings && socket.id) {
        data.winnings.forEach(w => {
          if (w.socketId === socket.id) {
            setTotalPayout(prev => prev + w.payout);
            updateBalance(getBalance() + w.payout);
          }
        });
      }
      setMyBets(prev => prev.map(b => b.marketId === data.marketId ? { ...b, status: b.side === data.winningSide ? 'won' : 'lost' } : b));
    });

    socket.on('bet_confirmed', () => {});
    socket.on('bet_error', (data) => {
      setError(data.error || 'Pari refuse');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [matchId, updateBalance]);

  const placeBet = useCallback((marketId, side, amount) => {
    if (!socketRef.current || !matchId) return;
    const m = markets.find(x => x.id === marketId);
    updateBalance(balance - amount);
    setMyBets(prev => [...prev, { marketId, label: m?.label || marketId, side, amount, status: 'pending' }]);
    socketRef.current.emit('place_bet', { matchId, marketId, side, amount });
  }, [matchId, markets, balance, updateBalance]);

  return {
    matchId, players, markets, myBets, chatMessages, phase, round,
    currentSpeaker, balance, totalPayout, winner, loading, error,
    startMatch, placeBet, updateBalance,
  };
}

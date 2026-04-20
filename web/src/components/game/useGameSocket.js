import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || '';
const STARTING_TOKENS = 1000;
const STORAGE_KEY = 'wolves_tokens_v2';
const POLL_INTERVAL = 3000; // 3s polling fallback

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
  const pollRef = useRef(null);
  const lastEventCountRef = useRef(0);
  const pollFailsRef = useRef(0);

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
  // 'starting' | 'connecting' | 'loading_players' | 'intro' | 'live' | 'ended' | 'engine_down'
  const [gameState, setGameState] = useState('idle');

  const updateBalance = useCallback((v) => {
    setStoredBalance(v);
    setBalance(v);
  }, []);

  // Fetch match data via REST (used for both catch-up and polling)
  const fetchMatchData = useCallback(async (mid) => {
    try {
      const res = await fetch(`${API_BASE}/api/matches/${mid}/live`);
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  }, []);

  // Process events from REST response
  const processMatchData = useCallback((data, isInitial) => {
    if (!data) return;

    if (data.match?.players) {
      setPlayers(data.match.players.map(p => ({
        name: p.characterName || p.name,
        alive: p.alive !== false,
        role: p.role === 'wolf' && data.match.status === 'finished' ? 'wolf' : null,
      })));
    }

    if (data.match?.status === 'finished') {
      setWinner(data.match.winnerSide || 'villagers');
      setGameState('ended');
      return;
    }

    const events = data.events || [];
    const newCount = events.length;

    // Only process if there are new events
    if (!isInitial && newCount <= lastEventCountRef.current) {
      return;
    }

    const eventsToProcess = isInitial ? events : events.slice(lastEventCountRef.current);
    lastEventCountRef.current = newCount;

    const msgs = [];
    eventsToProcess.forEach(ev => {
      if (ev.type === 'chat') {
        setCurrentSpeaker(ev.metadata?.actorName);
        msgs.push({ type: 'chat', speaker: ev.metadata?.actorName, text: ev.content, eventId: ev._id, modelLabel: ev.metadata?.llm?.modelLabel });
      } else if (ev.type === 'phase_change') {
        let p = ev.metadata?.phase || 'day';
        const base = p.replace(/[0-9]+$/, '');
        if (['day', 'vote', 'night', 'debate'].includes(base)) p = base;
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

    if (msgs.length > 0) {
      setChatMessages(prev => isInitial ? msgs : [...prev, ...msgs]);
      if (msgs.some(m => m.type === 'chat')) {
        setGameState('live');
      }
    }
  }, []);

  const startMatch = useCallback(async (gameMode) => {
    setLoading(true);
    setError(null);
    setGameState('starting');

    try {
      let url;
      if (gameMode === 'lifeboat' || gameMode === 'bunker') {
        url = `${API_BASE}/api/survival/start?mode=${gameMode}`;
      } else {
        url = `${API_BASE}/api/matches/start`;
      }
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Erreur serveur: ' + res.status);
      const data = await res.json();

      setMatchId(data.matchId);
      setWinner(null);
      setTotalPayout(0);
      setChatMessages([]);
      setPlayers([]);
      setMarkets([]);
      setMyBets([]);
      setPhase('waiting');
      setRound(0);
      lastEventCountRef.current = 0;
      pollFailsRef.current = 0;
      setGameState('connecting');

      return data.matchId;
    } catch (e) {
      setError(e.message);
      setGameState('idle');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect socket + start polling fallback when matchId changes
  useEffect(() => {
    if (!matchId) return;

    let socketConnected = false;
    let disposed = false;

    // Initial catch-up via REST
    async function initialLoad() {
      setGameState('loading_players');
      const data = await fetchMatchData(matchId);
      if (disposed) return;

      if (data) {
        processMatchData(data, true);
        if (data.match?.players?.length > 0) {
          setGameState('intro');
          // After intro animation (4s), switch to live
          setTimeout(() => {
            if (!disposed) setGameState(prev => prev === 'intro' ? 'live' : prev);
          }, 4000);
        }
      }

      // Fetch markets
      try {
        const mRes = await fetch(`${API_BASE}/api/matches/${matchId}/markets`);
        if (mRes.ok) {
          const mData = await mRes.json();
          if (mData?.markets && !disposed) setMarkets(mData.markets);
        }
      } catch {}
    }

    initialLoad();

    // Try socket connection
    try {
      const socket = io(API_BASE || undefined, { timeout: 5000, reconnectionAttempts: 3 });
      socketRef.current = socket;

      socket.on('connect', () => {
        socketConnected = true;
        socket.emit('join_match', matchId);
      });

      socket.on('match_start', (data) => {
        setPlayers((data.players || []).map(p => ({ name: p.name, alive: true, role: null })));
        setGameState('intro');
        setTimeout(() => {
          if (!disposed) setGameState(prev => prev === 'intro' ? 'live' : prev);
        }, 4000);
      });

      socket.on('phase_change', (data) => {
        let p = data.phase;
        const base = p.replace(/[0-9]+$/, '');
        if (['day', 'vote', 'night', 'debate'].includes(base)) p = base;
        setPhase(p);
        setRound(data.round || 1);
        setChatMessages(prev => [...prev, { type: 'phase', phase: p, round: data.round || 1 }]);
        setGameState('live');
      });

      socket.on('chat_message', (data) => {
        setCurrentSpeaker(data.speaker);
        setChatMessages(prev => [...prev, { type: 'chat', speaker: data.speaker, text: data.text, eventId: data.eventId, modelLabel: data.modelLabel }]);
        setGameState('live');
      });

      socket.on('vote_cast', (data) => {
        setChatMessages(prev => [...prev, { type: 'vote', voter: data.voter }]);
      });

      socket.on('vote_result', (data) => {
        if (data.eliminated) {
          setChatMessages(prev => [...prev, { type: 'system', text: 'Resultat : ' + data.eliminated + ' est elimine(e).' }]);
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
        setGameState('ended');
      });

      socket.on('markets_init', (data) => setMarkets(data.markets || []));
      socket.on('market_update', (data) => {
        setMarkets(prev => prev.map(m => m.id === data.marketId ? { ...m, totalYes: data.totalYes, totalNo: data.totalNo, odds: data.odds } : m));
      });
      socket.on('market_resolve', (data) => {
        setMarkets(prev => prev.map(m => m.id === data.marketId ? { ...m, resolved: true, result: data.result } : m));
        if (data.winnings && socket.id) {
          data.winnings.forEach(w => {
            if (w.socketId === socket.id) {
              setTotalPayout(prev => prev + w.payout);
              updateBalance(getBalance() + w.payout);
            }
          });
        }
      });

      socket.on('bet_confirmed', () => {});
      socket.on('bet_error', (data) => setError(data.error || 'Pari refuse'));
    } catch {
      // Socket not available (Vercel serverless)
    }

    // Polling fallback — polls every 3s to get new events
    pollRef.current = setInterval(async () => {
      if (disposed) return;
      const data = await fetchMatchData(matchId);
      if (disposed) return;
      if (!data) {
        pollFailsRef.current++;
        if (pollFailsRef.current > 5) {
          setGameState(prev => prev === 'live' || prev === 'intro' ? prev : 'engine_down');
        }
        return;
      }
      pollFailsRef.current = 0;
      processMatchData(data, false);
    }, POLL_INTERVAL);

    // Detect stalled engine after 20s with no chat events
    const stallTimer = setTimeout(() => {
      if (!disposed) {
        setGameState(prev => {
          if (prev === 'connecting' || prev === 'loading_players') return 'engine_down';
          return prev;
        });
      }
    }, 20000);

    return () => {
      disposed = true;
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      clearTimeout(stallTimer);
    };
  }, [matchId, fetchMatchData, processMatchData, updateBalance]);

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
    gameState, startMatch, placeBet, updateBalance,
  };
}

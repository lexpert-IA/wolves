import React from 'react';

function OddsBar({ yes, no }) {
  const total = (yes || 0) + (no || 0);
  const yesPct = total > 0 ? Math.round((yes / total) * 100) : 50;
  const noPct = 100 - yesPct;

  return (
    <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--bg-primary)', margin: '6px 0' }}>
      <div className="bar-animated" style={{ width: `${yesPct}%`, background: 'var(--green)', borderRadius: '3px 0 0 3px' }} />
      <div className="bar-animated" style={{ width: `${noPct}%`, background: 'var(--red)', borderRadius: '0 3px 3px 0' }} />
    </div>
  );
}

function MarketCard({ market, onBet }) {
  const odds = market.odds || {};
  const yesOdds = odds.yes != null ? odds.yes.toFixed(2) : '—';
  const noOdds = odds.no != null ? odds.no.toFixed(2) : '—';
  const resolved = market.resolved;

  return (
    <div className="wolves-card" style={{ padding: '10px 12px', marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
        {market.label}
        {resolved && (
          <span className="wolves-badge" style={{
            marginLeft: 8,
            background: market.result === 'yes' ? 'var(--green-dim)' : 'var(--red-dim)',
            color: market.result === 'yes' ? 'var(--green)' : 'var(--red)',
          }}>
            {market.result === 'yes' ? 'OUI' : 'NON'}
          </span>
        )}
      </div>
      <OddsBar yes={market.totalYes || 0} no={market.totalNo || 0} />
      {!resolved && (
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button className="wolves-btn wolves-btn-yes" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}
            onClick={() => onBet(market.id, 'yes')}>
            OUI {yesOdds}x
          </button>
          <button className="wolves-btn wolves-btn-no" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}
            onClick={() => onBet(market.id, 'no')}>
            NON {noOdds}x
          </button>
        </div>
      )}
    </div>
  );
}

export default function BettingPanel({ markets = [], myBets = [], balance = 0, onBet }) {
  const mainMarket = markets.find(m => m.id === 'wolves_win' || m.type === 'main');
  const identityMarkets = markets.filter(m => m.type === 'identity');
  const eliminationMarkets = markets.filter(m => m.type === 'first_eliminated');
  const otherMarkets = markets.filter(m => m !== mainMarket && m.type !== 'identity' && m.type !== 'first_eliminated');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflowY: 'auto' }}>
      {/* Balance */}
      <div className="wolves-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Solde</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--cyan)' }}>
          {balance.toLocaleString()} W$
        </span>
      </div>

      {/* Main market */}
      {mainMarket && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            MARCHE PRINCIPAL
          </div>
          <MarketCard market={mainMarket} onBet={onBet} />
        </div>
      )}

      {/* Identity markets */}
      {identityMarkets.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            IDENTITES
          </div>
          {identityMarkets.map(m => <MarketCard key={m.id} market={m} onBet={onBet} />)}
        </div>
      )}

      {/* First eliminated */}
      {eliminationMarkets.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            PREMIER ELIMINE
          </div>
          {eliminationMarkets.map(m => <MarketCard key={m.id} market={m} onBet={onBet} />)}
        </div>
      )}

      {/* Other */}
      {otherMarkets.map(m => <MarketCard key={m.id} market={m} onBet={onBet} />)}

      {/* My bets */}
      {myBets.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            MES PARIS
          </div>
          {myBets.map((b, i) => (
            <div key={i} className="wolves-card" style={{ padding: '8px 12px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{b.label}</div>
                <span className="wolves-badge" style={{
                  background: b.side === 'yes' ? 'var(--green-dim)' : 'var(--red-dim)',
                  color: b.side === 'yes' ? 'var(--green)' : 'var(--red)',
                  marginTop: 2,
                }}>
                  {b.side === 'yes' ? 'OUI' : 'NON'}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {b.amount} W$
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 600,
                  color: b.status === 'won' ? 'var(--green)' : b.status === 'lost' ? 'var(--red)' : 'var(--text-muted)',
                }}>
                  {b.status === 'won' ? 'Gagne' : b.status === 'lost' ? 'Perdu' : 'En cours'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

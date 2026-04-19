import React from 'react';

/* ── Odds bar — green/red like Polymarket ── */
function OddsBar({ yes, no }) {
  const total = (yes || 0) + (no || 0);
  const yesPct = total > 0 ? Math.round((yes / total) * 100) : 50;
  const noPct = 100 - yesPct;

  return (
    <div style={{ margin: '8px 0 6px' }}>
      <div style={{
        display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
      }}>
        <div style={{
          width: `${yesPct}%`, height: '100%',
          background: '#10B981', borderRadius: '3px 0 0 3px',
          transition: 'width 0.4s ease',
        }} />
        <div style={{
          width: `${noPct}%`, height: '100%',
          background: '#EF4444', borderRadius: '0 3px 3px 0',
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 4, fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
      }}>
        <span style={{ color: '#10B981' }}>{yesPct}%</span>
        <span style={{ color: '#EF4444' }}>{noPct}%</span>
      </div>
    </div>
  );
}

/* ── Single market card ── */
function MarketCard({ market, onBet }) {
  const odds = market.odds || {};
  const yesOdds = odds.yes != null ? odds.yes.toFixed(2) : '—';
  const noOdds = odds.no != null ? odds.no.toFixed(2) : '—';
  const resolved = market.resolved;

  return (
    <div style={{
      padding: '12px 14px', marginBottom: 8,
      background: 'var(--bg-secondary)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
    }}>
      {/* Question */}
      <div style={{
        fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
        marginBottom: 2, lineHeight: 1.4,
      }}>
        {market.label}
        {resolved && (
          <span style={{
            marginLeft: 8, fontSize: 10, fontWeight: 700,
            padding: '2px 6px', borderRadius: 4,
            background: market.result === 'yes' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: market.result === 'yes' ? '#10B981' : '#EF4444',
          }}>
            {market.result === 'yes' ? 'OUI' : 'NON'}
          </span>
        )}
      </div>

      {/* Odds bar */}
      <OddsBar yes={market.totalYes || 0} no={market.totalNo || 0} />

      {/* Bet buttons — Polymarket style */}
      {!resolved && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => onBet(market.id, 'yes')}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
              background: 'rgba(16,185,129,0.1)',
              color: '#10B981', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'var(--font-mono)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#10B981'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.color = '#10B981'; }}
          >
            OUI {yesOdds}x
          </button>
          <button
            onClick={() => onBet(market.id, 'no')}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
              background: 'rgba(239,68,68,0.1)',
              color: '#EF4444', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'var(--font-mono)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
          >
            NON {noOdds}x
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main panel ── */
export default function BettingPanel({ markets = [], myBets = [], balance = 0, onBet }) {
  const mainMarket = markets.find(m => m.id === 'wolves_win' || m.type === 'main');
  const identityMarkets = markets.filter(m => m.type === 'identity');
  const eliminationMarkets = markets.filter(m => m.type === 'first_eliminated');
  const otherMarkets = markets.filter(m => m !== mainMarket && m.type !== 'identity' && m.type !== 'first_eliminated');

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 16,
      height: '100%', overflowY: 'auto',
    }}>
      {/* Main market — highlighted */}
      {mainMarket && (
        <div>
          <SectionLabel>Marche principal</SectionLabel>
          <div style={{
            padding: '16px', borderRadius: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
              marginBottom: 4,
            }}>
              {mainMarket.label}
            </div>
            <OddsBar yes={mainMarket.totalYes || 0} no={mainMarket.totalNo || 0} />
            {!mainMarket.resolved && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <BetButton
                  side="yes"
                  label={`Loups ${mainMarket.odds?.yes?.toFixed(2) || '—'}x`}
                  onClick={() => onBet(mainMarket.id, 'yes')}
                />
                <BetButton
                  side="no"
                  label={`Villageois ${mainMarket.odds?.no?.toFixed(2) || '—'}x`}
                  onClick={() => onBet(mainMarket.id, 'no')}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Identity markets */}
      {identityMarkets.length > 0 && (
        <div>
          <SectionLabel>Identites</SectionLabel>
          {identityMarkets.map(m => <MarketCard key={m.id} market={m} onBet={onBet} />)}
        </div>
      )}

      {/* First eliminated */}
      {eliminationMarkets.length > 0 && (
        <div>
          <SectionLabel>Premier elimine</SectionLabel>
          {eliminationMarkets.map(m => <MarketCard key={m.id} market={m} onBet={onBet} />)}
        </div>
      )}

      {/* Other */}
      {otherMarkets.map(m => <MarketCard key={m.id} market={m} onBet={onBet} />)}

      {/* My bets */}
      {myBets.length > 0 && (
        <div>
          <SectionLabel>Mes paris</SectionLabel>
          {myBets.map((b, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', marginBottom: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {b.label}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                  background: b.side === 'yes' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  color: b.side === 'yes' ? '#10B981' : '#EF4444',
                }}>
                  {b.side === 'yes' ? 'OUI' : 'NON'}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {b.amount} W$
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 600,
                  color: b.status === 'won' ? '#10B981' : b.status === 'lost' ? '#EF4444' : 'var(--text-muted)',
                }}>
                  {b.status === 'won' ? 'Gagne' : b.status === 'lost' ? 'Perdu' : 'En cours'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {markets.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '32px 16px',
          color: 'var(--text-muted)', fontSize: 13,
        }}>
          Les marches apparaitront quand la partie demarre.
        </div>
      )}
    </div>
  );
}

/* ── Helpers ── */
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
      color: 'var(--text-muted)', textTransform: 'uppercase',
      marginBottom: 8, fontFamily: 'var(--font-body)',
    }}>
      {children}
    </div>
  );
}

function BetButton({ side, label, onClick }) {
  const isYes = side === 'yes';
  const color = isYes ? '#10B981' : '#EF4444';

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
        background: `${color}15`,
        color, fontWeight: 700, fontSize: 13,
        cursor: 'pointer', transition: 'all 0.15s',
        fontFamily: 'var(--font-mono)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.color = color; }}
    >
      {label}
    </button>
  );
}

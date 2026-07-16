import TypeChart from './TypeChart'
import ResultOverlay from './ResultOverlay'
import { getTypeColor } from '../game/types'
import { BOSS_ASSETS, PLAYER_SPRITE_MALE, PLAYER_SPRITE_FEMALE, MOVE_DESCRIPTIONS } from '../data/bosses'
import { buildBattleMoves } from '../game/battleMoves'

function unlockedSectionLabel(section) {
  if (section === 'about') return 'ABOUT ME'
  if (section === 'education') return 'EDUCATION'
  return String(section).toUpperCase()
}

// The battle screen. `battle` is the full object returned by the useBattle hook;
// `onHover`/`onSelect` come from the useAudio hook for button sounds.
export default function BattleScreen({ battle, onHover, onSelect }) {
  const { battleState, battleMenuView, setBattleMenuView, reinforcementUses, resultScreen, setResultScreen, flinch, displayedBattleText, handleBattleMove, handleUseItem, handleRun, retryBattle, goToBossSelect, goToMenu } = battle

  if (!battleState) return null

  // Battle art is selected per boss so future fights can swap in their own
  // background + opponent sprite without touching the render code.
  const assets = BOSS_ASSETS[battleState.mode] || BOSS_ASSETS.school
  const battleMoves = buildBattleMoves(battleState)
  const isHollow = battleState.mode === 'hollow'
  // Player sprite follows the chosen gender so the named character is
  // represented by the matching sprite in battle.
  const PLAYER_SPRITE = battleState.player.gender === 'female' ? PLAYER_SPRITE_FEMALE : PLAYER_SPRITE_MALE

  // CONTINUE from the "You Won!" screen: show the Unlock screen if this win
  // unlocked a section, otherwise return to Boss Select.
  const handleContinue = () => {
    onSelect()
    if (resultScreen?.newlyUnlocked) {
      setResultScreen({ type: 'unlocked', section: resultScreen.section })
    } else {
      goToBossSelect()
    }
  }

  return (
    <section className="screen battle-screen">
      {isHollow && (
        <div className="type-chart-trigger" tabIndex={0}>
          <TypeChart size="small" />
          <span className="type-chart-hint">Type chart</span>
          <div className="type-chart-popover" role="tooltip">
            <TypeChart size="full" />
          </div>
        </div>
      )}
      <div className="battle-field">
        <img className="battle-bg" src={assets.background} alt="" />
        <img
          className={`sprite sprite-enemy ${flinch.enemy ? 'flinch' : ''} ${battleState.enemy.hp <= 0 ? 'fainted' : ''}`}
          src={assets.opponentSprite}
          alt={battleState.enemy.displayName}
        />
        <img
          className={`sprite sprite-player ${flinch.player ? 'flinch' : ''} ${battleState.player.hp <= 0 ? 'fainted' : ''}`}
          src={PLAYER_SPRITE}
          alt={battleState.player.displayName}
        />
        <article className="monster-card type-tinted info-box info-enemy" style={{ '--type-color': getTypeColor(battleState.enemy.type) }}>
          <p className="monster-label">OPPONENT</p>
          <h3>{battleState.enemy.displayName}</h3>
          <p className="type-pill">{battleState.enemy.type}</p>
          <div className="hp-bar"><div className="hp-fill enemy" style={{ width: `${(battleState.enemy.hp / battleState.enemy.maxHp) * 100}%` }} /></div>
          <p className="hp-text">HP {battleState.enemy.hp}/{battleState.enemy.maxHp}</p>
        </article>
        <article className="monster-card type-tinted info-box info-player" style={{ '--type-color': getTypeColor(battleState.player.type) }}>
          <p className="monster-label">You</p>
          <h3>{battleState.player.displayName}</h3>
          <p className="type-pill">{battleState.player.type}</p>
          <div className="hp-bar"><div className="hp-fill player" style={{ width: `${(battleState.player.hp / battleState.player.maxHp) * 100}%` }} /></div>
          <p className="hp-text">HP {battleState.player.hp}/{battleState.player.maxHp}</p>
        </article>
      </div>
      <div className="battle-controls">
        <div className="battle-log">
          {/* Typewriter effect for battle text - only show typed text to prevent overlap/glitching */}
          <div className="typed-text">{typeof displayedBattleText === 'string' ? displayedBattleText : ''}</div>
        </div>
        <div className="battle-menu">
          {battleMenuView === 'main' && (
            <div className="menu-buttons">
              <button type="button" className="menu-button primary" onClick={() => { onSelect(); setBattleMenuView('moves') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>FIGHT</button>
              <button type="button" className="menu-button" onClick={() => { onSelect(); setBattleMenuView('bag') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>BAG</button>
              <button type="button" className="menu-button" onClick={() => { onSelect(); setBattleMenuView('party') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>MONS</button>
              <button type="button" className="menu-button" onClick={() => { onSelect(); handleRun() }} disabled={!!battleState.result} onMouseEnter={onHover}>RUN</button>
            </div>
          )}
          {battleMenuView === 'moves' && (
            <>
              <div className="move-grid">
                {battleMoves.map((move) => (
                  <button key={move.id} type="button" className="move-card" style={{ '--type-color': getTypeColor(move.type) }} onClick={() => { onSelect(); handleBattleMove(move) }} disabled={battleState.isResolving || !!battleState.result || (battleState.mode === 'school' && move.optionIndex === 3 && battleState.school?.skipsRemaining <= 0)} onMouseEnter={onHover}>
                    <strong>{move.label}</strong>
                    <span>{move.type}</span>
                    {MOVE_DESCRIPTIONS[move.id] && (
                      <span className="move-tooltip" role="tooltip">{MOVE_DESCRIPTIONS[move.id]}</span>
                    )}
                  </button>
                ))}
              </div>
              <button type="button" className="menu-button back" onClick={() => { onSelect(); setBattleMenuView('main') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>BACK</button>
            </>
          )}
          {battleMenuView === 'party' && (
            <>
              <div className="info-card">
                <h4>Party</h4>
                <ul><li>{battleState.player.name}</li></ul>
              </div>
              <button type="button" className="menu-button back" onClick={() => { onSelect(); setBattleMenuView('main') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>BACK</button>
            </>
          )}
          {battleMenuView === 'bag' && (
            <>
              <div className="move-grid">
                <button type="button" className="move-card" style={{ '--type-color': '#c9a227' }} onClick={() => { onSelect(); handleUseItem() }} disabled={battleState.isResolving || !!battleState.result || reinforcementUses <= 0} onMouseEnter={onHover}>
                  <strong>CALL REINFORCEMENTS</strong>
                  <span>x{reinforcementUses}</span>
                </button>
              </div>
              <button type="button" className="menu-button back" onClick={() => { onSelect(); setBattleMenuView('main') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>BACK</button>
            </>
          )}
        </div>
      </div>
      {resultScreen && (
        <div className="result-overlay">
          <ResultOverlay
            resultScreen={resultScreen}
            isHollow={isHollow}
            sectionLabel={unlockedSectionLabel(resultScreen.section)}
            onContinue={handleContinue}
            onMainMenu={() => { onSelect(); goToMenu() }}
            onRetry={() => { onSelect(); retryBattle() }}
            onHover={onHover}
          />
        </div>
      )}
    </section>
  )
}

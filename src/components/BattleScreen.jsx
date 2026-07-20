import TypeChart from './TypeChart'
import ResultOverlay from './ResultOverlay'
import { getTypeColor } from '../game/types'
import { BOSS_ASSETS, PLAYER_SPRITE_MALE, PLAYER_SPRITE_FEMALE, MOVE_DESCRIPTIONS } from '../data/bosses'
import { buildBattleMoves } from '../game/battleMoves'

function unlockedSectionLabel(sections) {
  const list = Array.isArray(sections) ? sections : sections ? [sections] : []
  const labelFor = (section) => {
    if (section === 'professional') return 'PROFESSIONAL EXPERIENCE'
    if (section === 'about') return 'ABOUT ME & RESUME'
    if (section === 'education') return 'EDUCATION'
    if (section === 'skills') return 'SKILLS'
    if (section === 'projects') return 'PERSONAL PROJECTS'
    return String(section).toUpperCase()
  }
  return list.map(labelFor).join(' & ')
}

// The battle screen. `battle` is the full object returned by the useBattle hook;
// `onHover`/`onSelect` come from the useAudio hook for button sounds.
export default function BattleScreen({ battle, onHover, onSelect }) {
  const { battleState, battleMenuView, setBattleMenuView, reinforcementUses, resultScreen, setResultScreen, flinch, damageEvent, screenShake, displayedBattleText, handleBattleMove, handleUseItem, handleRun, retryBattle, goToBossSelect, goToMenu } = battle

  if (!battleState) return null

  // Battle art is selected per boss so future fights can swap in their own
  // background + opponent sprite without touching the render code.
  const assets = BOSS_ASSETS[battleState.mode] || BOSS_ASSETS.school
  // During the ASGORE intro the opponent CARD stays GHOST's (dead) while ASGORE's
  // sprite looms; `enemyCard` overrides what the card shows until the reveal step
  // clears it. Falls back to the real enemy otherwise.
  const enemyCardInfo = battleState.enemyCard ?? battleState.enemy
  const battleMoves = buildBattleMoves(battleState)
  const isHollow = battleState.mode === 'hollow'
  // ACT menu options. On GHOST, after the 2nd TALK the option becomes JOKE;
  // in every other fight (and before that on GHOST) it is just TALK.
  const actOptions = battleState.mode === 'ghost' && (battleState.ghost?.talkStage ?? 0) >= 2
    ? [{ id: 'joke', label: 'JOKE' }]
    : [{ id: 'talk', label: 'TALK' }]
  // Player sprite follows the chosen gender so the named character is
  // represented by the matching sprite in battle.
  const PLAYER_SPRITE = battleState.player.gender === 'female' ? PLAYER_SPRITE_FEMALE : PLAYER_SPRITE_MALE

  // CONTINUE from the "You Won!" screen: show the Unlock screen if this win
  // unlocked a section, otherwise return to Boss Select.
  const handleContinue = () => {
    onSelect()
    if (resultScreen?.newlyUnlocked) {
      setResultScreen({ type: 'unlocked', sections: resultScreen.sections })
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
      <div className={`battle-field ${screenShake ? 'shake' : ''}`}>
        {/* GHOST / ASGORE have no background — render an empty, correctly-sized
            placeholder so the battle field keeps the same dimensions. */}
        {assets.background ? (
          <img className="battle-bg" src={assets.background} alt="" />
        ) : (
          <div className="battle-bg battle-bg-empty" />
        )}
        <div className={`sprite-slot sprite-slot-enemy ${battleState.mode === 'asgore' ? 'sprite-slot-asgore' : ''}`}>
          <img
            className={`sprite sprite-enemy ${flinch.enemy ? 'flinch' : ''} ${battleState.enemy.hp <= 0 ? 'fainted' : ''}`}
            src={assets.opponentSprite}
            alt={battleState.enemy.displayName}
          />
          {damageEvent?.side === 'enemy' && (
            <div key={damageEvent.hitId} className={`damage-float ${damageEvent.effectiveness === 2 ? 'super' : damageEvent.effectiveness === 0.5 ? 'weak' : ''}`}>
              -{damageEvent.amount}
            </div>
          )}
        </div>
        <div className="sprite-slot sprite-slot-player">
          <img
            className={`sprite sprite-player ${flinch.player ? 'flinch' : ''} ${battleState.player.hp <= 0 ? 'fainted' : ''}`}
            src={PLAYER_SPRITE}
            alt={battleState.player.displayName}
          />
          {damageEvent?.side === 'player' && (
            <div key={damageEvent.hitId} className={`damage-float ${damageEvent.effectiveness === 2 ? 'super' : damageEvent.effectiveness === 0.5 ? 'weak' : ''}`}>
              -{damageEvent.amount}
            </div>
          )}
        </div>
        <article className="monster-card type-tinted info-box info-enemy" style={{ '--type-color': getTypeColor(enemyCardInfo.type) }}>
          <p className="monster-label">OPPONENT</p>
          <h3>{enemyCardInfo.displayName}</h3>
          <p className="type-pill">{enemyCardInfo.type}</p>
          <div className={`hp-bar ${damageEvent?.side === 'enemy' ? 'shake' : ''}`}><div className="hp-fill enemy" style={{ width: `${(enemyCardInfo.hp / enemyCardInfo.maxHp) * 100}%` }} /></div>
          <p className="hp-text">HP {enemyCardInfo.hp}/{enemyCardInfo.maxHp}</p>
        </article>
        <article className="monster-card type-tinted info-box info-player" style={{ '--type-color': getTypeColor(battleState.player.type) }}>
          <p className="monster-label">You</p>
          <h3>{battleState.player.displayName}</h3>
          <p className="type-pill">{battleState.player.type}</p>
          <div className={`hp-bar ${damageEvent?.side === 'player' ? 'shake' : ''}`}><div className="hp-fill player" style={{ width: `${(battleState.player.hp / battleState.player.maxHp) * 100}%` }} /></div>
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
              <button type="button" className="menu-button" onClick={() => { onSelect(); setBattleMenuView('act') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>ACT</button>
              <button type="button" className="menu-button" onClick={() => { onSelect(); setBattleMenuView('bag') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>BAG</button>
              {!battleState.runDestroyed && (
                <button type="button" className="menu-button" onClick={() => { onSelect(); handleRun() }} disabled={(battleState.isResolving && !battleState.introActive) || !!battleState.result} onMouseEnter={onHover}>RUN</button>
              )}
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
          {battleMenuView === 'act' && (
            <>
              <div className="move-grid">
                {actOptions.map((opt) => (
                  <button key={opt.id} type="button" className="move-card" style={{ '--type-color': '#7dd3fc' }} onClick={() => { onSelect(); handleBattleMove({ id: opt.id, label: opt.label }) }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={onHover}>
                    <strong>{opt.label}</strong>
                  </button>
                ))}
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
            mode={battleState.mode}
            sectionLabel={unlockedSectionLabel(resultScreen.sections)}
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

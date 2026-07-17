import { getEffectiveness, getEffectivenessText } from './types'
import { HOLLOW_DAMAGE } from '../data/bosses'

// Maps a battle effectiveness multiplier to the matching damage fraction from
// HOLLOW_DAMAGE for the given attacker side.
function hollowFraction(side, effectiveness) {
  const table = HOLLOW_DAMAGE[side]
  if (effectiveness === 2) return table.super
  if (effectiveness === 0.5) return table.weak
  return table.neutral
}

// Builds the sequence of {text, apply, sound} steps for one turn of the
// TWO fight. Pure: it only reads `battleState` and `move`, returning
// the steps array. The caller is responsible for dispatching them into state.
export function buildHollowSteps(battleState, move) {
  const steps = []
  const trickRoomActive = battleState.player.trickRoomTurnsLeft > 0
  const enemyName = battleState.enemy.name
  const playerType = battleState.player.type
  const enemyType = battleState.enemy.type
  let playerDamage = 0

  // Protean makes the enemy take on the type of the move it uses. The move is
  // chosen up front so both apply functions share it.
  // TWO is a Fire type, so it never opens with FLAMETHROWER — its first
  // move is HYDRO PUMP or LEAF STORM. After the first turn the cycle is unchanged
  // (skip the last move, fall back to FLAMETHROWER if none remain).
  const MOVE_POOL = [
    { id: 'flamethrower', label: 'FLAMETHROWER', type: 'Fire' },
    { id: 'hydro-pump', label: 'HYDRO PUMP', type: 'Water' },
    { id: 'leaf-storm', label: 'LEAF STORM', type: 'Grass' },
  ]
  const enemyMove = battleState.enemy.lastMove === null
    ? MOVE_POOL.filter((o) => o.id === 'hydro-pump' || o.id === 'leaf-storm')[
        Math.floor(Math.random() * 2)
      ]
    : MOVE_POOL.filter((option) => option.id !== battleState.enemy.lastMove)[0]
      || { id: 'flamethrower', label: 'FLAMETHROWER', type: 'Fire' }

  // The enemy's *current* type when the player's move lands. Protean changes
  // the enemy's type to its move's type as soon as the enemy acts, so when the
  // enemy goes first the player hits the post-Protean type. Under Trick Room
  // the player acts first and hits the enemy's original type.
  const enemyTypeWhenPlayerAttacks = trickRoomActive ? enemyType : enemyMove.type

  const applyEnemyMove = () => {
    const effectiveness = getEffectiveness(enemyMove.type, playerType)
    const damage = Math.floor(battleState.player.maxHp * hollowFraction('enemy', effectiveness))
    steps.push({ text: `${enemyName}'s ability PROTEAN was activated.`, apply: (prev) => ({ ...prev }), sound: 'In-Battle Ability Activate' })
    // Step 1: right after Protean, the enemy transforms into the move's type.
    // The type change is applied here so the opponent card recolors at this step.
    steps.push({ text: `${enemyName} transformed into a ${enemyMove.type} type.`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, type: enemyMove.type, lastMove: enemyMove.id } }), sound: null })
    // Step 2: enemy then announces the move it used (no damage yet)
    steps.push({ text: `${enemyName} used ${enemyMove.label}.`, apply: (prev) => ({ ...prev }), sound: enemyMove.id === 'hydro-pump' ? 'Hydro Pump' : enemyMove.id === 'flamethrower' ? 'Flamethrower' : 'Leaf Storm' })
    // Step 3: blank text + player HP drops + hit sound simultaneously
    const enemyHitSound = effectiveness === 2 ? 'Hit Super Effective' : effectiveness === 0.5 ? 'Hit Weak Not Very Effective' : 'Hit Normal Damage'
    steps.push({ text: '', apply: (prev) => ({ ...prev, player: { ...prev.player, hp: Math.max(0, prev.player.hp - damage) }, lastHit: { side: 'player', effectiveness } }), sound: enemyHitSound })
    // Step 4 (only if not neutral): effectiveness text, no sound (damage already done)
    if (effectiveness !== 1) {
      steps.push({ text: `It was ${getEffectivenessText(effectiveness)}${effectiveness === 2 ? '!' : '.'}`, apply: (prev) => ({ ...prev }), sound: null })
    }
    if (battleState.player.hp - damage <= 0) steps.push({ text: 'You lost the battle.', apply: (prev) => ({ ...prev, result: 'loss' }), sound: 'You Lost' })
  }

  const applyPlayerMove = () => {
    if (move.id === 'trick-room') {
      if (trickRoomActive) {
        // Re-casting Trick Room while it is already active ends the effect.
        steps.push({ text: `${battleState.player.name} used ${move.label}.`, apply: (prev) => ({ ...prev, player: { ...prev.player, trickRoomTurnsLeft: 0 } }), sound: 'Trick Room' })
        steps.push({ text: 'The dimensions went back to normal.', apply: (prev) => ({ ...prev }), sound: null })
      } else {
        // Sets 4 remaining turns; the turn the move is used does NOT count.
        // The end-of-turn counter (below) leaves this untouched, so the
        // effect lasts exactly 4 turns after the casting turn.
        steps.push({ text: `${battleState.player.name} used ${move.label}.`, apply: (prev) => ({ ...prev, player: { ...prev.player, trickRoomTurnsLeft: 4 } }), sound: 'Trick Room' })
        steps.push({ text: `${battleState.player.name} twisted the dimensions. This lasts for 4 turns.`, apply: (prev) => ({ ...prev }), sound: null })
      }
      return
    }
    const effectiveness = getEffectiveness(move.type, enemyTypeWhenPlayerAttacks)
    playerDamage = Math.floor(battleState.enemy.maxHp * hollowFraction('player', effectiveness))
    const playerHitSound = effectiveness === 2 ? 'Hit Super Effective' : effectiveness === 0.5 ? 'Hit Weak Not Very Effective' : 'Hit Normal Damage'
    // Step 1: announce the move (no damage yet)
    steps.push({ text: `${battleState.player.name} used ${move.label}.`, apply: (prev) => ({ ...prev }), sound: move.id === 'ember' ? 'Ember' : move.id === 'water-gun' ? 'Water Gun' : move.id === 'vine-whip' ? 'Vine Whip' : null })
    // Step 2: blank text + opponent HP drops + hit sound simultaneously
    steps.push({ text: '', apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: Math.max(0, prev.enemy.hp - playerDamage) }, lastHit: { side: 'enemy', effectiveness } }), sound: playerHitSound })
    // Step 3 (only if not neutral): effectiveness text, no sound (damage already done)
    if (effectiveness !== 1) {
      steps.push({ text: `It was ${getEffectivenessText(effectiveness)}${effectiveness === 2 ? '!' : '.'}`, apply: (prev) => ({ ...prev }), sound: null })
    }
    if (battleState.enemy.hp - playerDamage <= 0) steps.push({ text: 'You defeated TWO!', apply: (prev) => ({ ...prev, result: 'victory', unlockSection: 'about' }), sound: 'You Win' })
  }

  if (trickRoomActive) {
    applyPlayerMove()
    if (battleState.enemy.hp - playerDamage > 0 && battleState.player.hp > 0) applyEnemyMove()
  } else {
    applyEnemyMove()
    if (battleState.player.hp > 0 && battleState.enemy.hp > 0) applyPlayerMove()
  }

  steps.push({ text: '', apply: (prev) => {
    // Trick Room manages its own remaining-turn count inside applyPlayerMove
    // (4 when first cast, 0 when re-cast to cancel), so leave it untouched
    // here. Every other move simply ticks the counter down by one turn.
    if (move.id === 'trick-room') return prev
    return { ...prev, player: { ...prev.player, trickRoomTurnsLeft: Math.max(0, prev.player.trickRoomTurnsLeft - 1) } }
  }, sound: null })
  return steps
}

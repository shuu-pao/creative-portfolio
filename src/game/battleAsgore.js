// Builds the sequence of {text, apply, sound} steps for one turn of the ASGORE
// fight (the follow-up that begins after GHOST is killed). Pure: reads
// `battleState` + `move`, returns the steps array.
//
// ASGORE is slower than the player (acts second) unless Trick Room is active. He
// runs a fixed loop: WEAPON SWING, WEAPON SWING, HEAVY WEAPON SWING (a 2-turn
// move: prepare, then a huge 70-damage swing), then repeats. He only ever takes
// 10 from the player's damaging moves.
export function buildAsgoreSteps(battleState, move) {
  const steps = []
  const trickRoomActive = battleState.player.trickRoomTurnsLeft > 0
  const playerName = battleState.player.name
  const enemyName = battleState.enemy.name
  const asgore = battleState.asgore || { comboStep: 0 }

  const applyPlayerAttack = () => {
    if (move.id === 'trick-room' || move.id === 'enemy-only') return
    const dmg = 10
    steps.push({ text: `${playerName} used ${move.label}.`, apply: (p) => p, sound: move.id === 'ember' ? 'Ember' : move.id === 'water-gun' ? 'Water Gun' : move.id === 'vine-whip' ? 'Vine Whip' : null })
    steps.push({
      text: '',
      apply: (p) => ({
        ...p,
        enemy: { ...p.enemy, hp: Math.max(0, p.enemy.hp - dmg) },
        lastHit: { side: 'enemy', effectiveness: 1 },
      }),
      sound: 'Hit Normal Damage',
    })
    if (battleState.enemy.hp - dmg <= 0) {
      steps.push({ text: `You defeated ${enemyName}!`, apply: (p) => ({ ...p, enemy: { ...p.enemy, hp: 0 }, result: 'victory' }), sound: 'You Win' })
    }
  }

  const applyAsgoreMove = () => {
    const step = asgore.comboStep
    const nextStep = (step + 1) % 4
    if (step === 0 || step === 1) {
      // WEAPON SWING — announced as "ASGORE attacks.", then the blade SFX, then
      // the damage check with Hit Normal Damage. Always deals 25.
      steps.push({ text: `${enemyName} attacks.`, apply: (p) => ({ ...p, asgore: { ...p.asgore, comboStep: nextStep } }), sound: null })
      steps.push({ text: '', apply: (p) => p, sound: 'Asgore Blade' })
      steps.push({
        text: '',
        apply: (p) => ({ ...p, player: { ...p.player, hp: Math.max(0, p.player.hp - 25) }, lastHit: { side: 'player', effectiveness: 1 } }),
        sound: 'Hit Normal Damage',
      })
      if (battleState.player.hp - 25 <= 0) steps.push({ text: 'You lost the battle.', apply: (p) => ({ ...p, result: 'loss' }), sound: 'You Lost' })
    } else if (step === 2) {
      // HEAVY WEAPON SWING, turn 1: just winds up — nothing happens yet.
      steps.push({ text: `${enemyName} is preparing for a huge swing.`, apply: (p) => ({ ...p, asgore: { ...p.asgore, comboStep: nextStep } }), sound: null })
    } else {
      // HEAVY WEAPON SWING, turn 2: the huge swing lands for 70.
      steps.push({ text: `${enemyName} attacks with a huge swing.`, apply: (p) => ({ ...p, asgore: { ...p.asgore, comboStep: nextStep } }), sound: null })
      steps.push({ text: '', apply: (p) => p, sound: 'Asgore Blade' })
      steps.push({
        text: '',
        apply: (p) => ({ ...p, player: { ...p.player, hp: Math.max(0, p.player.hp - 70) }, lastHit: { side: 'player', effectiveness: 1 } }),
        sound: 'Hit Normal Damage',
      })
      if (battleState.player.hp - 70 <= 0) steps.push({ text: 'You lost the battle.', apply: (p) => ({ ...p, result: 'loss' }), sound: 'You Lost' })
    }
  }

  // TALK on ASGORE reuses this builder with an `enemy-only` move: skip the
  // player's action and just let ASGORE act.
  if (move.id === 'enemy-only') {
    applyAsgoreMove()
    return steps
  }

  if (move.id === 'trick-room') {
    // TRICK ROOM has negative priority, so it always goes second: ASGORE's swing
    // resolves first, then the player twists the dimensions.
    if (battleState.player.hp > 0 && battleState.enemy.hp > 0) applyAsgoreMove()
    if (trickRoomActive) {
      steps.push({ text: `${playerName} used ${move.label}.`, apply: (p) => ({ ...p, player: { ...p.player, trickRoomTurnsLeft: 0 } }), sound: 'Trick Room' })
      steps.push({ text: 'The dimensions went back to normal.', apply: (p) => p, sound: null })
    } else {
      steps.push({ text: `${playerName} used ${move.label}.`, apply: (p) => ({ ...p, player: { ...p.player, trickRoomTurnsLeft: 4 } }), sound: 'Trick Room' })
      steps.push({ text: `${playerName} twisted the dimensions. This lasts for 4 turns.`, apply: (p) => p, sound: null })
    }
    return steps
  }

  // Normal damaging turn. ASGORE is slower, so the player acts first unless
  // Trick Room is active (then ASGORE goes first).
  if (trickRoomActive) {
    applyAsgoreMove()
    if (battleState.player.hp > 0 && battleState.enemy.hp > 0) applyPlayerAttack()
  } else {
    applyPlayerAttack()
    if (battleState.player.hp > 0 && battleState.enemy.hp > 0) applyAsgoreMove()
  }

  // A non-trick-room move consumes one turn of Trick Room if it is active.
  steps.push({ text: '', apply: (p) => ({ ...p, player: { ...p.player, trickRoomTurnsLeft: Math.max(0, p.player.trickRoomTurnsLeft - 1) } }), sound: null })
  return steps
}

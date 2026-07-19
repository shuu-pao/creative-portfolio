// Builds the sequence of {text, apply, sound} steps for one turn of the GHOST
// fight. Pure: reads `battleState` + `move`, returns the steps array. The caller
// (useBattle.handleBattleMove) dispatches them into state.
//
// GHOST never attacks — his "moves" are replaced by dialogue that escalates as
// the player attacks him. He is faster than the player (acts first) unless Trick
// Room is active. Befriending him (ACT -> TALK -> TALK -> JOKE) unlocks
// PROFESSIONAL EXPERIENCE; killing him chains into the ASGORE fight.
export function buildGhostSteps(battleState, move) {
  const steps = []
  const playerName = battleState.player.name
  const enemyName = battleState.enemy.name
  // Lingering text shown at the end of every resolved GHOST turn (and kept on
  // screen until the player's next move). It is the last step of each turn so
  // it becomes the persistent battle log.
  const watchStep = { text: 'Someone is watching.', apply: (p) => p, sound: null }
  const ghost = battleState.ghost || {
    attacksReceived: 0,
    talkStage: 0,
    dialogue: 'GHOST is minding his own business.',
    fatalSurvived: false,
  }
  const isTrickRoom = move.id === 'trick-room'

  // Maps an attack count to GHOST's post-attack dialogue line.
  function dialogueForAttacks(n) {
    if (n >= 4) return `${enemyName} has tears in his eyes, saying he does not want to die.`
    if (n === 3) return `${enemyName} does not want to fight.`
    if (n === 2) return `${enemyName} is wondering what he did wrong.`
    if (n === 1) return `${enemyName} was startled by your attack.`
    return `${enemyName} is minding his own business.`
  }

  // ---- TALK / JOKE (self-contained; GHOST never attacks on these turns) ----
  if (move.id === 'talk' || move.id === 'joke') {
    const fullHp = battleState.enemy.hp >= battleState.enemy.maxHp
    if (!fullHp) {
      steps.push({ text: `${playerName} tried to strike up a conversation with ${enemyName}!`, apply: (p) => p, sound: null })
      steps.push({ text: `${enemyName} is too scared to respond.`, apply: (p) => p, sound: null })
      steps.push(watchStep)
      return steps
    }
    if (move.id === 'joke') {
      steps.push({ text: `${playerName} told a joke.`, apply: (p) => p, sound: null })
      steps.push({ text: `${enemyName} is amused!`, apply: (p) => ({ ...p, ghost: { ...p.ghost, dialogue: `${enemyName} is amused!` } }), sound: null })
      // Befriending GHOST unlocks PROFESSIONAL EXPERIENCE directly — skip the
      // "You Won!" screen (no "You Win" SFX) and go straight to "Unlocked!".
      steps.push({ text: `${enemyName} unlocked PROFESSIONAL EXPERIENCE for you!`, apply: (p) => ({ ...p, result: 'victory', unlockSections: ['professional'], directUnlock: true }), sound: null })
      return steps
    }
    // talk + full HP
    if (ghost.talkStage === 0) {
      steps.push({ text: `${playerName} tried to strike up a conversation with ${enemyName}!`, apply: (p) => p, sound: null })
      steps.push({ text: `${enemyName} says hi!`, apply: (p) => ({ ...p, ghost: { ...p.ghost, talkStage: 1, dialogue: `${enemyName} says hi!` } }), sound: null })
    } else {
      // 2nd TALK: the option then turns into JOKE (handled in BattleScreen).
      steps.push({ text: `${playerName} asked ${enemyName} if he could unlock PROFESSIONAL EXPERIENCE for him.`, apply: (p) => p, sound: null })
      steps.push({ text: `${enemyName} says he will do it if you can make him laugh.`, apply: (p) => ({ ...p, ghost: { ...p.ghost, talkStage: 2, dialogue: `${enemyName} says he will do it if you can make him laugh.` } }), sound: null })
    }
    steps.push(watchStep)
    return steps
  }

  // ---- ATTACK / TRICK ROOM ----

  // GHOST always takes 25 from damaging moves. The first lethal hit is clamped
  // to 1 HP (no text mentions it); a later lethal hit actually kills him.
  let newGhostHp = battleState.enemy.hp
  let killsGhost = false
  let surviveAt1 = false
  if (!isTrickRoom) {
    const dmg = 25
    if (battleState.enemy.hp - dmg <= 0) {
      if (!ghost.fatalSurvived) {
        newGhostHp = 1
        surviveAt1 = true
      } else {
        newGhostHp = 0
        killsGhost = true
      }
    } else {
      newGhostHp = battleState.enemy.hp - dmg
    }
  }

  const pushGhostDialogue = () => steps.push({ text: ghost.dialogue, apply: (p) => p, sound: null })

  if (isTrickRoom) {
    // GHOST acts first (TRICK ROOM has negative priority, so it always goes
    // second): his dialogue plays, then the player twists the dimensions.
    pushGhostDialogue()
    steps.push({ text: `${playerName} used ${move.label}.`, apply: (p) => ({ ...p, player: { ...p.player, trickRoomTurnsLeft: 4 } }), sound: 'Trick Room' })
    steps.push({ text: `${playerName} twisted the dimensions. This lasts for 4 turns.`, apply: (p) => p, sound: null })
    steps.push({ text: '', apply: (p) => ({ ...p, player: { ...p.player, trickRoomTurnsLeft: Math.max(0, p.player.trickRoomTurnsLeft - 1) } }), sound: null })
    steps.push(watchStep)
    return steps
  }

  if (killsGhost) {
    // GHOST's current dialogue (e.g. "tears") plays, then the killing blow, then
    // the hand-off to the ASGORE fight. The kill flags stopMusic so the Ghost
    // theme stops immediately instead of looping under the ASGORE intro.
    pushGhostDialogue()
    steps.push({ text: `${playerName} used ${move.label}.`, apply: (p) => p, sound: move.id === 'ember' ? 'Ember' : move.id === 'water-gun' ? 'Water Gun' : move.id === 'vine-whip' ? 'Vine Whip' : null })
    steps.push({ text: '', apply: (p) => ({ ...p, enemy: { ...p.enemy, hp: 0 }, ghost: { ...p.ghost, fatalSurvived: true }, lastHit: { side: 'enemy', effectiveness: 1 }, stopMusic: true }), sound: 'Hit Normal Damage' })
    steps.push({ text: `You killed ${enemyName}!`, apply: (p) => p, sound: null })
    steps.push({ text: `ASGORE witnessed ${enemyName}'s murder!`, apply: (p) => p, sound: null })
    steps.push({ text: '...', apply: (p) => p, sound: null })
    steps.push({ text: 'ASGORE stands in your way!', apply: (p) => ({ ...p, transitionTo: 'asgore' }), sound: null })
    return steps
  }

  // Normal damaging turn: GHOST's dialogue first (he is faster), then the hit.
  pushGhostDialogue()
  steps.push({ text: `${playerName} used ${move.label}.`, apply: (p) => p, sound: move.id === 'ember' ? 'Ember' : move.id === 'water-gun' ? 'Water Gun' : move.id === 'vine-whip' ? 'Vine Whip' : null })
  const newDialogue = dialogueForAttacks(ghost.attacksReceived + 1)
  steps.push({
    text: '',
    apply: (p) => ({
      ...p,
      enemy: { ...p.enemy, hp: newGhostHp },
      ghost: {
        ...p.ghost,
        attacksReceived: ghost.attacksReceived + 1,
        dialogue: newDialogue,
        fatalSurvived: p.ghost.fatalSurvived || surviveAt1,
      },
      lastHit: { side: 'enemy', effectiveness: 1 },
    }),
    sound: 'Hit Normal Damage',
  })
  // A non-trick-room attack consumes one turn of Trick Room if it is active.
  steps.push({ text: '', apply: (p) => ({ ...p, player: { ...p.player, trickRoomTurnsLeft: Math.max(0, p.player.trickRoomTurnsLeft - 1) } }), sound: null })
  // After every resolved turn, "Someone is watching." lingers on screen until the
  // player's next move (it is the final step, so it becomes the persistent log).
  steps.push(watchStep)
  return steps
}

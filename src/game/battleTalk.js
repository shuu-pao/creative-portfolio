import { buildHollowSteps } from './battleHollow'
import { buildAsgoreSteps } from './battleAsgore'

// Builds the sequence of {text, apply, sound} steps for a TALK action in a fight
// other than GHOST (GHOST's TALK/JOKE is handled inside buildGhostSteps). TALK
// always goes first: the player tries to talk, the opponent is unresponsive, then
// the opponent's normal move resolves.
export function buildTalkSteps(battleState, move) {
  const steps = []
  const playerName = battleState.player.name
  const enemyName = battleState.enemy.name
  if (battleState.mode === 'asgore') {
    // TALK on ASGORE is a guilt-stricken apology for killing GHOST, not a
    // generic attempt at conversation.
    steps.push({ text: `${playerName} apologizes for what he did to GHOST.`, apply: (p) => p, sound: null })
    steps.push({ text: `${enemyName} is unresponsive.`, apply: (p) => p, sound: null })
  } else {
    steps.push({ text: `${playerName} tried to strike up a conversation with ${enemyName}!`, apply: (p) => p, sound: null })
    steps.push({ text: `${enemyName} is unresponsive.`, apply: (p) => p, sound: null })
  }
  if (battleState.mode === 'hollow') {
    steps.push(...buildHollowSteps(battleState, { id: 'enemy-only', label: 'ENEMY-ONLY' }))
  } else if (battleState.mode === 'asgore') {
    steps.push(...buildAsgoreSteps(battleState, { id: 'enemy-only', label: 'ENEMY-ONLY' }))
  } else if (battleState.mode === 'school') {
    // DR. ZANGETSU's "move" is the current question — re-show it so the player
    // can answer.
    const q = battleState.school?.currentQuestion
    if (q) steps.push({ text: q.question.text, apply: (p) => p, sound: 'Question' })
  }
  return steps
}

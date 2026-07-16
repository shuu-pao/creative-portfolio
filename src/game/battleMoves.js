import { movesFor } from '../data/bosses'

// The move grid depends on the active battle. For the DR. ZANGETSU fight the
// player's moves are either the four ATTEND CLASS buttons (before the first
// subject is chosen) or the four answer options of the current question.
export function buildBattleMoves(battleState) {
  if (!battleState) return []
  if (battleState.mode === 'hollow') return movesFor('hollow')
  if (battleState.school?.currentQuestion) {
    return battleState.school.currentQuestion.options.map((opt, i) => ({
      id: `opt-${i}`,
      label: opt,
      type: 'Student',
      optionIndex: i,
    }))
  }
  return Array.from({ length: 4 }, (_, i) => ({ id: `attend-${i}`, label: 'ATTEND CLASS', type: 'Student' }))
}

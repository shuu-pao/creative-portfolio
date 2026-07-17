import { ALL_SUBJECTS, SLOT_DAMAGE, WRONG_ANSWER_DAMAGE, addAsked, pickQuestion } from '../data/questions'

// Builds the sequence of {text, apply, sound} steps for one turn of the
// DR. ZANGETSU quiz fight. Pure: it only reads `battleState` and `move`,
// returning the steps array. The caller dispatches them into state.
export function buildSchoolSteps(battleState, move) {
  const steps = []
  const school = battleState.school
  const playerName = battleState.player.name
  const enemyName = battleState.enemy.name
  const subject = battleState.enemy.type

  // Turn 1: the player's only move is ATTEND CLASS, which triggers the enemy's
  // CLASS IS IN SESSION (random subject pick + first question of that subject).
  if (!school.currentQuestion) {
    const firstSubject = ALL_SUBJECTS[Math.floor(Math.random() * ALL_SUBJECTS.length)]
    const q1 = pickQuestion(firstSubject, 1, {})
    steps.push({ text: `${playerName} attended class.`, apply: (prev) => prev, sound: null })
    steps.push({
      text: `${enemyName} used CLASS IS IN SESSION.`,
      apply: (prev) => ({
        ...prev,
        enemy: { ...prev.enemy, type: firstSubject },
        school: {
          ...prev.school,
          subjectsUsed: [firstSubject],
          activeSlot: 1,
          qAnswered: { 1: false, 2: false, 3: false },
          skipsRemaining: 1,
          asked: {},
          currentQuestion: q1.question,
        },
      }),
      sound: 'In-Battle Ability Activate',
    })
    steps.push({ text: `${firstSubject} is in session.`, apply: (prev) => prev, sound: null })
    steps.push({ text: `${enemyName} used QUESTION #1.`, apply: (prev) => prev, sound: null })
    steps.push({ text: q1.question.text, apply: (prev) => ({ ...prev, school: { ...prev.school, asked: addAsked(prev.school.asked, firstSubject, 1, q1.index) } }), sound: 'Question' })
    return steps
  }

  const slot = school.activeSlot
  const curQ = school.currentQuestion
  const optIndex = move.optionIndex

  // SKIP — only allowed while skips remain; otherwise bounce back to the same
  // set of options without advancing the turn.
  if (optIndex === 3) {
    if (school.skipsRemaining <= 0) {
      steps.push({ text: 'You have no skips remaining for this subject.', apply: (prev) => prev, sound: null })
      steps.push({ text: curQ.question.text, apply: (prev) => prev, sound: null })
      return steps
    }
    const newSkips = school.skipsRemaining - 1
    const newQ = pickQuestion(subject, slot, addAsked(school.asked, subject, slot, curQ.index))
    steps.push({
      text: newSkips > 0
        ? `You skipped the question. You have ${newSkips} skip${newSkips === 1 ? '' : 's'} remaining for this subject.`
        : 'You skipped the question. You have no skips remaining for this subject.',
      apply: (prev) => ({ ...prev, school: { ...prev.school, skipsRemaining: newSkips } }),
      sound: 'Skip',
    })
    steps.push({ text: `${enemyName} used QUESTION #${slot}.`, apply: (prev) => prev, sound: null })
    steps.push({
      text: newQ.question.text,
      apply: (prev) => ({ ...prev, school: { ...prev.school, currentQuestion: newQ.question, asked: addAsked(prev.school.asked, subject, slot, newQ.index) } }),
      sound: 'Question',
    })
    return steps
  }

  // Wrong answer: blank + sound -> 20 damage -> "You were wrong." -> re-ask a
  // not-yet-shown question at the same level (the slot stays UNANSWERED).
  if (optIndex !== curQ.correctIndex) {
    const playerHpBefore = battleState.player.hp
    steps.push({ text: '', apply: (prev) => prev, sound: 'answer wrong' })
    steps.push({ text: '', apply: (prev) => ({ ...prev, player: { ...prev.player, hp: Math.max(0, prev.player.hp - WRONG_ANSWER_DAMAGE) }, lastHit: { side: 'player', effectiveness: 1 } }), sound: 'Hit Super Effective' })
    steps.push({ text: 'You were wrong.', apply: (prev) => prev, sound: null })
    if (playerHpBefore - WRONG_ANSWER_DAMAGE <= 0) {
      steps.push({ text: 'You lost the battle.', apply: (prev) => ({ ...prev, result: 'loss' }), sound: 'You Lost' })
      return steps
    }
    const newQ = pickQuestion(subject, slot, addAsked(school.asked, subject, slot, curQ.index))
    steps.push({ text: `${enemyName} used QUESTION #${slot}.`, apply: (prev) => prev, sound: null })
    steps.push({
      text: newQ.question.text,
      apply: (prev) => ({ ...prev, school: { ...prev.school, currentQuestion: newQ.question, asked: addAsked(prev.school.asked, subject, slot, newQ.index) } }),
      sound: 'Question',
    })
    return steps
  }

  // Correct answer.
  const dmg = SLOT_DAMAGE[slot]
  const enemyHpBefore = battleState.enemy.hp
  const effectiveness = slot === 1 ? 0.5 : slot === 3 ? 2 : 1
  const correctHitSound = slot === 1 ? 'Hit Weak Not Very Effective' : slot === 2 ? 'Hit Normal Damage' : 'Hit Super Effective'
  steps.push({ text: '', apply: (prev) => prev, sound: 'answer correct' })
  steps.push({ text: '', apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: Math.max(0, prev.enemy.hp - dmg) }, lastHit: { side: 'enemy', effectiveness } }), sound: correctHitSound })
  steps.push({ text: 'You were correct!', apply: (prev) => prev, sound: null })
  if (enemyHpBefore - dmg <= 0) {
    steps.push({ text: `You defeated ${enemyName}!`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: 0 }, result: 'victory', unlockSection: 'education' }), sound: 'You Win' })
    return steps
  }
  if (slot < 3) {
    // Advance to the next question slot (next difficulty level) of this subject.
    const nextSlot = slot + 1
    const newQ = pickQuestion(subject, nextSlot, school.asked)
    steps.push({
      text: `${enemyName} used QUESTION #${nextSlot}.`,
      apply: (prev) => ({
        ...prev,
        school: {
          ...prev.school,
          activeSlot: nextSlot,
          qAnswered: { ...prev.school.qAnswered, [slot]: true },
          currentQuestion: newQ.question,
          asked: addAsked(prev.school.asked, subject, nextSlot, newQ.index),
        },
      }),
      sound: null,
    })
    steps.push({ text: newQ.question.text, apply: (prev) => prev, sound: 'Question' })
    return steps
  }
  // All three answered: switch to a fresh, unused subject and reset the slots.
  const remaining = ALL_SUBJECTS.filter((s) => !school.subjectsUsed.includes(s))
  const newSubject = remaining[Math.floor(Math.random() * remaining.length)]
  const newQ = pickQuestion(newSubject, 1, {})
  steps.push({
    text: `${enemyName} used CLASS IS IN SESSION.`,
    apply: (prev) => ({
      ...prev,
      enemy: { ...prev.enemy, type: newSubject },
      school: {
        ...prev.school,
        subjectsUsed: [...prev.school.subjectsUsed, newSubject],
        activeSlot: 1,
        qAnswered: { 1: false, 2: false, 3: false },
        skipsRemaining: 1,
        asked: addAsked({}, newSubject, 1, newQ.index),
        currentQuestion: newQ.question,
      },
    }),
    sound: 'In-Battle Ability Activate',
  })
  steps.push({ text: `${newSubject} is in session.`, apply: (prev) => prev, sound: null })
  steps.push({ text: `${enemyName} used QUESTION #1.`, apply: (prev) => prev, sound: null })
  steps.push({ text: newQ.question.text, apply: (prev) => prev, sound: 'Question' })
  return steps
}

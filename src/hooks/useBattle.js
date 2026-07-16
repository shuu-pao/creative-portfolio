import { useEffect, useRef, useState } from 'react'
import { useTypewriter } from './useTypewriter'
import { buildHollowSteps } from '../game/battleHollow'
import { buildSchoolSteps } from '../game/battleSchool'

// Owns the entire battle subsystem: state, the turn-sequence engine, sprite
// feedback, and the post-battle unlock flow. `characterName` is read at call
// time by startBattle; the other callbacks let the battle navigate the app.
export function useBattle({ setScreen, setContentView, playSoundEffect, characterName, characterGender }) {
  const [battleState, setBattleState] = useState(null)
  const [battleMenuView, setBattleMenuView] = useState('main')
  // Bag inventory. CALL REINFORCEMENTS starts at 99 uses and PERSISTS across
  // battles and retries for the whole session — it is intentionally NOT reset by
  // startBattle (which only rebuilds battleState), so a use spent in one fight
  // stays spent in the next.
  const [reinforcementUses, setReinforcementUses] = useState(99)
  // Post-battle follow-up screen: null (none), 'tryAgain' (loss), 'won'
  // (victory, before unlock screen), or 'unlocked' (victory that unlocked a new
  // section).
  const [resultScreen, setResultScreen] = useState(null)
  const [unlockedSections, setUnlockedSections] = useState(['contact'])
  // Gates the battle theme: it must wait until the "Boss Select" cue finishes
  // before it starts. Reset to false whenever a battle begins.
  const [battleMusicReady, setBattleMusicReady] = useState(false)
  // True while the "Boss Select" cue is actually playing. While it is true the
  // background music (menu or battle) is silenced, so it never overlaps the cue
  // and cannot resume until the cue's 'ended' event clears this flag.
  const [bossCuePlaying, setBossCuePlaying] = useState(false)
  // Sprite hit/defeat feedback. `flinch` momentarily shakes a sprite when its HP
  // drops; `fainted` (derived from hp<=0 in the JSX) fades it out on defeat.
  const [flinch, setFlinch] = useState({ player: false, enemy: false })
  const flinchTimers = useRef({ player: null, enemy: null })
  const prevHpRef = useRef({ player: null, enemy: null })

  const { displayed: displayedBattleText, isTyping } = useTypewriter(battleState?.battleText)

  function triggerFlinch(side) {
    setFlinch((f) => ({ ...f, [side]: true }))
    if (flinchTimers.current[side]) clearTimeout(flinchTimers.current[side])
    flinchTimers.current[side] = setTimeout(() => {
      setFlinch((f) => ({ ...f, [side]: false }))
    }, 340)
  }

  // Sprite flinch: when a monster's HP decreases, briefly shake its sprite.
  useEffect(() => {
    if (!battleState) return
    const prev = prevHpRef.current
    const curP = battleState.player.hp
    const curE = battleState.enemy.hp
    if (prev.player !== null && curP < prev.player) triggerFlinch('player')
    if (prev.enemy !== null && curE < prev.enemy) triggerFlinch('enemy')
    prevHpRef.current = { player: curP, enemy: curE }
  }, [battleState?.player.hp, battleState?.enemy.hp])

  // Turn-sequence engine. Steps are played one at a time: type the text, wait,
  // then apply the step and advance. Stops when the sequence is exhausted or a
  // result is reached.
  useEffect(() => {
    if (!battleState?.isResolving || !battleState.sequence?.length) return undefined
    const stepIndex = battleState.sequenceIndex ?? 0
    if (stepIndex >= battleState.sequence.length) {
      setBattleState((prev) => (prev ? { ...prev, isResolving: false } : prev))
      setBattleMenuView('main')
      return undefined
    }

    // Wait for typing to complete before advancing to next step.
    if (isTyping) {
      const timer = window.setTimeout(() => {}, 100)
      return () => window.clearTimeout(timer)
    }

    // Not typing anymore, proceed with the step after a brief pause to let the
    // user read.
    const timer = window.setTimeout(() => {
      setBattleState((prev) => {
        if (!prev) return prev
        const step = prev.sequence[prev.sequenceIndex ?? 0]
        if (step.sound) playSoundEffect(step.sound)
        const next = {
          ...step.apply(prev),
          battleText: step.text,
          sequenceIndex: (prev.sequenceIndex ?? 0) + 1,
          isResolving: true,
        }
        // Once a result is decided (win/loss), the battle ends on this text. Stop
        // resolving any further steps (e.g. trailing trick-room upkeep) so no
        // pending moves or battle text run after the player has won or lost.
        if (next.result) {
          return { ...next, isResolving: false, sequence: [], sequenceIndex: 0 }
        }
        return next
      })
    }, 800) // Wait 800ms after text is fully displayed before moving to next action
    return () => window.clearTimeout(timer)
  }, [battleState?.isResolving, battleState?.sequenceIndex, battleState?.sequence, isTyping])

  // After the battle resolves, decide the follow-up screen. A win that unlocked
  // a new section shows the "You Unlocked" screen; a win with nothing new goes
  // straight back to Boss Select. A loss shows the "Try Again?" screen. The
  // win/lose audio already played inline with the battle text (see the victory/
  // loss sequence steps), so this only handles navigation.
  useEffect(() => {
    if (!battleState || !battleState.result || battleState.isResolving) return undefined
    // On victory we always show the "You Won!" screen first. From there the
    // player presses CONTINUE: if the win unlocked a previously-locked section,
    // the Unlock screen appears next; otherwise we return to Boss Select. The
    // actual unlock is performed by a separate effect when the won screen mounts
    // (see below), keeping this effect free of side effects.
    if (battleState.result === 'victory') {
      const section = battleState.unlockSection
      const newlyUnlocked = !!(section && !unlockedSections.includes(section))
      setResultScreen({ type: 'won', newlyUnlocked, section })
    } else {
      setResultScreen({ type: 'tryAgain' })
    }
    return undefined
    // `unlockedSections` is intentionally omitted: this effect must run once when
    // the result settles, and reading its current value here is correct at that
    // moment. Re-running after we unlock would double-fire navigation.
  }, [battleState?.result, battleState?.isResolving])

  // Persist the unlock exactly once, when the "You Won!" screen for a fight that
  // unlocked something first becomes visible. The Unlock screen is only ever
  // shown after this, so the section is already in state by the time it renders.
  useEffect(() => {
    if (resultScreen?.type !== 'won' || !resultScreen.newlyUnlocked) return undefined
    const section = resultScreen.section
    setUnlockedSections((value) => (value.includes(section) ? value : [...value, section]))
    return undefined
  }, [resultScreen?.type, resultScreen?.newlyUnlocked, resultScreen?.section])

  // Play the "Unlocked" cue exactly when the Unlock screen becomes visible —
  // it should accompany that screen, not fire inline with the battle text.
  useEffect(() => {
    if (resultScreen?.type === 'unlocked') {
      playSoundEffect('Unlocked')
    }
    return undefined
  }, [resultScreen?.type])

  // Builds and starts a battle against the given boss, addressing the player by
  // the character name they entered.
  function startBattle(bossId, playerNameArg, playerGenderArg) {
    // Re-arm the battle music gate — the theme must wait for the Boss Select cue
    // to finish before it starts (it is un-gated in the Boss Select 'ended' handler).
    setBattleMusicReady(false)
    // Prefer an explicitly passed name (set synchronously in submitCharacterName)
    // so the first battle after naming shows the name immediately. Fall back to
    // the component state for battles started later via handleBossSelected.
    const playerName = playerNameArg ?? characterName
    // Prefer an explicitly passed gender (set synchronously in
    // submitCharacterName) so the first battle after naming uses it immediately;
    // fall back to the hook state for battles started later via
    // handleBossSelected / retryBattle.
    const playerGender = playerGenderArg ?? characterGender ?? 'male'
    if (bossId === 'hollow') {
      setBattleState({
        mode: 'hollow',
        player: { name: playerName, displayName: playerName, gender: playerGender, hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
        enemy: { name: 'APOSTLE: TWO', displayName: 'APOSTLE: TWO', hp: 100, maxHp: 100, type: 'Fire', speed: 150, lastMove: null },
        battleText: 'APOSTLE: TWO stands in your way!',
        result: null,
        isResolving: false,
        sequence: [],
        sequenceIndex: 0,
        unlockSection: null,
      })
    } else if (bossId === 'school') {
      setBattleState({
        mode: 'school',
        player: { name: playerName, displayName: playerName, gender: playerGender, hp: 100, maxHp: 100, type: 'Normal', speed: 120 },
        enemy: { name: 'DR. ZANGETSU', displayName: 'DR. ZANGETSU', hp: 100, maxHp: 100, type: 'Normal', speed: 60 },
        battleText: 'DR. ZANGETSU stands in your way!',
        result: null,
        isResolving: true,
        school: {
          subjectsUsed: [],
          qAnswered: { 1: false, 2: false, 3: false },
          skipsRemaining: 1,
          asked: {},
          currentQuestion: null,
          activeSlot: null,
        },
        sequence: [
          { text: `DR. ZANGETSU's ability BACK 2 SCHOOL has been activated.`, apply: (prev) => ({ ...prev }), sound: 'In-Battle Ability Activate' },
          { text: `${playerName}'s type changed into Student.`, apply: (prev) => ({ ...prev, player: { ...prev.player, type: 'Student' } }), sound: 'In-Battle Ability Activate' },
        ],
        sequenceIndex: 0,
        unlockSection: null,
      })
    } else {
      // No battle is configured for this boss yet (e.g. the still-locked
      // "KEEPER OF PROJECTS"). Fail safe instead of crashing.
      console.warn(`useBattle.startBattle: no battle configured for boss "${bossId}"`)
      return
    }
    setBattleMenuView('main')
    setScreen('battle')
  }

  // Plays the "Boss Select" cue and silences the background music for its full
  // duration. The cue runs on its own Audio element; while it plays the music
  // effect pauses all background music (see useBackgroundMusic's bossCuePlaying
  // guard). On the cue's 'ended' event we clear the cue flag and un-gate the
  // battle theme.
  function playBossSelectCue() {
    setBossCuePlaying(true)
    const bossSelect = playSoundEffect('Boss Select')
    bossSelect.addEventListener('ended', () => {
      setBossCuePlaying(false)
      setBattleMusicReady(true)
    })
    return bossSelect
  }

  // Dispatches a player move as a freshly-built turn sequence. The build is pure
  // (see game/battleHollow.js / game/battleSchool.js); this only wires it in.
  function handleBattleMove(move) {
    if (!battleState || battleState.result || battleState.isResolving) return
    const steps = battleState.mode === 'hollow'
      ? buildHollowSteps(battleState, move)
      : buildSchoolSteps(battleState, move)
    setBattleState((prev) => ({ ...prev, isResolving: true, sequence: steps, sequenceIndex: 0, battleText: '', result: null }))
    setBattleMenuView('main')
  }

  // Uses the CALL REINFORCEMENTS bag item. This "move" always goes first and
  // always resolves the fight: it builds a fixed sequence that ends with the
  // opponent taking 999 damage (a guaranteed KO) and the standard victory flow
  // for whichever boss is being fought. Because the sequence contains no enemy
  // move, the opponent never gets to retaliate. One use is spent per activation
  // (the count persists across battles via reinforcementUses).
  function handleUseItem() {
    if (!battleState || battleState.result || battleState.isResolving) return
    if (reinforcementUses <= 0) return
    const playerName = battleState.player.name
    const enemyName = battleState.enemy.name
    // Victory here unlocks the same section the boss's normal win would.
    const unlockSection = battleState.mode === 'school' ? 'education' : 'about'
    const steps = [
      { text: `${playerName} called for help.`, apply: (prev) => ({ ...prev }), sound: null },
      { text: 'The CREATOR noticed your presence.', apply: (prev) => ({ ...prev }), sound: null },
      { text: 'The CREATOR looks disappointed.', apply: (prev) => ({ ...prev }), sound: null },
      { text: '', apply: (prev) => ({ ...prev }), sound: 'Disappointed' },
      { text: 'The CREATOR snapped his fingers!', apply: (prev) => ({ ...prev }), sound: null },
      { text: '', apply: (prev) => ({ ...prev }), sound: 'Finger Snap' },
      { text: '', apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: Math.max(0, prev.enemy.hp - 999) } }), sound: 'Hit Super Effective' },
      { text: `${enemyName} was one shotted!`, apply: (prev) => ({ ...prev }), sound: null },
      { text: `The CREATOR defeated ${enemyName} for you!`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: 0 }, result: 'victory', unlockSection }), sound: 'You Win' },
    ]
    setReinforcementUses((n) => Math.max(0, n - 1))
    setBattleState((prev) => ({ ...prev, isResolving: true, sequence: steps, sequenceIndex: 0, battleText: '', result: null }))
    setBattleMenuView('main')
  }

  function handleRun() {
    playSoundEffect('Run')
    setScreen('bossSelect')
    setBattleState(null)
    setBattleMenuView('main')
    setContentView(null)
    setResultScreen(null)
  }

  // Returns to Boss Select without playing the Run cue (used for the win ->
  // "nothing unlocked" path). Keeps the post-battle follow-up screen cleared.
  function goToBossSelect() {
    setScreen('bossSelect')
    setBattleState(null)
    setBattleMenuView('main')
    setContentView(null)
    setResultScreen(null)
  }

  // Returns to the main menu (used by the "Try Again?" / "You Unlocked" screens).
  function goToMenu() {
    setScreen('menu')
    setBattleState(null)
    setBattleMenuView('main')
    setContentView(null)
    setResultScreen(null)
  }

  // Restarts the just-finished battle against the same boss. The character is
  // already named, so we go straight back into the battle (skipping the Boss
  // Select cue) and re-arm the battle music immediately.
  function retryBattle() {
    const bossId = battleState?.mode === 'school' ? 'school' : 'hollow'
    setResultScreen(null)
    startBattle(bossId, characterName, characterGender)
    setBattleMusicReady(true)
  }

  return {
    battleState,
    battleMenuView,
    setBattleMenuView,
    reinforcementUses,
    resultScreen,
    setResultScreen,
    unlockedSections,
    battleMusicReady,
    bossCuePlaying,
    flinch,
    displayedBattleText,
    startBattle,
    playBossSelectCue,
    handleBattleMove,
    handleUseItem,
    handleRun,
    retryBattle,
    goToBossSelect,
    goToMenu,
  }
}

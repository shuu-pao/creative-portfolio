import { useEffect, useRef, useState } from 'react'
import { useTypewriter } from './useTypewriter'
import { buildHollowSteps } from '../game/battleHollow'
import { buildSchoolSteps } from '../game/battleSchool'
import { buildGhostSteps } from '../game/battleGhost'
import { buildAsgoreSteps } from '../game/battleAsgore'
import { buildTalkSteps } from '../game/battleTalk'
import { UNLOCKABLE_SECTIONS } from '../data/menu'

// Normalizes a battle's unlock payload (string | array | null) into an array so
// a single victory can unlock more than one section (e.g. TWO -> about + skills).
function normalizeSections(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

// Which section-star(s) a legit victory in each mode lights. One boss unlocks
// exactly one section, so this is a 1:1 map. ASGORE is unbeatable and
// reinforcement wins are excluded by usedReinforcements, so they credit nothing.
// The two placeholder bosses (skillsBoss / projectsBoss) are locked, so their
// entries here simply sit ready for when their real fights are built.
const SECTION_STARS = {
  hollow: ['about'],       // TWO
  ghost: ['professional'], // GHOST (befriend)
  school: ['education'],   // DR. ZANGETSU
  skillsBoss: ['skills'],
  projectsBoss: ['projects'],
}

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
  // Unlocked portfolio sections. Starts with the always-available CONTACT plus
  // SKILLS and PERSONAL PROJECTS (their bosses, BOSS 04 / BOSS 05, don't exist
  // yet, so those sections are pre-unlocked to match their default-lit stars).
  // The rest unlock during the session via battle wins or the "Unlock whole
  // menu" button. Intentionally NOT persisted: a refresh resets to this baseline
  // so the menu's progression — and the unlock button — stay meaningful.
  const [unlockedSections, setUnlockedSections] = useState(['contact', 'skills', 'projects'])
  // Sections unlocked via legit battle — drives the menu star row AND serves as
  // the "Normal Mode" baseline (so a bulk unlock can be undone without erasing
  // fairly-earned progress). Session-only, like unlocks. BOSS 04 and BOSS 05
  // have no real fights yet, so their sections (skills / projects) start lit by
  // default — treated as already earned "for now".
  const [earnedStars, setEarnedStars] = useState(['skills', 'projects'])
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
  // Per-hit feedback derived from HP drops: `damageEvent` drives the floating
  // damage number, `screenShake` is set for super-effective hits. `hitId`
  // increments each hit so identical damage re-triggers the float animation.
  const [damageEvent, setDamageEvent] = useState(null)
  const [screenShake, setScreenShake] = useState(false)
  const hitId = useRef(0)
  const hitTimers = useRef({ damage: null, shake: null })

  const { displayed: displayedBattleText, isTyping } = useTypewriter(battleState?.battleText)

  function triggerFlinch(side) {
    setFlinch((f) => ({ ...f, [side]: true }))
    if (flinchTimers.current[side]) clearTimeout(flinchTimers.current[side])
    flinchTimers.current[side] = setTimeout(() => {
      setFlinch((f) => ({ ...f, [side]: false }))
    }, 340)
  }

  // Sprite feedback: when a monster's HP decreases, shake+flash it. We also
  // derive the damage amount from the HP delta and read lastHit.effectiveness
  // (surfaced by the battle engines) to drive a floating number + screen shake.
  useEffect(() => {
    if (!battleState) return
    const prev = prevHpRef.current
    const curP = battleState.player.hp
    const curE = battleState.enemy.hp
    const handleDrop = (side) => {
      const prevHp = side === 'player' ? prev.player : prev.enemy
      const curHp = side === 'player' ? curP : curE
      const amount = prevHp - curHp
      if (amount <= 0) return
      triggerFlinch(side)
      const effectiveness = battleState.lastHit?.side === side ? battleState.lastHit.effectiveness : 1
      hitId.current += 1
      setDamageEvent({ side, amount, effectiveness, hitId: hitId.current })
      if (effectiveness === 2) {
        setScreenShake(true)
        if (hitTimers.current.shake) clearTimeout(hitTimers.current.shake)
        hitTimers.current.shake = setTimeout(() => setScreenShake(false), 360)
      }
      if (hitTimers.current.damage) clearTimeout(hitTimers.current.damage)
      hitTimers.current.damage = setTimeout(() => setDamageEvent(null), 1100)
      // Faint cue: play alongside the sprite's faint animation (which the JSX
      // triggers on hp <= 0) for both the opponent and the player character.
      if (curHp <= 0) playSoundEffect('Fainted')
    }
    if (prev.player !== null && curP < prev.player) handleDrop('player')
    if (prev.enemy !== null && curE < prev.enemy) handleDrop('enemy')
    prevHpRef.current = { player: curP, enemy: curE }
  }, [battleState?.player.hp, battleState?.enemy.hp])

  // Turn-sequence engine. Steps are played one at a time: type the text, wait,
  // then apply the step and advance. Stops when the sequence is exhausted or a
  // result is reached.
  useEffect(() => {
    if (!battleState?.isResolving || !battleState.sequence?.length) return undefined
    const stepIndex = battleState.sequenceIndex ?? 0
    if (stepIndex >= battleState.sequence.length) {
      setBattleState((prev) => (prev ? { ...prev, isResolving: false, introActive: false } : prev))
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
      const sections = normalizeSections(battleState.unlockSections)
      const newlyUnlocked = sections.some((s) => !unlockedSections.includes(s))
      // Credit the section star(s) only for a legit win — CALL
      // REINFORCEMENTS (usedReinforcements) is a cheat and earns nothing. This
      // also builds the "Normal Mode" baseline of fairly-earned sections.
      if (!battleState.usedReinforcements) {
        const earned = SECTION_STARS[battleState.mode]
        if (earned?.length) {
          setEarnedStars((prev) => Array.from(new Set([...prev, ...earned])))
        }
      }
      if (battleState.directUnlock) {
        // GHOST was befriended via JOKE: skip the "You Won!" screen and go
        // straight to "Unlocked!" (the Unlocked SFX plays via the resultScreen
        // effect below).
        setResultScreen({ type: 'unlocked', sections })
      } else {
        setResultScreen({ type: 'won', newlyUnlocked, sections })
      }
    } else {
      setResultScreen({ type: 'tryAgain' })
    }
    return undefined
    // `unlockedSections` is intentionally omitted: this effect must run once when
    // the result settles, and reading its current value here is correct at that
    // moment. Re-running after we unlock would double-fire navigation.
  }, [battleState?.result, battleState?.isResolving])

  // Persist the unlock when a victory screen that unlocked something becomes
  // visible. Covers both the normal "You Won!" -> "Unlocked!" flow and the
  // GHOST-joke direct "Unlocked!" flow (resultScreen.type === 'unlocked').
  useEffect(() => {
    if (!resultScreen) return undefined
    if (resultScreen.type !== 'won' && resultScreen.type !== 'unlocked') return undefined
    const sections = normalizeSections(resultScreen.sections)
    if (!sections.length) return undefined
    setUnlockedSections((value) => {
      const next = [...value]
      sections.forEach((s) => { if (!next.includes(s)) next.push(s) })
      return next
    })
    return undefined
  }, [resultScreen?.type, resultScreen?.sections])

  // Play the "Unlocked" cue exactly when the Unlock screen becomes visible —
  // it should accompany that screen, not fire inline with the battle text.
  useEffect(() => {
    if (resultScreen?.type === 'unlocked') {
      playSoundEffect('Unlocked')
    }
    return undefined
  }, [resultScreen?.type])

  // When GHOST is killed, the death sequence ends by requesting a transition to
  // the ASGORE fight. Start it fresh (trick room cleared, music ready to play
  // immediately) so the follow-up begins cleanly. Deferred via setTimeout so the
  // state updates happen outside the effect body (avoids cascading renders).
  useEffect(() => {
    if (!battleState?.transitionTo) return undefined
    const next = battleState.transitionTo
    const timer = setTimeout(() => {
      startBattle(next, undefined, undefined, true, true)
    }, 0)
    return () => clearTimeout(timer)
  }, [battleState?.transitionTo])

  // CALL REINFORCEMENTS on a damaged GHOST heals him and makes him run away,
  // exiting the battle. Return to Boss Select silently (Run.mp3 already played
  // inline with the battle text). Deferred via setTimeout to avoid cascading
  // renders.
  useEffect(() => {
    if (!battleState?.exitBattle) return undefined
    const timer = setTimeout(() => {
      setScreen('bossSelect')
      setBattleState(null)
      setBattleMenuView('main')
      setContentView(null)
      setResultScreen(null)
    }, 0)
    return () => clearTimeout(timer)
  }, [battleState?.exitBattle])

  // Builds and starts a battle against the given boss, addressing the player by
  // the character name they entered. `musicReady` is true only when a battle is
  // started mid-session without the Boss Select cue (the GHOST -> ASGORE
  // transition), so the theme can begin immediately.
  function startBattle(bossId, playerNameArg, playerGenderArg, musicReady = false, withIntro = false) {
    setDamageEvent(null)
    setScreenShake(false)
    hitId.current = 0
    // Re-arm the battle music gate — the theme must wait for the Boss Select cue
    // to finish before it starts (it is un-gated in the Boss Select 'ended' handler).
    // For the GHOST -> ASGORE transition we pass musicReady=true instead.
    setBattleMusicReady(musicReady)
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
        enemy: { name: 'TWO', displayName: 'TWO', hp: 100, maxHp: 100, type: 'Fire', speed: 150, lastMove: null },
        battleText: 'TWO stands in your way!',
        result: null,
        isResolving: false,
        sequence: [],
        sequenceIndex: 0,
        unlockSections: [],
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
        unlockSections: [],
        // True only during the opening "BACK 2 SCHOOL" ability sequence. While
        // it is true, RUN stays usable (the one exception to the normal
        // "disabled while resolving" rule) so the player can flee before the
        // fight actually begins. Cleared when the intro sequence finishes.
        introActive: true,
      })
    } else if (bossId === 'ghost') {
      setBattleState({
        mode: 'ghost',
        player: { name: playerName, displayName: playerName, gender: playerGender, hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
        enemy: { name: 'GHOST', displayName: 'GHOST', hp: 100, maxHp: 100, type: 'GHOST', speed: 200, lastMove: null },
        ghost: { attacksReceived: 0, talkStage: 0, dialogue: 'GHOST is minding his own business.', fatalSurvived: false },
        battleText: 'A GHOST appeared!',
        result: null,
        isResolving: false,
        sequence: [],
        sequenceIndex: 0,
        unlockSections: [],
      })
    } else if (bossId === 'asgore') {
      if (withIntro) {
        // Scripted intro played only when ASGORE is reached via the GHOST-death
        // transition. ASGORE's sprite (Asgore Boss.png) appears but the opponent
        // CARD stays GHOST's (dead, 0 HP) until the reveal step. He swings
        // (Asgore Blade.mp3), destroys the RUN button (Delete.mp3), then the card
        // flips to ASGORE and his theme starts. Trick room is cleared by this fresh state.
        const enemyName = 'ASGORE'
        setBattleState({
          mode: 'asgore',
          player: { name: playerName, displayName: playerName, gender: playerGender, hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
          enemy: { name: enemyName, displayName: enemyName, hp: 100, maxHp: 100, type: 'Monster', speed: 50, lastMove: null },
          // Keep GHOST's card on screen (dead, 0 HP) while ASGORE's sprite looms,
          // until the intro's reveal step clears this override to null.
          enemyCard: { name: 'GHOST', displayName: 'GHOST', hp: 0, maxHp: 100, type: 'GHOST', lastMove: null },
          asgore: { comboStep: 0 },
          runDestroyed: false,
          allowMusic: false, // theme held until the reveal step
          battleText: '',
          result: null,
          isResolving: true,
          sequence: [
            { text: `${enemyName} attacks.`, apply: (p) => ({ ...p }), sound: null },
            { text: '', apply: (p) => ({ ...p }), sound: 'Asgore Blade' },
            { text: '', apply: (p) => ({ ...p, runDestroyed: true }), sound: 'Delete' },
            { text: `${enemyName} destroyed the RUN button.`, apply: (p) => ({ ...p }), sound: null },
            { text: `${enemyName} stands in your way!`, apply: (p) => ({ ...p, enemyCard: null, allowMusic: true }), sound: null },
          ],
          sequenceIndex: 0,
          unlockSections: [],
        })
      } else {
        // Normal ASGORE start (e.g. retry): full fight, RUN available, theme plays.
        setBattleState({
          mode: 'asgore',
          player: { name: playerName, displayName: playerName, gender: playerGender, hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
          enemy: { name: 'ASGORE', displayName: 'ASGORE', hp: 100, maxHp: 100, type: 'Monster', speed: 50, lastMove: null },
          asgore: { comboStep: 0 },
          runDestroyed: false,
          battleText: '',
          result: null,
          isResolving: false,
          sequence: [],
          sequenceIndex: 0,
          unlockSections: [],
        })
      }
    } else {
      // No battle is configured for this boss yet. Fail safe instead of crashing.
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
  // (see game/battle*.js); this only wires it in.
  function handleBattleMove(move) {
    if (!battleState || battleState.result || battleState.isResolving) return
    let steps
    if (battleState.mode === 'ghost') {
      // GHOST handles TALK / JOKE / attack / trick-room all in one builder.
      steps = buildGhostSteps(battleState, move)
    } else if (move.id === 'talk' || move.id === 'joke') {
      // TALK / JOKE in every other fight (opponent is unresponsive, then acts).
      steps = buildTalkSteps(battleState, move)
    } else if (battleState.mode === 'hollow') {
      steps = buildHollowSteps(battleState, move)
    } else if (battleState.mode === 'school') {
      steps = buildSchoolSteps(battleState, move)
    } else {
      steps = buildAsgoreSteps(battleState, move)
    }
    setBattleState((prev) => ({ ...prev, isResolving: true, sequence: steps, sequenceIndex: 0, battleText: '', result: null }))
    setBattleMenuView('main')
  }

  // Uses the CALL REINFORCEMENTS bag item. This "move" always goes first.
  // For TWO / DR. ZANGETSU the CREATOR one-shots the opponent (standard victory).
  // For GHOST (when hurt) the CREATOR heals him and he flees, exiting the battle.
  // For a full-HP GHOST or for ASGORE the CREATOR deliberately ignores you.
  // One use is spent per activation (the count persists across battles via
  // reinforcementUses).
  function handleUseItem() {
    if (!battleState || battleState.result || battleState.isResolving) return
    if (reinforcementUses <= 0) return
    const playerName = battleState.player.name
    const enemyName = battleState.enemy.name
    let steps

    if (battleState.mode === 'ghost' || battleState.mode === 'asgore') {
      const ghostHurt = battleState.mode === 'ghost' && battleState.enemy.hp < battleState.enemy.maxHp
      if (ghostHurt) {
        // Hurt GHOST: heal to full, then he runs away and the battle exits.
        steps = [
          { text: `${playerName} called for help.`, apply: (prev) => ({ ...prev }), sound: null },
          { text: 'The CREATOR noticed your presence.', apply: (prev) => ({ ...prev }), sound: null },
          { text: 'The CREATOR healed GHOST.', apply: (prev) => ({ ...prev }), sound: null },
          { text: '', apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: prev.enemy.maxHp }, lastHit: { side: 'enemy', effectiveness: 1 } }), sound: 'In-Battle Heal HP Restore' },
          { text: 'GHOST was healed back to full HP.', apply: (prev) => ({ ...prev }), sound: null },
          { text: 'GHOST ran away.', apply: (prev) => ({ ...prev, ghost: { ...prev.ghost, dialogue: 'GHOST ran away.' } }), sound: null },
          { text: '', apply: (prev) => ({ ...prev, exitBattle: true }), sound: 'Run' },
        ]
      } else {
        // Full-HP GHOST or ASGORE: the CREATOR ignores the call for help.
        steps = [
          { text: `${playerName} called for help.`, apply: (prev) => ({ ...prev }), sound: null },
          { text: 'The CREATOR noticed your presence.', apply: (prev) => ({ ...prev }), sound: null },
          { text: 'The CREATOR is deliberately ignoring you.', apply: (prev) => ({ ...prev }), sound: null },
        ]
      }
    } else {
      // Victory here mirrors the boss's normal win: unlock the same section(s)
      // per mode (see SECTION_STARS). Keeping one source of truth means the cheat
      // path can never drift from the real unlock mapping.
      const unlockSections = SECTION_STARS[battleState.mode] || []
      steps = [
        { text: `${playerName} called for help.`, apply: (prev) => ({ ...prev }), sound: null },
        { text: 'The CREATOR noticed your presence.', apply: (prev) => ({ ...prev }), sound: null },
        { text: 'The CREATOR snapped his fingers!', apply: (prev) => ({ ...prev }), sound: null },
        { text: '', apply: (prev) => ({ ...prev }), sound: 'Finger Snap' },
        { text: '', apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: Math.max(0, prev.enemy.hp - 999) }, lastHit: { side: 'enemy', effectiveness: 2 } }), sound: 'Hit Super Effective' },
        { text: `${enemyName} was one-shotted!`, apply: (prev) => ({ ...prev }), sound: null },
        { text: 'The CREATOR is disappointed in you.', apply: (prev) => ({ ...prev }), sound: null },
        { text: '', apply: (prev) => ({ ...prev }), sound: 'Disappointed' },
        { text: `The CREATOR defeated ${enemyName} for you!`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: 0 }, result: 'victory', unlockSections }), sound: 'You Win' },
      ]
    }
    setReinforcementUses((n) => Math.max(0, n - 1))
    // Flag this as a cheat win so it earns no boss-defeat star.
    setBattleState((prev) => ({ ...prev, isResolving: true, sequence: steps, sequenceIndex: 0, battleText: '', result: null, usedReinforcements: true }))
    setBattleMenuView('main')
  }

  function handleRun() {
    // Once ASGORE destroys the RUN button it can no longer be used (and the
    // ESC shortcut that mirrors it is blocked too).
    if (battleState?.runDestroyed) return
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

  // Browse-bypass: reveal every unlockable section at once for visitors who just
  // want to read the portfolio without fighting. Persists via the effect above.
  function unlockAll() {
    setUnlockedSections((value) => Array.from(new Set([...value, ...UNLOCKABLE_SECTIONS])))
  }

  // "Normal Mode" — undo the bulk unlock but KEEP fairly-earned progress.
  // Restores only the sections unlocked through legit battle, so a visitor who
  // battled their way in doesn't lose that when leaving the convenience view.
  function normalMode() {
    setUnlockedSections(earnedStars)
  }

  // Restarts the just-finished battle. The character is already named, so we go
  // straight back into the battle (skipping the Boss Select cue) and re-arm the
  // battle music immediately. Losing to ASGORE means GHOST was killed, so we
  // restart the GHOST fight (a fresh chance to befriend him) rather than the
  // unbeatable ASGORE.
  function retryBattle() {
    const mode = battleState?.mode
    const bossId = mode === 'school' ? 'school' : mode === 'ghost' ? 'ghost' : mode === 'asgore' ? 'ghost' : 'hollow'
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
    earnedStars,
    battleMusicReady,
    bossCuePlaying,
    flinch,
    damageEvent,
    screenShake,
    displayedBattleText,
    startBattle,
    playBossSelectCue,
    handleBattleMove,
    handleUseItem,
    handleRun,
    retryBattle,
    goToBossSelect,
    goToMenu,
    unlockAll,
    normalMode,
  }
}

import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const menuOptionsBase = [
  { id: 'battle', label: 'BATTLE', unlockText: null },
  { id: 'about', label: 'ABOUT ME', unlockText: 'Defeat "PAOLO JANSEN ENRERA" to unlock ABOUT ME.' },
  { id: 'professional', label: 'PROFESSIONAL EXPERIENCE', unlockText: 'This section is still being prepared.' },
  { id: 'education', label: 'EDUCATION', unlockText: 'Defeat "DR. SKOO L. CEESTIM" to unlock EDUCATION.' },
  { id: 'contact', label: 'CONTACT', unlockText: null },
]

const bossOptions = [
  { id: 'hollow', label: 'PAOLO JANSEN ENRERA', locked: false },
  { id: 'keeper', label: 'KEEPER OF PROJECTS', locked: true },
  { id: 'school', label: 'DR. SKOO L. CEESTIM', locked: false },
]

const menuPlaylist = [
  { file: 'Pokemon Black and White OST - Driftveil City.mp3' },
  { file: 'Pokemon HGSS Music - Violet and Olivine Cities.mp3' },
  { file: 'Pokemon RubySapphireEmerald- Littleroot Town.mp3' },
  { file: 'Pokemon DP Music - Canalave City.mp3' },
]

// Battle themes keyed by boss `mode`. The filenames match the real track
// titles (with spaces). `audioUrl` runs every name through encodeURIComponent,
// so spaces are safely encoded in the request URL and the file still serves
// correctly from a static host.
const battleThemes = {
  hollow: 'Pokemon Sun and Moon - Rival Gladion Battle Music.mp3', // "PAOLO JANSEN ENRERA" -> Pokémon Sun & Moon - Rival Gladion
  school: 'Pokemon Black and White - N Final Battle Music.mp3',    // Dr. Skoo -> Pokémon Black & White - N Final Battle
}

const aboutText = [
  'Results-driven Computer Engineering graduate with hands-on Salesforce Agentforce development experience from a 540-hour Accenture internship, where I streamlined enterprise case management, optimized workflow automation, and strengthened knowledge base management to improve customer service operations.',
  'Skilled in configuring agent actions, Flow logic, and Agent Instructions to deliver scalable, reliable AI-driven support systems.',
  'During my internship, I contributed to the Agentforce Contact Center and Knowledge Center, engineering advanced case lifecycle actions, automating account workflows, and analyzing knowledge article trends to guide content improvements. These contributions enhanced efficiency and reliability in enterprise support environments.',
  'Beyond Salesforce, I bring exposure to AI/ML workflows, embedded systems, and full-stack development, with a proven ability to redesign inefficient logic and resolve systemic bottlenecks. Known for a fast learning curve and problem-solving mindset, I aim to drive measurable improvements in automation, enterprise AI agent deployments, and intelligent customer experience solutions.',
]

const educationText = [
  'University: University of San Carlos',
  'Degree: Bachelor of Science in Computer Engineering',
  'Course Dates: 2021 - Jul 2026',
]

function audioUrl(fileName) {
  return `/audio/${encodeURIComponent(fileName)}`
}

// Short flavor text shown in a tooltip when the player hovers a move button.
// Keyed by the move's `id` so only the listed moves get a tooltip.
const MOVE_DESCRIPTIONS = {
  'ember': 'Deals minor fire damage',
  'water-gun': 'Deal minor water damage',
  'vine-whip': 'Deals minor grass damage',
  'trick-room': 'Reverses the speed order',
}

// Sound effects (hover, select, in-battle hits, etc.) now share the global
// mute/volume controls with the background music (see `playSoundEffect` and the
// background-music effect). The single button + slider govern ALL audio.


function getKnowledgeStatus(stage) {
  if (stage >= 3) return 'Knowledge: Graduating'
  if (stage === 2) return 'Knowledge: Knowledgable'
  if (stage === 1) return 'Knowledge: Learned'
  if (stage === 0) return 'Knowledge: Neutral'
  if (stage === -1) return 'Knowledge: Dunce'
  return 'Knowledge: Beyond Saving'
}

function getKnowledgeMultiplier(stage) {
  if (stage >= 3) return 0.125
  if (stage === 2) return 0.25
  if (stage === 1) return 0.5
  if (stage === 0) return 1
  if (stage === -1) return 1.5
  return 2
}

function normalizeType(type) {
  if (type === 'Unknown' || type === 'Student') return 'Normal'
  return type
}

function getEffectiveness(moveType, defenderType) {
  const normalizedMove = normalizeType(moveType)
  const normalizedDefender = normalizeType(defenderType)
  // Same type as the (currently) defending monster resists itself.
  if ((normalizedMove === 'Fire' && normalizedDefender === 'Fire') || (normalizedMove === 'Water' && normalizedDefender === 'Water') || (normalizedMove === 'Grass' && normalizedDefender === 'Grass')) return 0.5
  if ((normalizedMove === 'Fire' && normalizedDefender === 'Grass') || (normalizedMove === 'Water' && normalizedDefender === 'Fire') || (normalizedMove === 'Grass' && normalizedDefender === 'Water')) return 2
  if ((normalizedMove === 'Fire' && normalizedDefender === 'Water') || (normalizedMove === 'Water' && normalizedDefender === 'Grass') || (normalizedMove === 'Grass' && normalizedDefender === 'Fire')) return 0.5
  return 1
}

function getEffectivenessText(effectiveness) {
  if (effectiveness === 2) return 'super effective'
  if (effectiveness === 0.5) return 'not very effective'
  return 'neutral'
}

// Maps a Pokémon type to an accent color used to tint the opponent's UI box so
// it visually matches the enemy's current type (e.g. Fire -> red).
function getTypeColor(type) {
  const TYPE_COLORS = {
    Fire: '#ef4444',
    Water: '#3b82f6',
    Grass: '#22c55e',
    Psychic: '#a855f7',
    Normal: '#7dd3fc',
    Unknown: '#7dd3fc',
    Student: '#7dd3fc',
  }
  return TYPE_COLORS[type] || '#7dd3fc'
}

function App() {
  const [screen, setScreen] = useState('start')
  const [menuIndex, setMenuIndex] = useState(0)
  const [bossIndex, setBossIndex] = useState(0)
  const [battleState, setBattleState] = useState(null)
  const [battleMenuView, setBattleMenuView] = useState('main')
  // Post-battle follow-up screen: null (none), 'tryAgain' (loss), or
  // 'unlocked' (victory that unlocked a new section).
  const [resultScreen, setResultScreen] = useState(null)
  const [contentView, setContentView] = useState(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  // Gates the battle theme: it must wait until the "Boss Select" cue finishes
  // before it starts. Reset to false whenever a battle begins.
  const [battleMusicReady, setBattleMusicReady] = useState(false)
  // True while the "Boss Select" cue is actually playing. While it is true the
  // background music (menu or battle) is silenced, so it never overlaps the cue
  // and cannot resume until the cue's 'ended' event clears this flag.
  const [bossCuePlaying, setBossCuePlaying] = useState(false)
  const [menuTrackIndex, setMenuTrackIndex] = useState(0)
  const [unlockedSections, setUnlockedSections] = useState(['contact'])
  const bgMusicRef = useRef(null)
  // Tracks which music track is currently loaded so we only swap the audio
  // source when it actually changes (NOT on every state update).
  const loadedTrackRef = useRef(null)
  // Character name the player types in before their first battle. Stored only in
  // component state (never persisted), so a page refresh forgets it and re-prompts.
  const [characterName, setCharacterName] = useState('')
  const [pendingBossId, setPendingBossId] = useState(null)
  const [nameInput, setNameInput] = useState('')

  // For typewriter effect
  const [displayedBattleText, setDisplayedBattleText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typewriterRef = useRef(null)

  const menuOptions = useMemo(() => menuOptionsBase.map((option) => {
    if (option.id === 'battle' || option.id === 'contact') return { ...option, unlocked: true }
    if (option.id === 'about') return { ...option, unlocked: unlockedSections.includes('about') }
    if (option.id === 'education') return { ...option, unlocked: unlockedSections.includes('education') }
    return { ...option, unlocked: false }
  }), [unlockedSections])

  const currentMenuOption = useMemo(() => menuOptions[menuIndex] ?? menuOptions[0], [menuIndex, menuOptions])

  // Per-sound volume multipliers. 1 = follow the global slider unchanged,
  // <1 = quieter, >1 = louder. 'hover-button' and 'select-button' stay at full
  // volume (1) because their source files are recorded too soft on their own.
  // Every other sound defaults to 0.5 (50%) EXCEPT the move attack + impact
  // effects, which are capped at 0.6 so the master slider maps to 0%–60% for
  // them — they never play louder than 60% of the original level.
  const soundVolumes = {
    'hover-button': 1,
    'select-button': 1,
    // Move sound effects (max 60% of the original volume):
    'Ember': 0.6,
    'Water Gun': 0.6,
    'Vine Whip': 0.6,
    'Trick Room': 0.6,
    'Flamethrower': 0.6,
    'Hydro Pump': 0.6,
    'Leaf Storm': 0.6,
    'Hit Super Effective': 0.3,
    'Hit Weak Not Very Effective': 0.6,
    'Hit Normal Damage': 0.6,
  }

  function playSoundEffect(soundName) {
    const safeName = soundName.endsWith('.mp3') ? soundName : `${soundName}.mp3`
    const audio = new Audio(audioUrl(safeName))
    // Sound effects honor the global mute/volume controls so the single
    // button + slider governs every sound (not just the background music).
    // Each sound is additionally scaled by its own multiplier — move attack +
    // impact sounds are capped at 0.6 (listed in `soundVolumes`), while all
    // other sounds default to 0.5 (50% of max slider power) so the louder
    // effect files are brought in line with the softer ones.
    const mult = soundVolumes[soundName] ?? 0.5
    audio.volume = muted ? 0 : Math.min(1, volume * mult)
    audio.play().catch(() => undefined)
    return audio
  }

  function handleButtonHover() {
    playSoundEffect('hover-button')
  }

  function handleButtonSelect() {
    playSoundEffect('select-button')
  }

  function handleNextSong() {
    handleButtonSelect()
    setMenuTrackIndex((value) => (value + 1) % menuPlaylist.length)
  }

  // Builds and starts a battle against the given boss, addressing the player by
  // the character name they entered.
  function startBattle(bossId, playerNameArg) {
    // Re-arm the battle music gate — the theme must wait for the Boss Select cue
    // to finish before it starts (it is un-gated in the Boss Select 'ended' handler).
    setBattleMusicReady(false)
    // Prefer an explicitly passed name (set synchronously in submitCharacterName)
    // so the first battle after naming shows the name immediately. Fall back to
    // the component state for battles started later via handleBossSelected.
    const playerName = playerNameArg ?? characterName
    if (bossId === 'hollow') {
      setBattleState({
        mode: 'hollow',
        player: { name: playerName, displayName: playerName, hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
        enemy: { name: 'PAOLO', displayName: 'PAOLO JANSEN ENRERA', hp: 100, maxHp: 100, type: 'Normal', speed: 150, lastMove: null },
        battleText: 'PAOLO JANSEN ENRERA stands in your way!',
        result: null,
        isResolving: false,
        sequence: [],
        sequenceIndex: 0,
        enemyTurnIndex: 0,
        unlockSection: null,
      })
    } else if (bossId === 'school') {
      setBattleState({
        mode: 'school',
        player: { name: playerName, displayName: playerName, hp: 100, maxHp: 100, type: 'Normal', speed: 120, knowledgeStage: 0, knowledgeStatus: 'Knowledge: Neutral', dodgeTurn: false },
        enemy: { name: 'DR. SKOO L. CEESTIM', displayName: 'DR. SKOO L. CEESTIM', hp: 100, maxHp: 100, type: 'Unknown', speed: 60 },
        battleText: 'The battle begins!',
        semesterTurnsLeft: 3,
        enemyTurnIndex: 0,
        result: null,
        isResolving: true,
        sequence: [
          { text: 'DR. SKOO L. CEESTIM\'s ability BACK 2 SCHOOL has been activated.', apply: (prev) => ({ ...prev }), sound: 'In-Battle Ability Activate' },
          { text: `${playerName}'s type changed into Student.`, apply: (prev) => ({ ...prev, player: { ...prev.player, type: 'Student' } }), sound: 'In-Battle Ability Activate' },
          { text: `${playerName}'s defense stat has been changed into knowledge stat. You have become a part of the school semester.`, apply: (prev) => ({ ...prev }), sound: null },
          { text: 'Turns until the semester ends: 3', apply: (prev) => ({ ...prev, semesterTurnsLeft: 3 }), sound: null },
        ],
        sequenceIndex: 0,
        unlockSection: null,
      })
    }
    setBattleMenuView('main')
    setScreen('battle')
  }

  // Plays the "Boss Select" cue and silences the background music for its full
  // duration. The cue runs on its own Audio element; while it plays the music
  // effect pauses all background music (see the `bossCuePlaying` guard). On the
  // cue's 'ended' event we clear the cue flag and un-gate the battle theme.
  function playBossSelectCue() {
    setBossCuePlaying(true)
    const bossSelect = playSoundEffect('Boss Select')
    bossSelect.addEventListener('ended', () => {
      setBossCuePlaying(false)
      setBattleMusicReady(true)
    })
    return bossSelect
  }

  // Called when a boss is chosen. If the player hasn't named their character yet,
  // route to the name-entry screen first; otherwise start the battle immediately.
  function handleBossSelected(bossId) {
    if (!characterName) {
      // No name yet: play only the select cue, then route to name entry.
      // The Boss Select cue is held back until after the character is named.
      playSoundEffect('select-button')
      setPendingBossId(bossId)
      setNameInput('')
      setScreen('nameEntry')
      return
    }
    // Named already: play only the Boss Select cue (which silences the menu
    // music), then start the battle. The battle theme waits for the cue to end.
    playBossSelectCue()
    startBattle(bossId)
  }

  function submitCharacterName() {
    const name = nameInput.trim().toUpperCase()
    if (!name) return
    const bossId = pendingBossId
    setCharacterName(name)
    setPendingBossId(null)
    setNameInput('')
    if (bossId) {
      // Name just set: play the Boss Select cue (silencing background music),
      // then begin — the battle theme waits for this cue to finish.
      playBossSelectCue()
      startBattle(bossId, name)
    }
  }

  // Typewriter effect for battle text
  useEffect(() => {
    if (!battleState || !battleState.battleText) {
      setDisplayedBattleText('')
      setIsTyping(false)
      return
    }

    const textToDisplay = battleState.battleText
    setDisplayedBattleText('')
    setIsTyping(true)

    let charIndex = 0
    const typingSpeed = 30 // milliseconds per character

    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current)
    }

    function typeNextChar() {
      // Explicitly guard against an out-of-bounds / undefined character so we
      // can never append the literal string "undefined" to the display.
      const ch = textToDisplay[charIndex]
      if (ch === undefined) {
        setIsTyping(false)
        return
      }
      setDisplayedBattleText((prev) => prev + ch)
      charIndex += 1
      if (charIndex < textToDisplay.length) {
        typewriterRef.current = setTimeout(typeNextChar, typingSpeed)
      } else {
        setIsTyping(false)
      }
    }

    typewriterRef.current = setTimeout(typeNextChar, typingSpeed)

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current)
      }
    }
  }, [battleState?.battleText])

  function handleButtonHover() {
    playSoundEffect('hover-button')
  }

  function handleButtonSelect() {
    playSoundEffect('select-button')
  }

  function handleNextSong() {
    handleButtonSelect()
    setMenuTrackIndex((value) => (value + 1) % menuPlaylist.length)
  }

  // Starts the game from the title screen. Wired to both "click anywhere" and
  // "any key" so the PRESS ANY BUTTON TO START prompt is literally true.
  function startFromStartScreen() {
    handleButtonSelect()
    setScreen('menu')
  }

  useEffect(() => {
    const audio = bgMusicRef.current
    if (!audio) return undefined

    // While the "Boss Select" cue is playing, silence ALL background music
    // (menu or battle) and keep it paused until the cue's 'ended' event clears
    // `bossCuePlaying`. This prevents the menu track from overlapping the cue
    // and blocks any background music from resuming mid-cue.
    if (bossCuePlaying) {
      audio.pause()
      return undefined
    }

    // Stop music the moment the battle is won or lost (result overlay is up).
    if (battleState?.result) {
      audio.pause()
      loadedTrackRef.current = null
      return undefined
    }

    const inBattle = screen === 'battle' && !!battleState
    // Don't start the battle theme until the "Boss Select" cue has finished
    // playing — the menu music keeps running through the cue, then swaps in.
    if (inBattle && !battleMusicReady) return undefined
    // A stable identity for the track we want, e.g. "menu:0" or "battle:hollow".
    // We compare THIS (not the raw URL) so we don't reload on every state update.
    const trackKey = inBattle
      ? `battle:${battleState.mode}`
      : `menu:${menuTrackIndex}`
    const desiredSrc = inBattle
      ? audioUrl(battleThemes[battleState.mode])
      : audioUrl(menuPlaylist[menuTrackIndex].file)

    const playIfNeeded = () => {
      const playAttempt = audio.play()
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => undefined)
      }
    }

    if (loadedTrackRef.current !== trackKey) {
      // Track changed: swap the source once and start it.
      loadedTrackRef.current = trackKey
      audio.src = desiredSrc
      audio.loop = true // both menu and battle themes loop
      if (!inBattle) {
        audio.onended = () => {
          setMenuTrackIndex((value) => (value + 1) % menuPlaylist.length)
        }
      } else {
        audio.onended = null
      }
      playIfNeeded()
    } else {
      // Same track already loaded: keep it playing, never restart it.
      // Resume only if it somehow got paused (e.g. first interaction).
      if (audio.paused) playIfNeeded()
    }
    // Background music is capped at 15% of the slider so it never blasts at full
    // power — too loud otherwise. The slider now maps to 0%–15% music volume.
    audio.volume = muted ? 0 : volume * 0.15
  }, [screen, battleState, battleState?.mode, battleState?.result, menuTrackIndex, muted, volume, battleMusicReady, bossCuePlaying])

  useEffect(() => {
    if (screen !== 'start') return undefined
    const handleKeyDown = (event) => {
      // Prevent space/enter from scrolling; start on any key press.
      if (event.key === ' ' || event.key === 'Enter') event.preventDefault()
      startFromStartScreen()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen])

  useEffect(() => {
    if (screen !== 'menu') return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setMenuIndex((value) => (value + 1) % menuOptions.length)
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setMenuIndex((value) => (value - 1 + menuOptions.length) % menuOptions.length)
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        const option = menuOptions[menuIndex]
        if (!option.unlocked) return
        if (option.id === 'battle') {
          setScreen('bossSelect')
          setContentView(null)
          setBattleMenuView('main')
        }
        if (option.id === 'about') {
          setScreen('content')
          setContentView('about')
        }
        if (option.id === 'education') {
          setScreen('content')
          setContentView('education')
        }
        if (option.id === 'contact') {
          setScreen('content')
          setContentView('contact')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, menuIndex, menuOptions])

  useEffect(() => {
    if (screen !== 'bossSelect') return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setBossIndex((value) => (value + 1) % bossOptions.length)
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setBossIndex((value) => (value - 1 + bossOptions.length) % bossOptions.length)
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        const boss = bossOptions[bossIndex]
        if (boss.locked) return
        handleBossSelected(boss.id)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, bossIndex])

  useEffect(() => {
    if (!battleState?.isResolving || !battleState.sequence?.length) return undefined
    const stepIndex = battleState.sequenceIndex ?? 0
    if (stepIndex >= battleState.sequence.length) {
      setBattleState((prev) => (prev ? { ...prev, isResolving: false } : prev))
      setBattleMenuView('main')
      return undefined
    }

    // Wait for typing to complete before advancing to next step
    if (isTyping) {
      // If still typing, check again soon
      const timer = window.setTimeout(() => {
        // This will trigger the effect again when isTyping changes
      }, 100)
      return () => window.clearTimeout(timer)
    }

    // Not typing anymore, proceed with the step after a brief pause to let user read
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

  // Global ESC handling:
  //  - In battle: treated exactly like pressing RUN (plays Run.mp3).
  //  - In other screens: go back to the previous menu and play esc.mp3.
  //    (bossSelect/content -> menu, nameEntry -> bossSelect)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      if (screen === 'battle' && battleState) {
        if (battleState.isResolving) return
        handleRun() // also plays Run.mp3
        return
      }
      if (screen === 'bossSelect') {
        playSoundEffect('esc')
        setScreen('menu')
        return
      }
      if (screen === 'content') {
        playSoundEffect('esc')
        setScreen('menu')
        setContentView(null)
        return
      }
      if (screen === 'nameEntry') {
        playSoundEffect('esc')
        setScreen('bossSelect')
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, battleState, contentView])

  function handleBattleMove(move) {
    if (!battleState || battleState.result || battleState.isResolving) return

    // Don't play sound effect immediately - it will be played in the sequence

    if (battleState.mode === 'hollow') {
      const steps = []
      const trickRoomActive = battleState.player.trickRoomTurnsLeft > 0
      const enemyName = battleState.enemy.name
      const playerType = battleState.player.type
      const enemyType = battleState.enemy.type
      let playerDamage = 0

      // Protean makes the enemy take on the type of the move it uses. The move
      // is chosen up front so both apply functions share it.
      const enemyMove = [
        { id: 'flamethrower', label: 'FLAMETHROWER', type: 'Fire' },
        { id: 'hydro-pump', label: 'HYDRO PUMP', type: 'Water' },
        { id: 'leaf-storm', label: 'LEAF STORM', type: 'Grass' },
      ].filter((option) => option.id !== battleState.enemy.lastMove)[0] || { id: 'flamethrower', label: 'FLAMETHROWER', type: 'Fire' }

      // The enemy's *current* type when the player's move lands. Protean changes
      // the enemy's type to its move's type as soon as the enemy acts, so when
      // the enemy goes first the player hits the post-Protean type. Under Trick
      // Room the player acts first and hits the enemy's original type.
      const enemyTypeWhenPlayerAttacks = trickRoomActive ? enemyType : enemyMove.type

      const applyEnemyMove = () => {
        const effectiveness = getEffectiveness(enemyMove.type, playerType)
        const damage = effectiveness === 2 ? Math.floor(battleState.player.maxHp * 0.25) : effectiveness === 0.5 ? Math.floor(battleState.player.maxHp * 0.125) : Math.floor(battleState.player.maxHp * 0.25)
        steps.push({ text: `${enemyName}'s ability PROTEAN was activated.`, apply: (prev) => ({ ...prev }), sound: 'In-Battle Ability Activate' })
        // Step 1: right after Protean, the enemy transforms into the move's type.
        // The type change is applied here so the opponent card recolors at this step.
        steps.push({ text: `${enemyName} transformed into a ${enemyMove.type} type.`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, type: enemyMove.type, lastMove: enemyMove.id } }), sound: null })
        // Step 2: enemy then announces the move it used (no damage yet)
        steps.push({ text: `${enemyName} used ${enemyMove.label}.`, apply: (prev) => ({ ...prev }), sound: enemyMove.id === 'hydro-pump' ? 'Hydro Pump' : enemyMove.id === 'flamethrower' ? 'Flamethrower' : 'Leaf Storm' })
        // Step 2: blank text + player HP drops + hit sound simultaneously
        const enemyHitSound = effectiveness === 2 ? 'Hit Super Effective' : effectiveness === 0.5 ? 'Hit Weak Not Very Effective' : 'Hit Normal Damage'
        steps.push({ text: '', apply: (prev) => ({ ...prev, player: { ...prev.player, hp: Math.max(0, prev.player.hp - damage) } }), sound: enemyHitSound })
        // Step 3 (only if not neutral): effectiveness text, no sound (damage already done)
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
        playerDamage = effectiveness === 2 ? Math.floor(battleState.enemy.maxHp * 0.34) : effectiveness === 0.5 ? Math.floor(battleState.enemy.maxHp * 0.085) : Math.floor(battleState.enemy.maxHp * 0.17)
        const playerHitSound = effectiveness === 2 ? 'Hit Super Effective' : effectiveness === 0.5 ? 'Hit Weak Not Very Effective' : 'Hit Normal Damage'
        // Step 1: announce the move (no damage yet)
        steps.push({ text: `${battleState.player.name} used ${move.label}.`, apply: (prev) => ({ ...prev }), sound: move.id === 'ember' ? 'Ember' : move.id === 'water-gun' ? 'Water Gun' : move.id === 'vine-whip' ? 'Vine Whip' : null })
        // Step 2: blank text + opponent HP drops + hit sound simultaneously
        steps.push({ text: '', apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: Math.max(0, prev.enemy.hp - playerDamage) } }), sound: playerHitSound })
        // Step 3 (only if not neutral): effectiveness text, no sound (damage already done)
        if (effectiveness !== 1) {
          steps.push({ text: `It was ${getEffectivenessText(effectiveness)}${effectiveness === 2 ? '!' : '.'}`, apply: (prev) => ({ ...prev }), sound: null })
        }
        if (battleState.enemy.hp - playerDamage <= 0) steps.push({ text: `You defeated PAOLO JANSEN ENRERA.`, apply: (prev) => ({ ...prev, result: 'victory', unlockSection: 'about' }), sound: 'You Win' })
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
      setBattleState((prev) => ({ ...prev, isResolving: true, sequence: steps, sequenceIndex: 0, battleText: '', result: null }))
      setBattleMenuView('main')
      return
    }

    const steps = []
    const turnNumber = battleState.enemyTurnIndex ?? 0
    const enemyMove = turnNumber === 0 ? 'Midterm Exam' : turnNumber === 1 ? 'Pre-Final Exam' : 'Final Examination'
    let nextKnowledgeStage = battleState.player.knowledgeStage
    let nextKnowledgeStatus = battleState.player.knowledgeStatus
    let dodgeThisTurn = false
    let damageToPlayer = 0

    if (move.id === 'study') {
      nextKnowledgeStage = Math.min(3, battleState.player.knowledgeStage + 1)
      nextKnowledgeStatus = getKnowledgeStatus(nextKnowledgeStage)
      steps.push({ text: `${battleState.player.name} used STUDY.`, apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: 'Study' })
      steps.push({ text: `Knowledge advanced to ${nextKnowledgeStatus}.`, apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: 'Stat Increase' })
    } else if (move.id === 'throw-book') {
      nextKnowledgeStage = Math.max(-2, battleState.player.knowledgeStage - 1)
      nextKnowledgeStatus = getKnowledgeStatus(nextKnowledgeStage)
      steps.push({ text: `${battleState.player.name} used THROW A BOOK.`, apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: null })
      steps.push({ text: `Knowledge decreased to ${nextKnowledgeStatus}.`, apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: 'Stat Decrease' })
      steps.push({ text: 'This opponent is a concept and thus, is immune to any physical attacks.', apply: (prev) => ({ ...prev }), sound: null })
    } else if (move.id === 'skip-class') {
      dodgeThisTurn = true
      steps.push({ text: `${battleState.player.name} used SKIP CLASS.`, apply: (prev) => ({ ...prev, player: { ...prev.player, dodgeTurn: true } }), sound: 'Skip Class' })
      steps.push({ text: 'The next attack will be dodged.', apply: (prev) => ({ ...prev, player: { ...prev.player, dodgeTurn: true } }), sound: null })
    } else if (move.id === 'rest') {
      steps.push({ text: `${battleState.player.name} used REST.`, apply: (prev) => ({ ...prev, player: { ...prev.player, hp: prev.player.maxHp } }), sound: 'Rest' })
      steps.push({ text: `${battleState.player.name} recovered to full HP.`, apply: (prev) => ({ ...prev, player: { ...prev.player, hp: prev.player.maxHp } }), sound: 'In-Battle Heal HP Restore' })
    }

    const baseRatio = enemyMove === 'Midterm Exam' ? 0.2 : enemyMove === 'Pre-Final Exam' ? 0.8 : 5.5
    const multiplier = getKnowledgeMultiplier(nextKnowledgeStage)
    const damage = dodgeThisTurn ? 0 : Math.floor(battleState.player.maxHp * baseRatio * multiplier)
    damageToPlayer = damage
    // Step 1: enemy announces its move (no damage yet)
    steps.push({ text: `${battleState.enemy.name} used ${enemyMove}.`, apply: (prev) => ({ ...prev }), sound: enemyMove === 'Midterm Exam' ? 'Midterm Exam' : enemyMove === 'Pre-Final Exam' ? 'Pre-Final Exam' : 'Final Examination' })
    if (dodgeThisTurn) {
      steps.push({ text: 'The incoming attack was dodged.', apply: (prev) => ({ ...prev, player: { ...prev.player, dodgeTurn: false } }), sound: null })
    } else {
      // Step 2: blank text + player HP drops + hit sound simultaneously
      steps.push({ text: '', apply: (prev) => ({ ...prev, player: { ...prev.player, hp: Math.max(0, prev.player.hp - damage) } }), sound: 'Hit Normal Damage' })
    }

    const newSemesterTurns = Math.max(0, battleState.semesterTurnsLeft - 1)
    if (newSemesterTurns <= 0) {
      if (nextKnowledgeStatus === 'Knowledge: Graduating') {
        steps.push({ text: `${battleState.player.name} has graduated with flying colors!`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: 0 }, result: 'victory', unlockSection: 'education' }), sound: 'You Win' })
      } else {
        steps.push({ text: 'Another semester has started.', apply: (prev) => ({ ...prev, semesterTurnsLeft: 3 }), sound: null })
      }
    } else {
      steps.push({ text: `Turns until the semester ends: ${newSemesterTurns}`, apply: (prev) => ({ ...prev, semesterTurnsLeft: newSemesterTurns }), sound: null })
    }
    if (battleState.player.hp - damageToPlayer <= 0) steps.push({ text: 'You lost the battle.', apply: (prev) => ({ ...prev, result: 'loss' }), sound: 'You Lost' })
    setBattleState((prev) => ({ ...prev, isResolving: true, sequence: steps, sequenceIndex: 0, battleText: '', result: null, enemyTurnIndex: (prev?.enemyTurnIndex ?? 0) + 1 }))
    setBattleMenuView('main')
  }

  function handleUseMasterBall() {
    if (!battleState || battleState.result || battleState.isResolving) return
    handleButtonSelect()
    setBattleState((state) => {
      if (!state) return state
      if (state.mode === 'hollow') {
        const nextPlayer = { ...state.player }
        const nextEnemy = { ...state.enemy }
        const bossMove = [
          { id: 'flamethrower', label: 'FLAMETHROWER', type: 'Fire' },
          { id: 'hydro-pump', label: 'HYDRO PUMP', type: 'Water' },
          { id: 'leaf-storm', label: 'LEAF STORM', type: 'Grass' },
        ][Math.floor(Math.random() * 3)]
        nextEnemy.type = bossMove.type
        nextEnemy.lastMove = bossMove.id
        nextPlayer.hp = Math.max(0, nextPlayer.hp - Math.floor(nextPlayer.maxHp * 0.25))
        return { ...state, player: nextPlayer, enemy: nextEnemy, battleText: `The Master Ball was thrown, but it never worked. ${nextEnemy.name} countered with ${bossMove.label}.`, result: nextPlayer.hp <= 0 ? 'loss' : null }
      }
      const nextPlayer = { ...state.player }
      const enemyMove = state.enemyTurnIndex % 3 === 0 ? 'Midterm Exam' : state.enemyTurnIndex % 3 === 1 ? 'Pre-Final Exam' : 'Final Examination'
      const damage = Math.floor(nextPlayer.maxHp * (enemyMove === 'Midterm Exam' ? 0.2 : enemyMove === 'Pre-Final Exam' ? 0.8 : 5.5) * getKnowledgeMultiplier(nextPlayer.knowledgeStage))
      nextPlayer.hp = Math.max(0, nextPlayer.hp - damage)
      return { ...state, player: nextPlayer, battleText: `The Master Ball was thrown, but it never worked. ${state.enemy.name} used ${enemyMove} and dealt ${damage} damage.`, result: nextPlayer.hp <= 0 ? 'loss' : null }
    })
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
    startBattle(bossId, characterName)
    setBattleMusicReady(true)
  }

  function unlockedSectionLabel(section) {
    if (section === 'about') return "ABOUT ME"
    if (section === 'education') return 'EDUCATION'
    return String(section).toUpperCase()
  }

  // Derive the track that is currently loaded so we can show its name. This
  // mirrors the music effect's track selection: a battle uses the boss's battle
  // theme, otherwise we use the menu playlist track at the current index.
  const nowPlayingFile = (screen === 'battle' && battleState)
    ? battleThemes[battleState.mode]
    : menuPlaylist[menuTrackIndex]?.file
  const nowPlayingName = nowPlayingFile ? nowPlayingFile.replace(/\.mp3$/i, '') : ''

  return (
    <main className="app-shell" onClick={screen === 'start' ? startFromStartScreen : undefined}>
      <audio ref={bgMusicRef} />
      {screen === 'start' && (
        <section className="screen start-screen">
          <p className="screen-label">TURN-BASED PORTFOLIO</p>
          <h1>PortfolioMon</h1>
          <div className="start-prompt-lines">
            <span className="start-line" />
            <p className="start-prompt">PRESS ANYWHERE TO START</p>
            <span className="start-line" />
          </div>
        </section>
      )}

      {screen === 'menu' && (
        <section className="screen menu-screen">
          <div className="menu-panel">
            <p className="screen-label">MAIN MENU</p>
            <h2>Choose an option</h2>
            <div className="menu-list">
              {menuOptions.map((option, index) => {
                const isActive = index === menuIndex
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`menu-option ${isActive ? 'active' : ''} ${option.unlocked ? '' : 'locked'}`}
                    onMouseEnter={() => { setMenuIndex(index); handleButtonHover() }}
                    onClick={() => {
                      handleButtonSelect()
                      if (!option.unlocked) return
                      if (option.id === 'battle') {
                        setScreen('bossSelect')
                        setContentView(null)
                      }
                      if (option.id === 'about') {
                        setScreen('content')
                        setContentView('about')
                      }
                      if (option.id === 'education') {
                        setScreen('content')
                        setContentView('education')
                      }
                      if (option.id === 'contact') {
                        setScreen('content')
                        setContentView('contact')
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    {!option.unlocked && <span className="lock-icon">🔒</span>}
                  </button>
                )
              })}
            </div>
          </div>
          <aside className="menu-hint">
            {currentMenuOption?.unlocked ? (
              <>
                <h3>{currentMenuOption.label}</h3>
                <p>{currentMenuOption.id === 'contact' ? 'Open your contact card and reach out.' : 'Select this option to continue.'}</p>
              </>
            ) : (
              <>
                <h3>LOCKED</h3>
                <p>{currentMenuOption?.unlockText}</p>
              </>
            )}
          </aside>
        </section>
      )}

      {screen === 'bossSelect' && (
        <section className="screen boss-select-screen">
          <p className="screen-label">BOSS SELECT</p>
          <h2>Choose your opponent</h2>
          <div className="boss-list">
            {bossOptions.map((boss, index) => {
              const isActive = index === bossIndex
              return (
                <button
                  key={boss.id}
                  type="button"
                  className={`boss-option ${isActive ? 'active' : ''} ${boss.locked ? 'locked' : ''}`}
                  onMouseEnter={() => { setBossIndex(index); handleButtonHover() }}
                  onClick={() => {
                    if (boss.locked) return
                    handleBossSelected(boss.id)
                  }}
                >
                  <span>{boss.label}</span>
                  {boss.locked && <span className="lock-icon">🔒</span>}
                </button>
              )
            })}
          </div>
          <button type="button" className="back-button" onClick={() => { playSoundEffect('esc'); setScreen('menu') }} onMouseEnter={handleButtonHover}>BACK TO MENU</button>
        </section>
      )}

      {screen === 'nameEntry' && (
        <section className="screen name-entry-screen">
          <p className="screen-label">NAME YOUR CHARACTER</p>
          <h2>Please tell us the name of your character.</h2>
          <form className="name-entry-form" onSubmit={(event) => { event.preventDefault(); submitCharacterName() }}>
            <input
              type="text"
              className="name-input"
              value={nameInput}
              autoFocus
              placeholder="Enter character name"
              onChange={(event) => setNameInput(event.target.value)}
              onMouseEnter={handleButtonHover}
            />
            <button type="submit" className="start-button" disabled={nameInput.trim() === ''} onMouseEnter={handleButtonHover}>START BATTLE</button>
          </form>
        </section>
      )}

      {screen === 'battle' && battleState && (
        <section className="screen battle-screen">
          <div className="battle-stage">
            <article className="monster-card type-tinted" style={{ '--type-color': getTypeColor(battleState.player.type) }}>
              <p className="monster-label">You</p>
              <h3>{battleState.player.displayName}</h3>
              <p className="type-pill">Type: {battleState.player.type}</p>
              <div className="monster-emoji">🧑‍💻</div>
              <div className="hp-bar"><div className="hp-fill player" style={{ width: `${(battleState.player.hp / battleState.player.maxHp) * 100}%` }} /></div>
              <p className="hp-text">HP {battleState.player.hp}/{battleState.player.maxHp}</p>
              {battleState.mode === 'school' && (
                <div className="school-status">
                  <p>Status: {battleState.player.knowledgeStatus}</p>
                  <p>Turns until semester ends: {battleState.semesterTurnsLeft}</p>
                </div>
              )}
            </article>
            <article className="monster-card opponent type-tinted" style={{ '--type-color': getTypeColor(battleState.enemy.type) }}>
              <p className="monster-label">OPPONENT</p>
              <h3>{battleState.enemy.displayName}</h3>
              <p className="type-pill">Type: {battleState.enemy.type}</p>
              <div className="monster-emoji">👹</div>
              <div className="hp-bar"><div className="hp-fill enemy" style={{ width: `${(battleState.enemy.hp / battleState.enemy.maxHp) * 100}%` }} /></div>
              <p className="hp-text">HP {battleState.enemy.hp}/{battleState.enemy.maxHp}</p>
            </article>
          </div>
          <div className="battle-log">
            {/* Typewriter effect for battle text - only show typed text to prevent overlap/glitching */}
            <div className="typed-text">{typeof displayedBattleText === 'string' ? displayedBattleText : ''}</div>
          </div>
          <div className="battle-menu">
            {battleMenuView === 'main' && (
              <div className="menu-buttons">
                <button type="button" className="menu-button primary" onClick={() => { handleButtonSelect(); setBattleMenuView('moves') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={handleButtonHover}>FIGHT</button>
                <button type="button" className="menu-button" onClick={() => { handleButtonSelect(); setBattleMenuView('party') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={handleButtonHover}>MONS</button>
                <button type="button" className="menu-button" onClick={() => { handleButtonSelect(); handleUseMasterBall() }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={handleButtonHover}>BALLS</button>
                <button type="button" className="menu-button" onClick={() => { handleButtonSelect(); handleRun() }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={handleButtonHover}>RUN</button>
              </div>
            )}
            {battleMenuView === 'moves' && (
              <div className="move-grid">
                {(battleState.mode === 'hollow' ? [
                  { id: 'ember', label: 'EMBER', type: 'Fire' },
                  { id: 'water-gun', label: 'WATER GUN', type: 'Water' },
                  { id: 'vine-whip', label: 'VINE WHIP', type: 'Grass' },
                  { id: 'trick-room', label: 'TRICK ROOM', type: 'Psychic' },
                ] : [
                  { id: 'study', label: 'STUDY', type: 'Normal' },
                  { id: 'throw-book', label: 'THROW A BOOK', type: 'Normal' },
                  { id: 'rest', label: 'REST', type: 'Normal' },
                  { id: 'skip-class', label: 'SKIP CLASS', type: 'Normal' },
                ]).map((move) => (
                  <button key={move.id} type="button" className="move-card" style={{ '--type-color': getTypeColor(move.type) }} onClick={() => { handleButtonSelect(); handleBattleMove(move) }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={handleButtonHover}>
                    <strong>{move.label}</strong>
                    <span>{move.type}</span>
                    {MOVE_DESCRIPTIONS[move.id] && (
                      <span className="move-tooltip" role="tooltip">{MOVE_DESCRIPTIONS[move.id]}</span>
                    )}
                  </button>
                ))}
                <button type="button" className="menu-button back" onClick={() => { handleButtonSelect(); setBattleMenuView('main') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={handleButtonHover}>BACK</button>
              </div>
            )}
            {battleMenuView === 'party' && (
              <div className="info-card">
                <h4>Party</h4>
                <ul><li>{battleState.player.name}</li></ul>
                <button type="button" className="menu-button back" onClick={() => { handleButtonSelect(); setBattleMenuView('main') }} disabled={battleState.isResolving || !!battleState.result} onMouseEnter={handleButtonHover}>BACK</button>
              </div>
            )}
          </div>
          {resultScreen && (
            <div className="result-overlay">
              {resultScreen.type === 'tryAgain' ? (
                <>
                  <h2>Try Again?</h2>
                  {battleState.mode === 'hollow' ? (
                    <p className="result-tip">Tip: PAOLO JANSEN ENRERA is faster than you. Find a way to reverse the speed order!</p>
                  ) : (
                    <p className="result-tip">Your team was defeated. Regroup and take another shot at the boss.</p>
                  )}
                  <div className="result-buttons">
                    <button type="button" className="menu-button" onClick={() => { handleButtonSelect(); goToMenu() }} onMouseEnter={handleButtonHover}>MAIN MENU</button>
                    <button type="button" className="menu-button primary" onClick={() => { handleButtonSelect(); retryBattle() }} onMouseEnter={handleButtonHover}>TRY AGAIN</button>
                  </div>
                </>
              ) : resultScreen.type === 'won' ? (
                <>
                  <h2>You Won!</h2>
                  <p className="result-tip">Victory is yours. Press CONTINUE to see what you earned.</p>
                  <button type="button" className="menu-button primary" onClick={() => { handleButtonSelect(); if (resultScreen.newlyUnlocked) { setResultScreen({ type: 'unlocked', section: resultScreen.section }) } else { goToBossSelect() } }} onMouseEnter={handleButtonHover}>CONTINUE</button>
                </>
              ) : (
                <>
                  <h2>You Unlocked!</h2>
                  <p className="result-tip">{`You unlocked ${unlockedSectionLabel(resultScreen.section)}!`}</p>
                  <button type="button" className="menu-button primary" onClick={() => { handleButtonSelect(); goToMenu() }} onMouseEnter={handleButtonHover}>CONTINUE</button>
                </>
              )}
            </div>
          )}
        </section>
      )}

      {screen === 'content' && contentView && (
        <section className="screen content-screen">
          <div className="content-header">
            <p className="screen-label">PORTFOLIO PAGE</p>
            <h2>{contentView === 'about' ? 'About Me' : contentView === 'education' ? 'Education' : 'Contact'}</h2>
          </div>
          {contentView === 'about' && (
            <div className="content-card">
              {aboutText.map((paragraph) => <p key={paragraph} className="page-copy">{paragraph}</p>)}
            </div>
          )}
          {contentView === 'education' && (
            <div className="content-card">
              {educationText.map((line) => <p key={line} className="page-copy">{line}</p>)}
            </div>
          )}
          {contentView === 'contact' && (
            <div className="content-card">
              <div className="contact-links">
                <a href="https://github.com/shuu-pao" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/paolo-jansen-enrera/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://www.instagram.com/shuu_paoo/" target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </div>
          )}
          <button type="button" className="back-button" onClick={() => { playSoundEffect('esc'); setScreen('menu'); setContentView(null) }} onMouseEnter={handleButtonHover}>BACK TO MENU</button>
        </section>
      )}

      <div className="audio-controls" onClick={(event) => event.stopPropagation()}>
        {nowPlayingName && (
          <p className="now-playing">Now playing: {nowPlayingName}</p>
        )}
        <div className="audio-buttons">
          <button type="button" className="audio-toggle" onClick={() => { handleButtonSelect(); setMuted((value) => !value) }} onMouseEnter={handleButtonHover}>{muted ? '🔇' : '🔊'}</button>
          {screen !== 'battle' && (
            <button type="button" className="audio-toggle next-song" onClick={() => { handleNextSong() }} onMouseEnter={handleButtonHover}>NEXT SONG</button>
          )}
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Master volume" />
        </div>
      </div>
    </main>
  )
}

export default App
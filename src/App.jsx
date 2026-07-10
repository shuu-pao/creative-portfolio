import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const menuOptionsBase = [
  { id: 'battle', label: 'BATTLE', unlockText: null },
  { id: 'about', label: 'ABOUT ME', unlockText: 'Defeat "???" to unlock ABOUT ME.' },
  { id: 'professional', label: 'PROFESSIONAL EXPERIENCE', unlockText: 'This section is still being prepared.' },
  { id: 'education', label: 'EDUCATION', unlockText: 'Defeat "DR. SKOO L. CEESTIM" to unlock EDUCATION.' },
  { id: 'contact', label: 'CONTACT', unlockText: null },
]

const bossOptions = [
  { id: 'hollow', label: '???', locked: false },
  { id: 'keeper', label: 'KEEPER OF PROJECTS', locked: true },
  { id: 'school', label: 'DR. SKOO L. CEESTIM', locked: false },
]

const menuPlaylist = [
  { file: 'Pokemon Black and White OST - Driftveil City.mp3' },
  { file: 'Pokemon HGSS Music - Violet and Olivine Cities.mp3' },
  { file: 'Pokemon RubySapphireEmerald- Littleroot Town.mp3' },
  { file: 'Pokemon DP Music - Canalave City.mp3' },
]

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
  if ((normalizedMove === 'Fire' && normalizedDefender === 'Grass') || (normalizedMove === 'Water' && normalizedDefender === 'Fire') || (normalizedMove === 'Grass' && normalizedDefender === 'Water')) return 2
  if ((normalizedMove === 'Fire' && normalizedDefender === 'Water') || (normalizedMove === 'Water' && normalizedDefender === 'Grass') || (normalizedMove === 'Grass' && normalizedDefender === 'Fire')) return 0.5
  return 1
}

function getEffectivenessText(effectiveness) {
  if (effectiveness === 2) return 'super effective'
  if (effectiveness === 0.5) return 'resisted'
  return 'neutral'
}

function App() {
  const [screen, setScreen] = useState('start')
  const [menuIndex, setMenuIndex] = useState(0)
  const [bossIndex, setBossIndex] = useState(0)
  const [battleState, setBattleState] = useState(null)
  const [battleMenuView, setBattleMenuView] = useState('main')
  const [contentView, setContentView] = useState(null)
  const [musicMuted, setMusicMuted] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [menuTrackIndex, setMenuTrackIndex] = useState(0)
  const [unlockedSections, setUnlockedSections] = useState(['contact'])
  const [resultOverlay, setResultOverlay] = useState(null)
  const bgMusicRef = useRef(null)

  const menuOptions = useMemo(() => menuOptionsBase.map((option) => {
    if (option.id === 'battle' || option.id === 'contact') return { ...option, unlocked: true }
    if (option.id === 'about') return { ...option, unlocked: unlockedSections.includes('about') }
    if (option.id === 'education') return { ...option, unlocked: unlockedSections.includes('education') }
    return { ...option, unlocked: false }
  }), [unlockedSections])

  const currentMenuOption = useMemo(() => menuOptions[menuIndex] ?? menuOptions[0], [menuIndex, menuOptions])

  function playSoundEffect(soundName) {
    const safeName = soundName.endsWith('.mp3') ? soundName : `${soundName}.mp3`
    const audio = new Audio(audioUrl(safeName))
    audio.volume = musicMuted ? 0 : Math.min(1, musicVolume * 0.9)
    audio.play().catch(() => undefined)
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

  useEffect(() => {
    const audio = bgMusicRef.current
    if (!audio) return undefined

    if (screen === 'battle' && battleState) {
      const battleTrack = battleState.mode === 'school'
        ? 'Pokemon Black & White - N Final Battle Music (HQ).mp3'
        : 'Pokemon Sun & Moon - Rival Gladion Battle Music (HQ).mp3'
      if (audio.src !== audioUrl(battleTrack)) {
        audio.src = audioUrl(battleTrack)
        audio.loop = true
        audio.play().catch(() => undefined)
      }
      audio.volume = musicMuted ? 0 : musicVolume
      return () => {
        audio.pause()
        audio.onended = null
      }
    }

    const currentTrack = menuPlaylist[menuTrackIndex]
    if (audio.src !== audioUrl(currentTrack.file)) {
      audio.src = audioUrl(currentTrack.file)
      audio.loop = false
      audio.onended = () => {
        setMenuTrackIndex((value) => (value + 1) % menuPlaylist.length)
      }
      audio.play().catch(() => undefined)
    }
    audio.volume = musicMuted ? 0 : musicVolume

    return () => {
      audio.pause()
      audio.onended = null
    }
  }, [screen === 'battle', battleState?.mode, menuTrackIndex, musicMuted, musicVolume])

  useEffect(() => {
    if (screen !== 'start') return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setScreen('menu')
      }
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
        playSoundEffect('Boss Select')
        if (boss.id === 'hollow') {
          setBattleState({
            mode: 'hollow',
            player: { name: 'PAOLO JANSEN', displayName: 'User', hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
            enemy: { name: '???', displayName: '???', hp: 100, maxHp: 100, type: 'Dark', speed: 150, lastMove: null },
            battleText: '??? emerged from the shadows. The battle begins!',
            result: null,
            isResolving: false,
            sequence: [],
            sequenceIndex: 0,
            enemyTurnIndex: 0,
            unlockSection: null,
          })
        }
        if (boss.id === 'school') {
          setBattleState({
            mode: 'school',
            player: { name: 'PAOLO JANSEN', displayName: 'User', hp: 100, maxHp: 100, type: 'Normal', speed: 120, knowledgeStage: 0, knowledgeStatus: 'Knowledge: Neutral', dodgeTurn: false },
            enemy: { name: 'DR. SKOO L. CEESTIM', displayName: 'DR. SKOO L. CEESTIM', hp: 100, maxHp: 100, type: 'Unknown', speed: 60 },
            battleText: 'The battle begins!',
            semesterTurnsLeft: 3,
            enemyTurnIndex: 0,
            result: null,
            isResolving: true,
            sequence: [
              { text: 'DR. SKOO L. CEESTIM\'s ability BACK 2 SCHOOL has been activated.', apply: (prev) => ({ ...prev }), sound: 'In-Battle Ability Activate' },
              { text: 'PAOLO JANSEN\'s type changed into Student.', apply: (prev) => ({ ...prev, player: { ...prev.player, type: 'Student' } }), sound: 'In-Battle Ability Activate' },
              { text: 'PAOLO JANSEN\'s defense stat has been changed into knowledge stat. You have become a part of the school semester.', apply: (prev) => ({ ...prev }), sound: null },
              { text: 'Turns until the semester ends: 3', apply: (prev) => ({ ...prev, semesterTurnsLeft: 3 }), sound: null },
            ],
            sequenceIndex: 0,
            unlockSection: null,
          })
        }
        setBattleMenuView('main')
        setScreen('battle')
        setResultOverlay(null)
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
    const timer = window.setTimeout(() => {
      setBattleState((prev) => {
        if (!prev) return prev
        const step = prev.sequence[prev.sequenceIndex ?? 0]
        if (step.sound) playSoundEffect(step.sound)
        return {
          ...step.apply(prev),
          battleText: step.text,
          sequenceIndex: (prev.sequenceIndex ?? 0) + 1,
          isResolving: true,
        }
      })
    }, 900)
    return () => window.clearTimeout(timer)
  }, [battleState?.isResolving, battleState?.sequenceIndex, battleState?.sequence])

  useEffect(() => {
    if (!battleState || !battleState.result || battleState.isResolving) return undefined
    if (battleState.result === 'victory') {
      playSoundEffect('You Win')
      if (battleState.unlockSection) playSoundEffect('Unlocked')
    } else {
      playSoundEffect('You Lost')
    }
    setResultOverlay({
      title: battleState.result === 'victory' ? 'YOU WON!' : 'YOU LOST',
      detail: battleState.result === 'victory' && battleState.unlockSection
        ? `You unlocked ${battleState.unlockSection.toUpperCase()}!`
        : battleState.result === 'victory'
          ? 'You cleared the encounter.'
          : 'Try again and keep going.',
    })
    return undefined
  }, [battleState?.result, battleState?.unlockSection, battleState?.isResolving])

  function handleBattleMove(move) {
    if (!battleState || battleState.result || battleState.isResolving) return
    const moveSound = {
      ember: 'Ember',
      'water-gun': 'Water Gun',
      'vine-whip': 'Vine Whip',
      'trick-room': 'Trick Room',
      study: 'Study',
      rest: 'Rest',
      'skip-class': 'Skip Class',
      'midterm-exam': 'Midterm Exam',
      'pre-final-exam': 'Pre-Final Exam',
      'final-examination': 'Final Examination',
    }[move.id]
    if (moveSound) playSoundEffect(moveSound)

    if (battleState.mode === 'hollow') {
      const steps = []
      const trickRoomActive = battleState.player.trickRoomTurnsLeft > 0
      const enemyName = battleState.enemy.name
      const playerType = battleState.player.type
      const enemyType = battleState.enemy.type
      let playerDamage = 0

      const applyEnemyMove = () => {
        const enemyMove = [
          { id: 'flamethrower', label: 'FLAMETHROWER', type: 'Fire' },
          { id: 'hydro-pump', label: 'HYDRO PUMP', type: 'Water' },
          { id: 'leaf-storm', label: 'LEAF STORM', type: 'Grass' },
        ].filter((option) => option.id !== battleState.enemy.lastMove)[0] || { id: 'flamethrower', label: 'FLAMETHROWER', type: 'Fire' }
        const effectiveness = getEffectiveness(enemyMove.type, playerType)
        const damage = effectiveness === 2 ? Math.floor(battleState.player.maxHp * 0.25) : effectiveness === 0.5 ? Math.floor(battleState.player.maxHp * 0.125) : Math.floor(battleState.player.maxHp * 0.2)
        steps.push({ text: 'Protean activated.', apply: (prev) => ({ ...prev }), sound: 'In-Battle Ability Activate' })
        steps.push({ text: `${enemyName} used ${enemyMove.label}.`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, type: enemyMove.type, lastMove: enemyMove.id } }), sound: enemyMove.id === 'hydro-pump' ? 'Hydro Pump' : enemyMove.id === 'flamethrower' ? 'Flamethrower' : 'Leaf Storm' })
        steps.push({ text: `Damage check: ${enemyMove.label} is ${getEffectivenessText(effectiveness)} against User.`, apply: (prev) => ({ ...prev }), sound: effectiveness === 2 ? 'Hit Super Effective' : effectiveness === 0.5 ? 'Hit Weak Not Very Effective' : 'Hit Normal Damage' })
        steps.push({ text: `${enemyMove.label} dealt ${damage} damage.`, apply: (prev) => ({ ...prev, player: { ...prev.player, hp: Math.max(0, prev.player.hp - damage) } }), sound: null })
        if (battleState.player.hp - damage <= 0) steps.push({ text: 'You lost the battle.', apply: (prev) => ({ ...prev, result: 'loss' }), sound: null })
      }

      const applyPlayerMove = () => {
        if (move.id === 'trick-room') {
          steps.push({ text: `User used ${move.label}.`, apply: (prev) => ({ ...prev, player: { ...prev.player, trickRoomTurnsLeft: 5 } }), sound: 'Trick Room' })
          steps.push({ text: 'TRICK ROOM reversed the speed order. User will act first for 5 turns.', apply: (prev) => ({ ...prev, player: { ...prev.player, trickRoomTurnsLeft: 5 } }), sound: null })
          return
        }
        const effectiveness = getEffectiveness(move.type, enemyType)
        playerDamage = effectiveness === 2 ? Math.floor(battleState.enemy.maxHp * 0.34) : effectiveness === 0.5 ? Math.floor(battleState.enemy.maxHp * 0.085) : Math.floor(battleState.enemy.maxHp * 0.17)
        steps.push({ text: `User used ${move.label}.`, apply: (prev) => ({ ...prev }), sound: null })
        steps.push({ text: `Damage check: ${move.label} is ${getEffectivenessText(effectiveness)} against ${battleState.enemy.name}.`, apply: (prev) => ({ ...prev }), sound: effectiveness === 2 ? 'Hit Super Effective' : effectiveness === 0.5 ? 'Hit Weak Not Very Effective' : 'Hit Normal Damage' })
        steps.push({ text: `${move.label} dealt ${playerDamage} damage.`, apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: Math.max(0, prev.enemy.hp - playerDamage) } }), sound: null })
        if (battleState.enemy.hp - playerDamage <= 0) steps.push({ text: 'The foe has been defeated.', apply: (prev) => ({ ...prev, result: 'victory', unlockSection: 'about' }), sound: null })
      }

      if (trickRoomActive) {
        applyPlayerMove()
        if (battleState.enemy.hp - playerDamage > 0 && battleState.player.hp > 0) applyEnemyMove()
      } else {
        applyEnemyMove()
        if (battleState.player.hp > 0 && battleState.enemy.hp > 0) applyPlayerMove()
      }

      steps.push({ text: 'The turn resolves.', apply: (prev) => ({ ...prev, player: { ...prev.player, trickRoomTurnsLeft: move.id === 'trick-room' ? 4 : Math.max(0, prev.player.trickRoomTurnsLeft - 1) } }), sound: null })
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
      steps.push({ text: 'User used STUDY.', apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: 'Study' })
      steps.push({ text: `Knowledge advanced to ${nextKnowledgeStatus}.`, apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: 'Stat Increase' })
    } else if (move.id === 'throw-book') {
      nextKnowledgeStage = Math.max(-2, battleState.player.knowledgeStage - 1)
      nextKnowledgeStatus = getKnowledgeStatus(nextKnowledgeStage)
      steps.push({ text: 'User used THROW A BOOK.', apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: null })
      steps.push({ text: `Knowledge decreased to ${nextKnowledgeStatus}.`, apply: (prev) => ({ ...prev, player: { ...prev.player, knowledgeStage: nextKnowledgeStage, knowledgeStatus: nextKnowledgeStatus } }), sound: 'Stat Decrease' })
      steps.push({ text: 'This opponent is a concept and thus, is immune to any physical attacks.', apply: (prev) => ({ ...prev }), sound: null })
    } else if (move.id === 'skip-class') {
      dodgeThisTurn = true
      steps.push({ text: 'User used SKIP CLASS.', apply: (prev) => ({ ...prev, player: { ...prev.player, dodgeTurn: true } }), sound: 'Skip Class' })
      steps.push({ text: 'The next attack will be dodged.', apply: (prev) => ({ ...prev, player: { ...prev.player, dodgeTurn: true } }), sound: null })
    } else if (move.id === 'rest') {
      steps.push({ text: 'User used REST.', apply: (prev) => ({ ...prev, player: { ...prev.player, hp: prev.player.maxHp } }), sound: 'Rest' })
      steps.push({ text: 'PAOLO JANSEN recovered to full HP.', apply: (prev) => ({ ...prev, player: { ...prev.player, hp: prev.player.maxHp } }), sound: 'In-Battle Heal HP Restore' })
    }

    const baseRatio = enemyMove === 'Midterm Exam' ? 0.2 : enemyMove === 'Pre-Final Exam' ? 0.8 : 5.5
    const multiplier = getKnowledgeMultiplier(nextKnowledgeStage)
    const damage = dodgeThisTurn ? 0 : Math.floor(battleState.player.maxHp * baseRatio * multiplier)
    damageToPlayer = damage
    steps.push({ text: `${battleState.enemy.name} used ${enemyMove}.`, apply: (prev) => ({ ...prev }), sound: enemyMove === 'Midterm Exam' ? 'Midterm Exam' : enemyMove === 'Pre-Final Exam' ? 'Pre-Final Exam' : 'Final Examination' })
    if (dodgeThisTurn) {
      steps.push({ text: 'The incoming attack was dodged.', apply: (prev) => ({ ...prev, player: { ...prev.player, dodgeTurn: false } }), sound: null })
    } else {
      steps.push({ text: `${enemyMove} dealt ${damage} damage.`, apply: (prev) => ({ ...prev, player: { ...prev.player, hp: Math.max(0, prev.player.hp - damage) } }), sound: 'Hit Normal Damage' })
    }

    const newSemesterTurns = Math.max(0, battleState.semesterTurnsLeft - 1)
    if (newSemesterTurns <= 0) {
      if (nextKnowledgeStatus === 'Knowledge: Graduating') {
        steps.push({ text: 'PAOLO JANSEN has graduated with flying colors!', apply: (prev) => ({ ...prev, enemy: { ...prev.enemy, hp: 0 }, result: 'victory', unlockSection: 'education' }), sound: null })
      } else {
        steps.push({ text: 'Another semester has started.', apply: (prev) => ({ ...prev, semesterTurnsLeft: 3 }), sound: null })
      }
    } else {
      steps.push({ text: `Turns until the semester ends: ${newSemesterTurns}`, apply: (prev) => ({ ...prev, semesterTurnsLeft: newSemesterTurns }), sound: null })
    }
    if (battleState.player.hp - damageToPlayer <= 0) steps.push({ text: 'You lost the battle.', apply: (prev) => ({ ...prev, result: 'loss' }), sound: null })
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
    setResultOverlay(null)
  }

  function handleRestart() {
    handleButtonSelect()
    setScreen('menu')
    setMenuIndex(0)
    setBattleState(null)
    setBattleMenuView('main')
    setContentView(null)
    setResultOverlay(null)
  }

  function handleContinueFromResult() {
    if (battleState?.unlockSection) {
      setUnlockedSections((value) => (value.includes(battleState.unlockSection) ? value : [...value, battleState.unlockSection]))
    }
    setScreen('menu')
    setMenuIndex(0)
    setBattleState(null)
    setBattleMenuView('main')
    setContentView(null)
    setResultOverlay(null)
  }

  return (
    <main className="app-shell">
      <audio ref={bgMusicRef} />
      {screen === 'start' && (
        <section className="screen start-screen">
          <p className="screen-label">TURN-BASED PORTFOLIO</p>
          <h1>PortfolioMon</h1>
          <p className="screen-copy">Press enter or click below to enter the menu and begin your battles.</p>
          <button type="button" className="start-button" onClick={() => { handleButtonSelect(); setScreen('menu') }} onMouseEnter={handleButtonHover}>PRESS ANY BUTTON TO START</button>
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
          <h2>Choose your next rival</h2>
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
                    handleButtonSelect()
                    if (boss.locked) return
                    playSoundEffect('Boss Select')
                    if (boss.id === 'hollow') {
                      setBattleState({
                        mode: 'hollow',
                        player: { name: 'PAOLO JANSEN', displayName: 'User', hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
                        enemy: { name: '???', displayName: '???', hp: 100, maxHp: 100, type: 'Dark', speed: 150, lastMove: null },
                        battleText: '??? emerged from the shadows. The battle begins!',
                        result: null,
                        isResolving: false,
                        sequence: [],
                        sequenceIndex: 0,
                        enemyTurnIndex: 0,
                        unlockSection: null,
                      })
                    }
                    if (boss.id === 'school') {
                      setBattleState({
                        mode: 'school',
                        player: { name: 'PAOLO JANSEN', displayName: 'User', hp: 100, maxHp: 100, type: 'Normal', speed: 120, knowledgeStage: 0, knowledgeStatus: 'Knowledge: Neutral', dodgeTurn: false },
                        enemy: { name: 'DR. SKOO L. CEESTIM', displayName: 'DR. SKOO L. CEESTIM', hp: 100, maxHp: 100, type: 'Unknown', speed: 60 },
                        battleText: 'The battle begins!',
                        semesterTurnsLeft: 3,
                        enemyTurnIndex: 0,
                        result: null,
                        isResolving: true,
                        sequence: [
                          { text: 'DR. SKOO L. CEESTIM\'s ability BACK 2 SCHOOL has been activated.', apply: (prev) => ({ ...prev }), sound: 'In-Battle Ability Activate' },
                          { text: 'PAOLO JANSEN\'s type changed into Student.', apply: (prev) => ({ ...prev, player: { ...prev.player, type: 'Student' } }), sound: 'In-Battle Ability Activate' },
                          { text: 'PAOLO JANSEN\'s defense stat has been changed into knowledge stat. You have become a part of the school semester.', apply: (prev) => ({ ...prev }), sound: null },
                          { text: 'Turns until the semester ends: 3', apply: (prev) => ({ ...prev, semesterTurnsLeft: 3 }), sound: null },
                        ],
                        sequenceIndex: 0,
                        unlockSection: null,
                      })
                    }
                    setBattleMenuView('main')
                    setScreen('battle')
                    setResultOverlay(null)
                  }}
                >
                  <span>{boss.label}</span>
                  {boss.locked && <span className="lock-icon">🔒</span>}
                </button>
              )
            })}
          </div>
          <button type="button" className="back-button" onClick={() => { handleButtonSelect(); setScreen('menu') }} onMouseEnter={handleButtonHover}>BACK TO MENU</button>
        </section>
      )}

      {screen === 'battle' && battleState && (
        <section className="screen battle-screen">
          <div className="battle-stage">
            <article className="monster-card">
              <p className="monster-label">USER</p>
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
            <article className="monster-card">
              <p className="monster-label">OPPONENT</p>
              <h3>{battleState.enemy.displayName}</h3>
              <p className="type-pill">Type: {battleState.enemy.type}</p>
              <div className="monster-emoji">👹</div>
              <div className="hp-bar"><div className="hp-fill enemy" style={{ width: `${(battleState.enemy.hp / battleState.enemy.maxHp) * 100}%` }} /></div>
              <p className="hp-text">HP {battleState.enemy.hp}/{battleState.enemy.maxHp}</p>
            </article>
          </div>
          <div className="battle-log">{battleState.battleText}</div>
          <div className="battle-menu">
            {battleMenuView === 'main' && (
              <div className="menu-buttons">
                <button type="button" className="menu-button primary" onClick={() => { handleButtonSelect(); setBattleMenuView('moves') }} disabled={battleState.isResolving} onMouseEnter={handleButtonHover}>FIGHT</button>
                <button type="button" className="menu-button" onClick={() => { handleButtonSelect(); setBattleMenuView('party') }} disabled={battleState.isResolving} onMouseEnter={handleButtonHover}>MONS</button>
                <button type="button" className="menu-button" onClick={() => { handleButtonSelect(); handleUseMasterBall() }} disabled={battleState.isResolving} onMouseEnter={handleButtonHover}>BALLS</button>
                <button type="button" className="menu-button" onClick={() => { handleButtonSelect(); handleRun() }} disabled={battleState.isResolving} onMouseEnter={handleButtonHover}>RUN</button>
              </div>
            )}
            {battleMenuView === 'moves' && (
              <div className="move-grid">
                {(battleState.mode === 'hollow' ? [
                  { id: 'ember', label: 'EMBER', type: 'Fire' },
                  { id: 'water-gun', label: 'WATER GUN', type: 'Water' },
                  { id: 'vine-whip', label: 'VINE WHIP', type: 'Grass' },
                  { id: 'trick-room', label: 'TRICK ROOM', type: 'Normal' },
                ] : [
                  { id: 'study', label: 'STUDY', type: 'Normal' },
                  { id: 'throw-book', label: 'THROW A BOOK', type: 'Normal' },
                  { id: 'rest', label: 'REST', type: 'Normal' },
                  { id: 'skip-class', label: 'SKIP CLASS', type: 'Normal' },
                ]).map((move) => (
                  <button key={move.id} type="button" className="move-card" onClick={() => { handleButtonSelect(); handleBattleMove(move) }} disabled={battleState.isResolving} onMouseEnter={handleButtonHover}>
                    <strong>{move.label}</strong>
                    <span>{move.type}</span>
                  </button>
                ))}
                <button type="button" className="menu-button back" onClick={() => { handleButtonSelect(); setBattleMenuView('main') }} disabled={battleState.isResolving} onMouseEnter={handleButtonHover}>BACK</button>
              </div>
            )}
            {battleMenuView === 'party' && (
              <div className="info-card">
                <h4>Party</h4>
                <ul><li>PAOLO JANSEN</li></ul>
                <button type="button" className="menu-button back" onClick={() => { handleButtonSelect(); setBattleMenuView('main') }} disabled={battleState.isResolving} onMouseEnter={handleButtonHover}>BACK</button>
              </div>
            )}
          </div>
          {resultOverlay && (
            <div className="result-overlay">
              <h2>{resultOverlay.title}</h2>
              <p>{resultOverlay.detail}</p>
              <button type="button" className="menu-button primary" onClick={() => { handleButtonSelect(); battleState?.result === 'victory' ? handleContinueFromResult() : handleRestart() }} onMouseEnter={handleButtonHover}>CONTINUE</button>
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
          <button type="button" className="back-button" onClick={() => { handleButtonSelect(); setScreen('menu'); setContentView(null) }} onMouseEnter={handleButtonHover}>BACK TO MENU</button>
        </section>
      )}

      <div className="audio-controls">
        <button type="button" className="audio-toggle" onClick={() => { handleButtonSelect(); setMusicMuted((value) => !value) }} onMouseEnter={handleButtonHover}>{musicMuted ? '🔇' : '🔊'}</button>
        {(screen === 'menu' || screen === 'start' || screen === 'content') && (
          <button type="button" className="audio-toggle next-song" onClick={() => { handleNextSong() }} onMouseEnter={handleButtonHover}>NEXT SONG</button>
        )}
        <input type="range" min="0" max="1" step="0.05" value={musicVolume} onChange={(event) => setMusicVolume(Number(event.target.value))} aria-label="Background music volume" />
      </div>
    </main>
  )
}

export default App

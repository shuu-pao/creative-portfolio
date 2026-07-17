import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import { menuOptionsBase, menuPlaylist, bossOptions } from './data/menu'
import { battleThemes } from './data/bosses'
import { useAudio } from './hooks/useAudio'
import { useBattle } from './hooks/useBattle'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'

import StartScreen from './components/StartScreen'
import MainMenu from './components/MainMenu'
import BossSelect from './components/BossSelect'
import NameEntry from './components/NameEntry'
import BattleScreen from './components/BattleScreen'
import ContentScreen from './components/ContentScreen'
import AudioControls from './components/AudioControls'

function App() {
  const [screen, setScreen] = useState('start')
  const [menuIndex, setMenuIndex] = useState(0)
  const [bossIndex, setBossIndex] = useState(0)
  const [contentView, setContentView] = useState(null)
  const [menuTrackIndex, setMenuTrackIndex] = useState(0)
  // Character name the player types in before their first battle. Stored only in
  // component state (never persisted), so a page refresh forgets it and re-prompts.
  const [characterName, setCharacterName] = useState('')
  // Character gender, picked on the name-entry screen. Drives which player
  // sprite is used in battle. Defaults to 'male' to match the original sprite.
  const [characterGender, setCharacterGender] = useState('male')
  const [pendingBossId, setPendingBossId] = useState(null)
  const [nameInput, setNameInput] = useState('')
  const bgMusicRef = useRef(null)

  const audio = useAudio()
  const battle = useBattle({ setScreen, setContentView, playSoundEffect: audio.playSoundEffect, characterName, characterGender })
  useBackgroundMusic({
    bgMusicRef,
    screen,
    battleState: battle.battleState,
    muted: audio.muted,
    volume: audio.volume,
    menuTrackIndex,
    setMenuTrackIndex,
    battleMusicReady: battle.battleMusicReady,
    bossCuePlaying: battle.bossCuePlaying,
  })

  const menuOptions = useMemo(() => menuOptionsBase.map((option) => {
    if (option.id === 'battle' || option.id === 'contact') return { ...option, unlocked: true }
    if (option.id === 'about') return { ...option, unlocked: battle.unlockedSections.includes('about') }
    if (option.id === 'education') return { ...option, unlocked: battle.unlockedSections.includes('education') }
    return { ...option, unlocked: false }
  }), [battle.unlockedSections])

  const currentMenuOption = useMemo(() => menuOptions[menuIndex] ?? menuOptions[0], [menuIndex, menuOptions])

  // Derive the track that is currently loaded so we can show its name. This
  // mirrors the music hook's track selection: a battle uses the boss's battle
  // theme, otherwise we use the menu playlist track at the current index.
  const nowPlayingFile = (screen === 'battle' && battle.battleState)
    ? battleThemes[battle.battleState.mode]
    : menuPlaylist[menuTrackIndex]?.file
  const nowPlayingName = nowPlayingFile ? nowPlayingFile.replace(/\.mp3$/i, '') : ''

  // Starts the game from the title screen. Wired to both "click anywhere" and
  // "any key" so the PRESS ANY BUTTON TO START prompt is literally true.
  function startFromStartScreen() {
    audio.handleButtonSelect()
    setScreen('menu')
  }

  function handleNextSong() {
    audio.handleButtonSelect()
    setMenuTrackIndex((value) => (value + 1) % menuPlaylist.length)
  }

  // Called when a boss is chosen. If the player hasn't named their character yet,
  // route to the name-entry screen first; otherwise start the battle immediately.
  function handleBossSelected(bossId) {
    if (!characterName) {
      // No name yet: play only the select cue, then route to name entry.
      // The Boss Select cue is held back until after the character is named.
      audio.handleButtonSelect()
      setPendingBossId(bossId)
      setNameInput('')
      setScreen('nameEntry')
      return
    }
    // Named already: play only the Boss Select cue (which silences the menu
    // music), then start the battle. The battle theme waits for the cue to end.
    battle.playBossSelectCue()
    battle.startBattle(bossId)
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
      battle.playBossSelectCue()
      battle.startBattle(bossId, name, characterGender)
    }
  }

  // Navigate from the main menu into the chosen section.
  function handleMenuChoose(option) {
    if (!option.unlocked) return
    if (option.id === 'battle') {
      setScreen('bossSelect')
      setContentView(null)
      battle.setBattleMenuView('main')
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

  function handleContentBack() {
    audio.handleButtonSelect()
    audio.playSoundEffect('esc')
    setScreen('menu')
    setContentView(null)
  }

  // Jump straight from one content page to another (used by the ABOUT ME chat
  // CTAs: "See the full experience", "Check out my education", "Go to contact").
  // Stays on the content screen and just swaps the active view.
  function handleContentNavigate(target) {
    if (!['professional', 'education', 'contact'].includes(target)) return
    setScreen('content')
    setContentView(target)
  }

  function handleNameCancel() {
    audio.handleButtonSelect()
    audio.playSoundEffect('esc')
    setPendingBossId(null)
    setNameInput('')
    setScreen('bossSelect')
  }

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
        handleMenuChoose(menuOptions[menuIndex])
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
        handleBossSelected(bossOptions[bossIndex].id)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, bossIndex])

  // Global ESC handling:
  //  - In battle: treated exactly like pressing RUN (plays Run.mp3).
  //  - In other screens: go back to the previous menu and play esc.mp3.
  //    (bossSelect/content -> menu, nameEntry -> bossSelect)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      if (screen === 'battle' && battle.battleState) {
        if (battle.battleState.isResolving) return
        battle.handleRun() // also plays Run.mp3
        return
      }
      if (screen === 'bossSelect') {
        audio.playSoundEffect('esc')
        setScreen('menu')
        return
      }
      if (screen === 'content') {
        audio.playSoundEffect('esc')
        setScreen('menu')
        setContentView(null)
        return
      }
      if (screen === 'nameEntry') {
        audio.playSoundEffect('esc')
        setScreen('bossSelect')
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, battle.battleState, contentView])

  return (
    <main className="app-shell" onClick={screen === 'start' ? startFromStartScreen : undefined}>
      <audio ref={bgMusicRef} />
      {screen === 'start' && <StartScreen />}

      {screen === 'menu' && (
        <MainMenu
          menuOptions={menuOptions}
          menuIndex={menuIndex}
          currentMenuOption={currentMenuOption}
          setMenuIndex={setMenuIndex}
          onChoose={handleMenuChoose}
          onHover={audio.handleButtonHover}
          onSelect={audio.handleButtonSelect}
        />
      )}

      {screen === 'bossSelect' && (
        <BossSelect
          bossIndex={bossIndex}
          setBossIndex={setBossIndex}
          onChoose={(boss) => handleBossSelected(boss.id)}
          onHover={audio.handleButtonHover}
          onBack={handleContentBack}
        />
      )}

      {screen === 'nameEntry' && (
        <NameEntry
          nameInput={nameInput}
          setNameInput={setNameInput}
          gender={characterGender}
          setGender={setCharacterGender}
          onSubmit={submitCharacterName}
          onCancel={handleNameCancel}
          onHover={audio.handleButtonHover}
        />
      )}

      {screen === 'battle' && battle.battleState && (
        <BattleScreen battle={battle} onHover={audio.handleButtonHover} onSelect={audio.handleButtonSelect} />
      )}

      {screen === 'content' && contentView && (
        <ContentScreen
          contentView={contentView}
          onBack={handleContentBack}
          onHover={audio.handleButtonHover}
          onSelect={audio.handleButtonSelect}
          onNavigate={handleContentNavigate}
        />
      )}

      <AudioControls
        nowPlayingName={nowPlayingName}
        muted={audio.muted}
        volume={audio.volume}
        setVolume={audio.setVolume}
        onToggle={() => { audio.handleButtonSelect(); audio.setMuted((value) => !value) }}
        onNextSong={handleNextSong}
        onHover={audio.handleButtonHover}
        showNextSong={screen !== 'battle'}
      />
    </main>
  )
}

export default App

import { useEffect, useRef } from 'react'
import { audioUrl } from '../data/audio'
import { battleThemes } from '../data/bosses'
import { menuPlaylist } from '../data/menu'

// Drives the looping background music <audio> element. The single button +
// slider govern ALL audio, and the battle theme waits for the "Boss Select" cue
// to finish (gated by bossCuePlaying / battleMusicReady). A ref tracks which
// track is loaded so we only swap the audio source when it actually changes,
// never on every unrelated state update.
export function useBackgroundMusic({
  bgMusicRef,
  screen,
  battleState,
  muted,
  volume,
  menuTrackIndex,
  setMenuTrackIndex,
  battleMusicReady,
  bossCuePlaying,
}) {
  const loadedTrackRef = useRef(null)

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
    const trackKey = inBattle ? `battle:${battleState.mode}` : `menu:${menuTrackIndex}`
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
  }, [screen, battleState, battleState?.mode, battleState?.result, menuTrackIndex, muted, volume, battleMusicReady, bossCuePlaying, setMenuTrackIndex])
}

import { useState } from 'react'
import { audioUrl, soundVolumes } from '../data/audio'

// Owns the global mute/volume state and the one-off sound-effect player. Every
// sound (background music included) honors these controls via playSoundEffect.
export function useAudio() {
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)

  function playSoundEffect(soundName) {
    const safeName = soundName.endsWith('.mp3') ? soundName : `${soundName}.mp3`
    const audio = new Audio(audioUrl(safeName))
    // Each sound is additionally scaled by its own multiplier (see soundVolumes),
    // so the louder effect files are brought in line with the softer ones.
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

  return { muted, setMuted, volume, setVolume, playSoundEffect, handleButtonHover, handleButtonSelect }
}

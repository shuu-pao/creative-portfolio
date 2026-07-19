import { useState } from 'react'

// Global audio controls. The single mute button + slider govern ALL audio
// (background music and sound effects), shared via the useAudio hook.
// Collapsed to a small floating button at bottom-left with a persistent,
// transparent "Now playing" label to its right. Clicking the button opens a
// popover (upward) with the full controls — the popover never covers the label.
export default function AudioControls({ nowPlayingName, muted, volume, setVolume, onToggle, onNextSong, onTogglePlaylist, onHover, showNextSong, showPlaylistToggle, playlistLabel }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`audio-controls ${open ? 'open' : 'collapsed'}`}
      onClick={(event) => event.stopPropagation()}
    >
      {open && (
        <div className="audio-popover">
          <div className="audio-buttons">
            <button type="button" className="audio-toggle" onClick={onToggle} onMouseEnter={onHover}>{muted ? '🔇' : '🔊'}</button>
            {showPlaylistToggle && (
              <button type="button" className="audio-toggle playlist-toggle" onClick={onTogglePlaylist} onMouseEnter={onHover}>{playlistLabel}</button>
            )}
            {showNextSong && (
              <button type="button" className="audio-toggle next-song" onClick={onNextSong} onMouseEnter={onHover}>NEXT SONG</button>
            )}
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Master volume" />
          </div>
        </div>
      )}
      <div className="audio-row">
        <button
          type="button"
          className="audio-fab"
          aria-expanded={open}
          aria-label={open ? 'Hide music controls' : 'Show music controls'}
          onClick={() => setOpen((value) => !value)}
          onMouseEnter={onHover}
        >
          {open ? '✕' : (muted ? '🔇' : '🎵')}
        </button>
        {nowPlayingName && (
          <p className="now-playing">Now playing: {nowPlayingName}</p>
        )}
      </div>
    </div>
  )
}

// Global audio controls. The single mute button + slider govern ALL audio
// (background music and sound effects), shared via the useAudio hook.
export default function AudioControls({ nowPlayingName, muted, volume, setVolume, onToggle, onNextSong, onHover, showNextSong }) {
  return (
    <div className="audio-controls" onClick={(event) => event.stopPropagation()}>
      {nowPlayingName && (
        <p className="now-playing">Now playing: {nowPlayingName}</p>
      )}
      <div className="audio-buttons">
        <button type="button" className="audio-toggle" onClick={onToggle} onMouseEnter={onHover}>{muted ? '🔇' : '🔊'}</button>
        {showNextSong && (
          <button type="button" className="audio-toggle next-song" onClick={onNextSong} onMouseEnter={onHover}>NEXT SONG</button>
        )}
        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Master volume" />
      </div>
    </div>
  )
}

// Character-name entry. Shown the first time the player picks a boss, before
// the battle begins. Submit + cancel are owned by App (which then starts the
// battle / returns to boss select). Gender is owned by App too, so it persists
// if the player cancels and re-enters.
export default function NameEntry({ nameInput, setNameInput, gender, setGender, onSubmit, onCancel, onHover }) {
  return (
    <section className="screen name-entry-screen">
      <p className="screen-label">YOUR CHARACTER</p>
      <h2>Please tell us the name of your character.</h2>
      <form className="name-entry-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
        <input
          type="text"
          className="name-input"
          value={nameInput}
          autoFocus
          placeholder="Enter character name"
          onChange={(event) => setNameInput(event.target.value)}
          onMouseEnter={onHover}
        />
        <div className="gender-picker">
          <p className="gender-prompt">SELECT GENDER</p>
          <div className="gender-options">
            <button
              type="button"
              className={`gender-button ${gender === 'male' ? 'selected' : ''}`}
              aria-pressed={gender === 'male'}
              aria-label="Male"
              onClick={() => setGender('male')}
              onMouseEnter={onHover}
            >
              <svg className="gender-icon male" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <line x1="14" y1="10" x2="21" y2="3" stroke="currentColor" strokeWidth="2.2" />
                <polyline points="15.5,3 21,3 21,8.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
              </svg>
            </button>
            <button
              type="button"
              className={`gender-button ${gender === 'female' ? 'selected' : ''}`}
              aria-pressed={gender === 'female'}
              aria-label="Female"
              onClick={() => setGender('female')}
              onMouseEnter={onHover}
            >
              <svg className="gender-icon female" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <line x1="12" y1="15" x2="12" y2="22" stroke="currentColor" strokeWidth="2.2" />
                <line x1="8" y1="19" x2="16" y2="19" stroke="currentColor" strokeWidth="2.2" />
              </svg>
            </button>
          </div>
        </div>
        <div className="name-entry-actions">
          <button type="button" className="cancel-button" onClick={onCancel} onMouseEnter={onHover}>CANCEL</button>
          <button type="submit" className="start-button" disabled={nameInput.trim() === ''} onMouseEnter={onHover}>START BATTLE</button>
        </div>
      </form>
    </section>
  )
}

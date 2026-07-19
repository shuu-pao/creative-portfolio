// Main menu. Navigation (keyboard + screen routing) is owned by App; this
// component reports intent via onChoose and tracks the active option via
// setMenuIndex on hover. The "unlock whole menu" button (onToggle) reveals the
// full portfolio — or returns to "Normal Mode" — for visitors who'd rather read
// than battle. Section stars (earnedStars / starSlots) show fairly-earned unlocks.
export default function MainMenu({ menuOptions, menuIndex, currentMenuOption, setMenuIndex, onChoose, onToggle, earnedStars, starSlots, onHover, onSelect }) {
  // True once every option is unlocked (via battle wins or the toggle button).
  const allUnlocked = menuOptions.every((option) => option.unlocked)

  // Build the star row: one star per locked section, lit only when that section
  // was unlocked via a legit battle (CALL REINFORCEMENTS / bypass earn none).
  const litSet = new Set(earnedStars)
  const stars = starSlots.map((slot) => ({ ...slot, lit: litSet.has(slot.id) }))

  // Every star lit — i.e. all real battles won (placeholder bosses start lit,
  // so this also needs the three built bosses beaten).
  const allStarsAchieved = starSlots.every((slot) => litSet.has(slot.id))

  return (
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
                className={`menu-option ${isActive ? 'active' : ''} ${option.unlocked ? '' : 'locked'} ${option.id === 'chat' ? 'menu-option-p5' : ''}`}
                onMouseEnter={() => { setMenuIndex(index); onHover() }}
                onClick={() => {
                  onSelect()
                  onChoose(option)
                }}
              >
                <span>{option.label}</span>
                {option.id === 'chat' && <span className="menu-option-p5-stamp" aria-hidden="true">NEW</span>}
                {!option.unlocked && <span className="lock-icon">🔒</span>}
              </button>
            )
          })}
        </div>
        <div className="menu-stars" aria-label="Sections unlocked">
          <span className="menu-stars-label">BATTLES COMPLETED</span>
          {stars.map((star) => (
            <span
              key={star.id}
              className={`menu-star ${star.lit ? 'filled' : 'empty'}`}
              title={star.label}
              aria-hidden="true"
            >
              {star.lit ? '★' : '☆'}
            </span>
          ))}
        </div>
        <div className="menu-browse-row">
          {allStarsAchieved ? (
            <button
              type="button"
              className="menu-browse completed"
              disabled
            >
              Thanks for playing!
            </button>
          ) : allUnlocked ? (
            <button
              type="button"
              className="menu-browse"
              onClick={onToggle}
              onMouseEnter={onHover}
            >
              Normal mode
            </button>
          ) : (
            <button
              type="button"
              className="menu-browse"
              onClick={onToggle}
              onMouseEnter={onHover}
            >
              Just browsing? Unlock the whole menu!
            </button>
          )}
          <p className="menu-explain">
            {allStarsAchieved
              ? "You've completed every battle. You're a PORTFOLIOMON EXPERT!"
              : allUnlocked
                ? "Everything's unlocked. Tap 'Normal Mode' to return to the gated experience."
                : "Defeat bosses in BATTLE to unlock sections — or skip the fight and unlock everything above."}
          </p>
        </div>
      </div>
      <aside className="menu-hint">
        {currentMenuOption?.unlocked ? (
          <>
            <h3>{currentMenuOption.label}</h3>
            <p>{
              currentMenuOption.id === 'battle' ? 'Fight to unlock more of the menu!' :
              currentMenuOption.id === 'about' ? 'Learn a bit more about the CREATOR!' :
              currentMenuOption.id === 'education' ? 'Learn where the CREATOR got his education from!' :
              currentMenuOption.id === 'contact' ? 'Reach out to the CREATOR!' :
              currentMenuOption.id === 'professional' ? "Learn about the CREATOR's professional career!" :
              currentMenuOption.id === 'skills' ? "See the CREATOR's toolkit and skills!" :
              currentMenuOption.id === 'projects' ? "Check out the CREATOR's personal projects!" :
              currentMenuOption.id === 'chat' ? 'Chat with the AI guide about the CREATOR!' :
              'Select this option to continue.'
            }</p>
          </>
        ) : (
          <>
            <h3>LOCKED</h3>
            <p>{currentMenuOption?.unlockText}</p>
          </>
        )}
      </aside>
    </section>
  )
}

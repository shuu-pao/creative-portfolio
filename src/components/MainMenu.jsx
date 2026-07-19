// Main menu. Navigation (keyboard + screen routing) is owned by App; this
// component reports intent via onChoose and tracks the active option via
// setMenuIndex on hover.
export default function MainMenu({ menuOptions, menuIndex, currentMenuOption, setMenuIndex, onChoose, onHover, onSelect }) {
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
                className={`menu-option ${isActive ? 'active' : ''} ${option.unlocked ? '' : 'locked'}`}
                onMouseEnter={() => { setMenuIndex(index); onHover() }}
                onClick={() => {
                  onSelect()
                  onChoose(option)
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
            <p>{
              currentMenuOption.id === 'battle' ? 'Fight to unlock more of the menu!' :
              currentMenuOption.id === 'about' ? 'Learn a bit more about the CREATOR!' :
              currentMenuOption.id === 'education' ? 'Learn where the CREATOR got his education from!' :
              currentMenuOption.id === 'contact' ? 'Reach out to the CREATOR!' :
              currentMenuOption.id === 'professional' ? "Learn about the CREATOR's professional career!" :
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

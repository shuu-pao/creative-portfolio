import { bossOptions } from '../data/menu'

// Boss select screen. Keyboard navigation + locked-state checks live in App;
// this component reports selection via onChoose and tracks the active boss via
// setBossIndex on hover.
export default function BossSelect({ bossIndex, setBossIndex, onChoose, onHover, onBack }) {
  return (
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
              onMouseEnter={() => { setBossIndex(index); onHover() }}
              onClick={() => {
                if (boss.locked) return
                onChoose(boss)
              }}
            >
              <span>{boss.label}</span>
              {boss.locked && <span className="lock-icon">🔒</span>}
            </button>
          )
        })}
      </div>
      <button type="button" className="back-button" onClick={onBack} onMouseEnter={onHover}>BACK TO MENU</button>
    </section>
  )
}

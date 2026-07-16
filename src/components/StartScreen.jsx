// Title screen. The PRESS ANYWHERE TO START prompt is literal: the parent
// <main> handles the click/keypress that starts the game, so this is purely
// presentational.
export default function StartScreen() {
  return (
    <section className="screen start-screen">
      <p className="screen-label">TURN-BASED PORTFOLIO</p>
      <h1>PortfolioMon</h1>
      <div className="start-prompt-lines">
        <span className="start-line" />
        <p className="start-prompt">PRESS ANYWHERE TO START</p>
        <span className="start-line" />
      </div>
    </section>
  )
}

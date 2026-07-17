// Post-battle follow-up overlay. Shows one of three states based on
// `resultScreen.type`:
//   - 'tryAgain'  : the player lost (MAIN MENU / TRY AGAIN)
//   - 'won'       : victory before any unlock screen (CONTINUE)
//   - 'unlocked'  : victory that unlocked a new section (CONTINUE)
export default function ResultOverlay({ resultScreen, isHollow, sectionLabel, onContinue, onMainMenu, onRetry, onHover }) {
  if (!resultScreen) return null

  if (resultScreen.type === 'tryAgain') {
    return (
      <>
        <h2>Try Again?</h2>
        {isHollow ? (
          <p className="result-tip">Tip: TWO is faster than you, making it hard to predict his next type. Find a way to reverse the speed order!</p>
        ) : (
          <p className="result-tip">Tip: uhh...</p>
        )}
        <div className="result-buttons">
          <button type="button" className="menu-button" onClick={onMainMenu} onMouseEnter={onHover}>MAIN MENU</button>
          <button type="button" className="menu-button primary" onClick={onRetry} onMouseEnter={onHover}>TRY AGAIN</button>
        </div>
      </>
    )
  }

  if (resultScreen.type === 'won') {
    return (
      <>
        <h2>You Won!</h2>
        <button type="button" className="menu-button primary" onClick={onContinue} onMouseEnter={onHover}>CONTINUE</button>
      </>
    )
  }

  return (
    <>
      <h2>Unlocked!</h2>
      <p className="result-tip">{`You unlocked ${sectionLabel}!`}</p>
      <button type="button" className="menu-button primary" onClick={onMainMenu} onMouseEnter={onHover}>CONTINUE</button>
    </>
  )
}

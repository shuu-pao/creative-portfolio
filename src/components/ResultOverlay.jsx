// Post-battle follow-up overlay. Shows one of three states based on
// `resultScreen.type`:
//   - 'tryAgain'  : the player lost (MAIN MENU / TRY AGAIN)
//   - 'won'       : victory before any unlock screen (CONTINUE)
//   - 'unlocked'  : victory that unlocked a new section (CONTINUE)
export default function ResultOverlay({ resultScreen, isHollow, mode, sectionLabel, onContinue, onMainMenu, onRetry, onHover }) {
  if (!resultScreen) return null

  if (resultScreen.type === 'tryAgain') {
    let tip
    if (isHollow) {
      tip = 'Tip: TWO is faster than you, making it hard to predict his next type. Find a way to reverse the speed order!'
    } else if (mode === 'asgore') {
      tip = 'TIP: GHOST is just a regular monster civilian. Find a way to win without using violence.'
    } else if (mode === 'ghost') {
      tip = "Tip: You can't beat GHOST by force — open ACT and use TALK, then TALK again, then JOKE to befriend him."
    } else {
      tip = "Tip: Study up and answer DR. ZANGETSU's questions correctly!"
    }
    return (
      <>
        <h2>Try Again?</h2>
        <p className="result-tip">{tip}</p>
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

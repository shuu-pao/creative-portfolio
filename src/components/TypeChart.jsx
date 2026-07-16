import { EFFECTIVENESS_CHART } from '../game/types'

// APOSTLE: TWO is a Fire/Water/Grass rock-paper-scissors. The chart shows, for
// each attacking type (row, labeled "ATK ↓"), how effective it is against each
// defending type (column, labeled "DEF →"). Cells show the multiplier:
// green 2× = super effective, red ½× = resisted. This is the same cycle the
// battle uses: Fire → Grass → Water → Fire.
const TYPES = ['Fire', 'Water', 'Grass']
const EMOJI = { Fire: '🔥', Water: '💧', Grass: '🌿' }
const COLOR = { Fire: '#ef4444', Water: '#3b82f6', Grass: '#22c55e' }

// Press Start 2P has no →/↓ glyphs, so the browser falls back to a system font
// that draws the right arrow thinner than the down one. Draw both arrows as SVG
// with an identical stroke so they're guaranteed the same weight.
function AxisArrow({ dir }) {
  const d = dir === 'down'
    ? 'M6 1 V8.5 M2.5 5 L6 8.5 L9.5 5'
    : 'M1 6 H8.5 M5 2.5 L8.5 6 L5 9.5'
  return (
    <svg className="tc-axis-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  )
}

export default function TypeChart({ size = 'full' }) {
  if (size === 'small') {
    // Compact badge in the hover trigger: one dot per type.
    return (
      <svg
        className="type-chart-svg"
        viewBox="0 0 48 16"
        role="img"
        aria-label="Type chart: Fire, Water, and Grass."
        style={{ width: 36, height: 24 }}
      >
        {TYPES.map((t, i) => (
          <circle key={t} cx={8 + i * 16} cy={8} r={5} fill={COLOR[t]} />
        ))}
      </svg>
    )
  }

  return (
    <div
      className="type-chart-matrix"
      role="img"
      aria-label="Type chart. Rows (labeled ATK, pointing down) are the attacking type; columns (labeled DEF, pointing right) are the defending type. Fire beats Grass, Water beats Fire, Grass beats Water (green 2×); each type resists itself and the type it is weak to (red ½×)."
    >
      <div className="tc-row tc-head">
        <div className="tc-corner">
          <span>DEF <AxisArrow dir="right" /></span>
          <span>ATK <AxisArrow dir="down" /></span>
        </div>
        {TYPES.map((t) => (
          <div key={t} className="tc-head-cell" style={{ color: COLOR[t] }}>
            {EMOJI[t]} {t}
          </div>
        ))}
      </div>
      {TYPES.map((atk) => (
        <div className="tc-row" key={atk}>
          <div className="tc-row-head" style={{ color: COLOR[atk] }}>
            {EMOJI[atk]} {atk}
          </div>
          {TYPES.map((def) => {
            const mult = EFFECTIVENESS_CHART[atk]?.[def] ?? 1
            const strong = mult === 2
            return (
              <div
                key={def}
                className={`tc-cell ${strong ? 'tc-strong' : 'tc-weak'}`}
                title={`${atk} vs ${def}: ${strong ? 'super effective (2×)' : 'not very effective (½×)'}`}
              >
                {strong ? '2×' : '½×'}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

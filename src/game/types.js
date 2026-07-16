import { TYPE_COLORS } from '../data/bosses'

export function normalizeType(type) {
  if (type === 'Unknown' || type === 'Student') return 'Normal'
  return type
}

// Effectiveness chart: EFFECTIVENESS_CHART[attacker][defender] = multiplier.
// Same-type attacks resist themselves; Fire>Grass>Water>Fire is the cycle.
export const EFFECTIVENESS_CHART = {
  Fire: { Fire: 0.5, Grass: 2, Water: 0.5 },
  Water: { Water: 0.5, Fire: 2, Grass: 0.5 },
  Grass: { Grass: 0.5, Water: 2, Fire: 0.5 },
}

export function getEffectiveness(moveType, defenderType) {
  const move = normalizeType(moveType)
  const defender = normalizeType(defenderType)
  return EFFECTIVENESS_CHART[move]?.[defender] ?? 1
}

export function getEffectivenessText(effectiveness) {
  if (effectiveness === 2) return 'super effective'
  if (effectiveness === 0.5) return 'not very effective'
  return 'neutral'
}

export function getTypeColor(type) {
  return TYPE_COLORS[type] || '#7dd3fc'
}

// Builds the static-served URL for an audio file. Every name runs through
// encodeURIComponent so spaces in the filenames are safely encoded in the
// request URL and the file still serves correctly from a static host.
export function audioUrl(fileName) {
  return `/audio/${encodeURIComponent(fileName)}`
}

// Per-sound volume multipliers. 1 = follow the global slider unchanged,
// <1 = quieter, >1 = louder. Move attack + impact effects are capped at 0.6 so
// the master slider maps to 0%-60% for them; every other sound defaults to 0.5
// (50%) so the louder effect files are brought in line with the softer ones.
export const soundVolumes = {
  'hover-button': 1,
  'select-button': 1,
  // Move sound effects (max 60% of the original volume):
  Ember: 0.6,
  'Water Gun': 0.6,
  'Vine Whip': 0.6,
  'Trick Room': 0.6,
  Flamethrower: 0.6,
  'Hydro Pump': 0.6,
  'Leaf Storm': 0.6,
  'Hit Super Effective': 0.3,
  'Hit Weak Not Very Effective': 0.6,
  'Hit Normal Damage': 0.6,
  Fainted: 0.6,
}

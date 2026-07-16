// Battle themes keyed by boss `mode`. The filenames match the real track
// titles (with spaces); audioUrl encodes them for static serving.
export const battleThemes = {
  hollow: 'Pokemon Sun and Moon - Rival Gladion Battle Music.mp3', // "PAOLO'S APOSTLE" -> Pokémon Sun & Moon - Rival Gladion
  school: 'Pokemon Black and White - N Final Battle Music.mp3',    // Dr. Skoo -> Pokémon Black & White - N Final Battle
}

// Battle art, keyed by boss `mode`. For now every boss reuses the Yhwach assets
// (the "Yhwach Boss.png" sprite belongs to the DR. ZANGETSU fight). This map is
// where per-boss backgrounds + opponent sprites get swapped in later.
export const BOSS_ASSETS = {
  hollow: {
    background: '/Battle Backgrounds/Two Background.png',
    opponentSprite: '/Characters/Two Boss.png',
  },
  school: {
    background: '/Battle Backgrounds/Yhwach Background.png',
    opponentSprite: '/Characters/Yhwach Boss.png', // DR. ZANGETSU uses the Yhwach Boss sprite
  },
}
// Player sprite, chosen by the character's gender (picked on the name-entry
// screen). Defaults to male to match the original single-sprite behavior.
export const PLAYER_SPRITE_MALE = '/Characters/User Character Male.png'
export const PLAYER_SPRITE_FEMALE = '/Characters/User Character Female.png'

// Maps a type to an accent color used to tint a monster's UI box so it visually
// matches the monster's current type (e.g. Fire -> red).
export const TYPE_COLORS = {
  Fire: '#ef4444',
  Water: '#3b82f6',
  Grass: '#22c55e',
  Psychic: '#a855f7',
  Normal: '#7dd3fc',
  Unknown: '#7dd3fc',
  Student: '#6fcf6c',
  MATHEMATICS: '#3b82f6',
  SCIENCE: '#22c55e',
  ENGLISH: '#ef4444',
  'SOCIAL STUDIES': '#b07a3c',
}

// Short flavor text shown in a tooltip when the player hovers a move button.
// Keyed by the move's `id` so only the listed moves get a tooltip.
export const MOVE_DESCRIPTIONS = {
  ember: 'Deals minor fire damage',
  'water-gun': 'Deal minor water damage',
  'vine-whip': 'Deals minor grass damage',
  'trick-room': 'Reverses the speed order',
}

// Fractions of max HP dealt, keyed by attacker side and effectiveness. These
// replace the inline magic numbers that used to live in handleBattleMove.
// NOTE: the hollow enemy deals the same fraction on super-effective and neutral
// hits (0.25) — that quirk is preserved here on purpose.
export const HOLLOW_DAMAGE = {
  player: { super: 0.34, weak: 0.085, neutral: 0.17 }, // fraction of enemy.maxHp
  enemy: { super: 0.25, weak: 0.125, neutral: 0.25 },  // fraction of player.maxHp
}

// Static move sets for the FIGHT menu. The "school" fight builds its move list
// dynamically from the current question (see game/battleMoves.js), so it returns
// an empty array here.
export function movesFor(mode) {
  if (mode === 'hollow') {
    return [
      { id: 'ember', label: 'EMBER', type: 'Fire' },
      { id: 'water-gun', label: 'WATER GUN', type: 'Water' },
      { id: 'vine-whip', label: 'VINE WHIP', type: 'Grass' },
      { id: 'trick-room', label: 'TRICK ROOM', type: 'Psychic' },
    ]
  }
  return []
}

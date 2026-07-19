// Main-menu options. `unlockText` is shown when the option is still locked.
export const menuOptionsBase = [
  { id: 'battle', label: 'BATTLE', unlockText: null },
  { id: 'about', label: 'ABOUT ME', unlockText: 'Defeat "TWO" to unlock ABOUT ME.' },
  { id: 'professional', label: 'PROFESSIONAL EXPERIENCE', unlockText: 'Defeat "GHOST" to unlock PROFESSIONAL EXPERIENCE.' },
  { id: 'education', label: 'EDUCATION', unlockText: 'Defeat "DR. ZANGETSU" to unlock EDUCATION.' },
  { id: 'contact', label: 'CONTACT', unlockText: null },
]

// Selectable bosses. The 2nd boss (GHOST) unlocks PROFESSIONAL EXPERIENCE by
// befriending him (ACT -> TALK -> TALK -> JOKE); killing him instead chains into
// the ASGORE follow-up fight.
export const bossOptions = [
  { id: 'hollow', label: 'TWO', locked: false },
  { id: 'ghost', label: 'GHOST', locked: false },
  { id: 'school', label: 'DR. ZANGETSU', locked: false },
]

// Menu background music (loops through these in order).
export const menuPlaylist = [
  { file: 'Pokemon Black and White OST - Driftveil City.mp3' },
  { file: 'Pokemon HGSS Music - Violet and Olivine Cities.mp3' },
  { file: 'Pokemon RubySapphireEmerald- Littleroot Town.mp3' },
  { file: 'Pokemon DP Music - Canalave City.mp3' },
]

// Main-menu options. `unlockText` is shown when the option is still locked.
export const menuOptionsBase = [
  { id: 'battle', label: 'BATTLE', unlockText: null },
  { id: 'about', label: 'ABOUT ME', unlockText: 'Defeat "TWO" to unlock ABOUT ME.' },
  { id: 'professional', label: 'PROFESSIONAL EXPERIENCE', unlockText: 'This section is still being prepared.' },
  { id: 'education', label: 'EDUCATION', unlockText: 'Defeat "DR. ZANGETSU" to unlock EDUCATION.' },
  { id: 'contact', label: 'CONTACT', unlockText: null },
]

// Selectable bosses. `keeper` is currently locked and has no battle configured
// yet (see the guard in useBattle.startBattle), so selecting it is a no-op.
export const bossOptions = [
  { id: 'hollow', label: 'TWO', locked: false },
  { id: 'keeper', label: 'KEEPER OF PROJECTS', locked: true },
  { id: 'school', label: 'DR. ZANGETSU', locked: false },
]

// Menu background music (loops through these in order).
export const menuPlaylist = [
  { file: 'Pokemon Black and White OST - Driftveil City.mp3' },
  { file: 'Pokemon HGSS Music - Violet and Olivine Cities.mp3' },
  { file: 'Pokemon RubySapphireEmerald- Littleroot Town.mp3' },
  { file: 'Pokemon DP Music - Canalave City.mp3' },
]

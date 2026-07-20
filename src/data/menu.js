// Main-menu options. `unlockText` is shown when the option is still locked.
// `chat` is always unlocked so visitors can meet the AI guide without fighting.
export const menuOptionsBase = [
  { id: 'battle', label: 'BATTLE', unlockText: null },
  { id: 'chat', label: 'CHAT WITH AI', unlockText: null },
  { id: 'about', label: 'ABOUT ME', unlockText: 'Defeat "TWO" to unlock ABOUT ME.' },
  { id: 'professional', label: 'PROFESSIONAL EXPERIENCE', unlockText: 'Befriend "GHOST" to unlock PROFESSIONAL EXPERIENCE.' },
  { id: 'education', label: 'EDUCATION', unlockText: 'Defeat "DR. ZANGETSU" to unlock EDUCATION.' },
  { id: 'skills', label: 'SKILLS', unlockText: 'Defeat the upcoming boss to unlock SKILLS.' },
  { id: 'projects', label: 'PERSONAL PROJECTS', unlockText: 'Defeat the upcoming boss to unlock PERSONAL PROJECTS.' },
  { id: 'contact', label: 'CONTACT', unlockText: null },
]

// Selectable bosses — one boss per locked section, so each boss unlocks exactly
// one section (a 1:1 map, matching the 5 gated menu buttons):
//   TWO          -> ABOUT ME                (defeat)
//   GHOST        -> PROFESSIONAL EXPERIENCE (befriend: ACT -> TALK -> TALK -> JOKE)
//   DR. ZANGETSU -> EDUCATION               (defeat, quiz fight)
//   skillsBoss   -> SKILLS                  (placeholder — boss undecided; LOCKED)
//   projectsBoss -> PERSONAL PROJECTS       (placeholder — boss undecided; LOCKED)
// Killing GHOST chains into the unbeatable ASGORE follow-up fight (which unlocks
// nothing). The two placeholder bosses stay locked so they can't be selected
// until their real fights are built.
export const bossOptions = [
  { id: 'hollow', label: 'TWO', locked: false },
  { id: 'ghost', label: 'GHOST', locked: false },
  { id: 'school', label: 'DR. ZANGETSU', locked: false },
  { id: 'skillsBoss', label: 'BOSS 04 - COMING SOON', locked: true },
  { id: 'projectsBoss', label: 'BOSS 05 - COMING SOON', locked: true },
]

// Menu background music. Two selectable playlists the player can switch between
// from the in-game audio controls (see AudioControls). `menuPlaylists` is keyed
// by an id used for React state; the active playlist loops through its tracks.
export const pokemonPlaylist = [
  { file: 'Pokemon Black and White OST - Driftveil City.mp3' },
  { file: 'Pokemon HGSS Music - Violet and Olivine Cities.mp3' },
  { file: 'Pokemon RubySapphireEmerald - Littleroot Town.mp3' },
  { file: 'Pokemon DP Music - Canalave City.mp3' },
]

export const personaPlaylist = [
  { file: 'Persona 5 OST 69 - Sweet.mp3' },
  { file: 'Persona 5 OST 29 - Beneath the Mask.mp3' },
  { file: 'Persona 5 - Wake Up Get up Get Out There.mp3' },
  { file: 'Persona 4 OST - Heaven.mp3' },
  { file: 'Persona 5 Royal - No More What Ifs.mp3' },
  { file: 'Persona 5 OST 109 - With the Stars and Us (Hoshi to Bokura to).mp3' },
  { file: 'Persona 4 OST - Heartbeat Heartbreak.mp3' },
]

export const menuPlaylists = {
  pokemon: pokemonPlaylist,
  persona: personaPlaylist,
}

// Playlist active on first load.
export const DEFAULT_PLAYLIST = 'persona'

// Opening track for each playlist (index into that playlist). Persona always
// opens on "Beneath the Mask"; Pokemon opens on its first track. Used both for
// the initial load and whenever the player switches TO that playlist, so going
// Pokemon -> Persona resumes on "Beneath the Mask" rather than its first track.
export const PLAYLIST_DEFAULT_TRACK = {
  persona: personaPlaylist.findIndex(
    (track) => track.file === 'Persona 5 OST 29 - Beneath the Mask.mp3'
  ) || 0,
  pokemon: 0,
}

export const DEFAULT_TRACK_INDEX = PLAYLIST_DEFAULT_TRACK[DEFAULT_PLAYLIST]

// Section ids that a battle or the browse-bypass can unlock. `chat` is always
// available and is intentionally excluded here.
export const UNLOCKABLE_SECTIONS = ['about', 'professional', 'education', 'skills', 'projects']

// Star row on the main menu — one star per boss, listed in BOSS ORDER so the
// row doubles as a boss-progress tracker. Slot N lights when boss N is beaten
// (or befriended, for GHOST). The slot `id` is the section that boss unlocks:
//   TWO          (slot 1) -> ABOUT ME
//   GHOST        (slot 2) -> PROFESSIONAL EXPERIENCE  (befriend: TALK/JOKE)
//   DR. ZANGETSU (slot 3) -> EDUCATION
//   BOSS 04      (slot 4) -> SKILLS
//   BOSS 05      (slot 5) -> PERSONAL PROJECTS
// A star lights only on a LEGIT battle win (CALL REINFORCEMENTS and the
// browse-bypass earn none). BOSS 04 and BOSS 05 have no real fights yet, so
// their stars start lit by default (see earnedStars init in useBattle).
export const STAR_SLOTS = [
  { id: 'about', label: 'TWO' },
  { id: 'professional', label: 'GHOST' },
  { id: 'education', label: 'DR. ZANGETSU' },
  { id: 'skills', label: 'BOSS 04 - COMING SOON' },
  { id: 'projects', label: 'BOSS 05 - COMING SOON' },
]

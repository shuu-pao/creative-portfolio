import { buildGhostSteps } from './src/game/battleGhost.js'
import { buildAsgoreSteps } from './src/game/battleAsgore.js'
import { buildTalkSteps } from './src/game/battleTalk.js'
import { buildHollowSteps } from './src/game/battleHollow.js'

function clone(o) { return JSON.parse(JSON.stringify(o)) }

function startGhost() {
  return {
    mode: 'ghost',
    player: { name: 'PAOLO', displayName: 'PAOLO', gender: 'male', hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
    enemy: { name: 'GHOST', displayName: 'GHOST', hp: 100, maxHp: 100, type: 'GHOST', speed: 200, lastMove: null },
    ghost: { attacksReceived: 0, talkStage: 0, dialogue: 'GHOST is minding his own business.', fatalSurvived: false },
    result: null, isResolving: false, sequence: [], sequenceIndex: 0, unlockSection: null,
  }
}
function startAsgore() {
  return {
    mode: 'asgore',
    player: { name: 'PAOLO', displayName: 'PAOLO', gender: 'male', hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
    enemy: { name: 'ASGORE', displayName: 'ASGORE', hp: 100, maxHp: 100, type: 'Monster', speed: 50, lastMove: null },
    asgore: { comboStep: 0 },
    result: null, isResolving: false, sequence: [], sequenceIndex: 0, unlockSection: null,
  }
}
function startHollow() {
  return {
    mode: 'hollow',
    player: { name: 'PAOLO', displayName: 'PAOLO', gender: 'male', hp: 100, maxHp: 100, type: 'Normal', speed: 120, trickRoomTurnsLeft: 0 },
    enemy: { name: 'TWO', displayName: 'TWO', hp: 100, maxHp: 100, type: 'Fire', speed: 150, lastMove: null },
    result: null, isResolving: false, sequence: [], sequenceIndex: 0, unlockSection: null,
  }
}

function run(state, move) {
  let steps
  if (state.mode === 'ghost') steps = buildGhostSteps(state, move)
  else if (move.id === 'talk' || move.id === 'joke') steps = buildTalkSteps(state, move)
  else if (state.mode === 'hollow') steps = buildHollowSteps(state, move)
  else steps = buildAsgoreSteps(state, move)
  const texts = []
  for (const s of steps) {
    if (s.text) texts.push(s.text)
    state = s.apply(state)
  }
  return { state, texts }
}

let pass = 0, fail = 0
function check(name, cond) {
  if (cond) { pass++; console.log('  PASS', name) }
  else { fail++; console.log('  FAIL', name) }
}

// ---- GHOST befriend path ----
console.log('\n[GHOST befriend]')
let g = startGhost()
let r = run(g, { id: 'talk', label: 'TALK' })
g = r.state
check('talk1 says hi', g.ghost.talkStage === 1 && r.texts.includes('GHOST says hi!'))
check('talk1 convo text', r.texts[0] === 'PAOLO tried to strike up a conversation with GHOST!')
r = run(g, { id: 'talk', label: 'TALK' })
g = r.state
check('talk2 stage2 + joke prompt', g.ghost.talkStage === 2 && r.texts.includes('GHOST says he will do it if you can make him laugh.'))
check('talk2 asked text', r.texts[0] === 'PAOLO asked GHOST if he could unlock PROFESSIONAL EXPERIENCE for him.')
r = run(g, { id: 'joke', label: 'JOKE' })
g = r.state
check('joke amused', r.texts.includes('GHOST is amused!'))
check('joke unlock text', r.texts.includes('GHOST unlocked PROFESSIONAL EXPERIENCE for you!'))
check('joke directUnlock victory', g.result === 'victory' && g.directUnlock === true && g.unlockSection === 'professional')

// ---- GHOST talk while hurt ----
console.log('\n[GHOST talk while hurt]')
g = startGhost()
g.enemy.hp = 50
r = run(g, { id: 'talk', label: 'TALK' })
check('hurt talk too scared', r.texts.includes('GHOST is too scared to respond.'))

// ---- GHOST kill chain ----
console.log('\n[GHOST kill chain]')
g = startGhost()
const attack = { id: 'ember', label: 'EMBER', type: 'Fire' }
let killTexts = []
let transitioned = null
for (let i = 1; i <= 6; i++) {
  r = run(g, attack)
  g = r.state
  killTexts.push(...r.texts)
  if (g.transitionTo) { transitioned = g.transitionTo; break }
}
check('ghost survives at 1 on 4th (hp=1)', g.enemy.hp === 1 || transitioned)
check('kill chain transition to asgore', transitioned === 'asgore')
check('kill texts', killTexts.includes('You killed GHOST!') && killTexts.includes('ASGORE witnessed GHOST\'s murder!') && killTexts.includes('...') && killTexts.includes('ASGORE stands in your way!'))
check('ghost dialogue tears present', killTexts.includes('GHOST has tears in his eyes, saying he does not want to die.'))
check('someone is watching after first attack', killTexts.includes('Someone is watching.'))

// ---- GHOST dialogue progression ----
console.log('\n[GHOST dialogue progression]')
g = startGhost()
const seq = []
for (let i = 1; i <= 4; i++) { r = run(g, attack); g = r.state; seq.push(r.texts) }
check('attack1 dialogue minding', seq[0].includes('GHOST is minding his own business.'))
check('attack2 dialogue startled', seq[1].includes('GHOST was startled by your attack.'))
check('attack3 dialogue wondering', seq[2].includes('GHOST is wondering what he did wrong.'))
check('attack4 dialogue does not want to fight', seq[3].includes("GHOST does not want to fight."))

// ---- ASGORE combo + damage ----
console.log('\n[ASGORE combo]')
let a = startAsgore()
const asTexts = []
let playerDmgTaken = []
for (let i = 0; i < 4; i++) {
  const before = a.player.hp
  r = run(a, attack)
  a = r.state
  asTexts.push(...r.texts)
  playerDmgTaken.push(before - a.player.hp)
}
check('asgore pattern WS,WS,prep,strike', asTexts.includes('ASGORE attacks.') && asTexts.includes('ASGORE is preparing for a huge swing.') && asTexts.includes('ASGORE attacks with a huge swing.'))
check('asgore dmg 25,25,0,70', JSON.stringify(playerDmgTaken) === JSON.stringify([25,25,0,70]))
check('asgore takes 10 each', a.enemy.hp === 60)

// ---- ASGORE victory ----
console.log('\n[ASGORE victory]')
a = startAsgore()
// 10 dmg per hit, 100 hp => 10 hits
for (let i = 0; i < 12; i++) { r = run(a, attack); a = r.state; if (a.result) break }
check('asgore defeated -> victory', a.result === 'victory' && a.enemy.hp === 0)
check('asgore victory text', r.texts.includes('You defeated ASGORE!'))

// ---- TALK on hollow ----
console.log('\n[TALK on TWO]')
let h = startHollow()
r = run(h, { id: 'talk', label: 'TALK' })
h = r.state
check('two talk convo', r.texts[0] === 'PAOLO tried to strike up a conversation with TWO!')
check('two unresponsive', r.texts.includes('TWO is unresponsive.'))
check('two still alive', h.enemy.hp === 100 && h.player.hp < 100)

console.log(`\n==== ${pass} passed, ${fail} failed ====`)
process.exit(fail ? 1 : 0)

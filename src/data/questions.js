// ---------------------------------------------------------------------------
// DR. ZANGETSU — quiz question bank
// ---------------------------------------------------------------------------
// Four subjects, each with 3 difficulty levels (1/2/3 == QUESTION #1/#2/#3),
// each level with 5 questions. Every question's options are [A, B, C, "SKIP"]
// and `answer` is the 0-based index of the correct option among A/B/C.
export const ALL_SUBJECTS = ['MATHEMATICS', 'SCIENCE', 'ENGLISH', 'SOCIAL STUDIES']

// HP damage dealt to the enemy per correctly-answered slot (difficulty level).
export const SLOT_DAMAGE = { 1: 3, 2: 9, 3: 13 }

// HP damage dealt to the player on a wrong answer.
export const WRONG_ANSWER_DAMAGE = 25

export const QUESTION_BANK = {
  MATHEMATICS: {
    1: [
      { q: 'What is 7 + 8?', options: ['14', '16', '15', 'SKIP'], answer: 2 },
      { q: 'What is 9 x 3?', options: ['27', '24', '30', 'SKIP'], answer: 0 },
      { q: 'How many sides does a triangle have?', options: ['4', '3', '5', 'SKIP'], answer: 1 },
      { q: 'How many minutes are in an hour?', options: ['30', '100', '60', 'SKIP'], answer: 2 },
      { q: 'What shape has 4 equal sides?', options: ['Triangle', 'Circle', 'Square', 'SKIP'], answer: 2 },
    ],
    2: [
      { q: 'What is 3/4 as a decimal?', options: ['0.34', '0.43', '0.75', 'SKIP'], answer: 2 },
      { q: 'What is 20% of 50?', options: ['5', '15', '10', 'SKIP'], answer: 2 },
      { q: 'What do we call a number that can only be divided by 1 and itself?', options: ['Even number', 'Prime number', 'Composite number', 'SKIP'], answer: 1 },
      { q: 'What is the value of Pi (π), rounded to two decimal places?', options: ['3.14', '2.17', '3.41', 'SKIP'], answer: 0 },
      { q: 'Solve for x: x + 5 = 12', options: ['6', '8', '7', 'SKIP'], answer: 2 },
    ],
    3: [
      { q: 'What famous theorem is used to find the sides of a right triangle?', options: ['Fibonacci Sequence', 'Pythagorean Theorem', 'Law of Cosines', 'SKIP'], answer: 1 },
      { q: 'What is the formula for the area of a circle?', options: ['2πr', 'πr²', 'πd', 'SKIP'], answer: 1 },
      { q: 'In algebra, what is the value of x in 2x + 4 = 12?', options: ['8', '6', '4', 'SKIP'], answer: 2 },
      { q: 'What is the term for the middle value in a set of numbers?', options: ['Mean', 'Mode', 'Median', 'SKIP'], answer: 2 },
      { q: 'What branch of math deals with rates of change, like slopes and areas under curves?', options: ['Geometry', 'Calculus', 'Statistics', 'SKIP'], answer: 1 },
    ],
  },
  SCIENCE: {
    1: [
      { q: 'What do plants need to make their own food?', options: ['Only water', 'Sunlight, water, and air', 'Soil and rocks', 'SKIP'], answer: 1 },
      { q: 'What is the closest planet to the sun?', options: ['Venus', 'Mars', 'Mercury', 'SKIP'], answer: 2 },
      { q: 'What gas do humans need to breathe to survive?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'SKIP'], answer: 0 },
      { q: 'What are the three states of matter?', options: ['Big, medium, small', 'Solid, liquid, gas', 'Hot, cold, warm', 'SKIP'], answer: 1 },
      { q: 'What part of the body pumps blood?', options: ['Lungs', 'Heart', 'Brain', 'SKIP'], answer: 1 },
    ],
    2: [
      { q: 'What is the process where water evaporates, condenses, and falls as rain called?', options: ['Rock cycle', 'Water cycle', 'Carbon cycle', 'SKIP'], answer: 1 },
      { q: 'What do we call organisms that make their own food, like plants?', options: ['Consumers', 'Decomposers', 'Producers', 'SKIP'], answer: 2 },
      { q: 'What is the largest organ in the human body?', options: ['Liver', 'Skin', 'Heart', 'SKIP'], answer: 1 },
      { q: 'What force pulls objects toward the ground?', options: ['Magnetism', 'Friction', 'Gravity', 'SKIP'], answer: 2 },
      { q: 'What process do plants use to convert sunlight into energy?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'SKIP'], answer: 1 },
    ],
    3: [
      { q: 'What is the powerhouse of the cell, responsible for producing energy?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'SKIP'], answer: 2 },
      { q: 'What is the chemical formula for water?', options: ['CO2', 'O2', 'H2O', 'SKIP'], answer: 2 },
      { q: 'What is the basic unit of heredity, passed from parents to offspring?', options: ['Cell', 'Gene', 'Protein', 'SKIP'], answer: 1 },
      { q: 'What scientist is best known for developing the theory of evolution by natural selection?', options: ['Isaac Newton', 'Charles Darwin', 'Albert Einstein', 'SKIP'], answer: 1 },
      { q: 'What is the term for the temperature at which water boils, in Celsius?', options: ['50°C', '90°C', '100°C', 'SKIP'], answer: 2 },
    ],
  },
  ENGLISH: {
    1: [
      { q: 'What is a noun?', options: ['An action word', 'A person, place, or thing', 'A describing word', 'SKIP'], answer: 1 },
      { q: 'What is the opposite of "hot"?', options: ['Cold', 'Wet', 'Warm', 'SKIP'], answer: 0 },
      { q: 'Which word is a verb?', options: ['Table', 'Happy', 'Run', 'SKIP'], answer: 2 },
      { q: 'What punctuation mark ends a question?', options: ['Period', 'Question mark', 'Comma', 'SKIP'], answer: 1 },
      { q: 'What is the plural of "child"?', options: ['Childs', 'Childrens', 'Children', 'SKIP'], answer: 2 },
    ],
    2: [
      { q: 'What is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'SKIP'], answer: 1 },
      { q: 'What is it called when you compare two things using "like" or "as"?', options: ['Metaphor', 'Simile', 'Personification', 'SKIP'], answer: 1 },
      { q: 'What part of a story tells you where and when it happens?', options: ['Plot', 'Setting', 'Theme', 'SKIP'], answer: 1 },
      { q: 'What type of sentence expresses strong emotion, usually ending in an exclamation point?', options: ['Declarative sentence', 'Interrogative sentence', 'Exclamatory sentence', 'SKIP'], answer: 2 },
      { q: 'What word describes an action in a sentence?', options: ['Adjective', 'Verb', 'Preposition', 'SKIP'], answer: 1 },
    ],
    3: [
      { q: 'What is the main argument or claim of an essay called?', options: ['Introduction', 'Thesis statement', 'Conclusion', 'SKIP'], answer: 1 },
      { q: 'What is it called when human traits are given to animals or objects?', options: ['Hyperbole', 'Foreshadowing', 'Personification', 'SKIP'], answer: 2 },
      { q: 'What do we call the main character of a story?', options: ['Antagonist', 'Narrator', 'Protagonist', 'SKIP'], answer: 2 },
      { q: 'What is the term for words that sound the same but have different meanings, like "flower" and "flour"?', options: ['Synonyms', 'Homophones', 'Antonyms', 'SKIP'], answer: 1 },
      { q: 'Who wrote the famous plays "Romeo and Juliet" and "Hamlet"?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'SKIP'], answer: 1 },
    ],
  },
  'SOCIAL STUDIES': {
    1: [
      { q: 'What do we call the place where a community of people live and are governed?', options: ['Forest', 'Ocean', 'Country', 'SKIP'], answer: 2 },
      { q: 'What is a map used for?', options: ['Telling time', 'Showing locations and directions', 'Measuring weight', 'SKIP'], answer: 1 },
      { q: 'Who is the leader of a country usually called?', options: ['Teacher', 'Farmer', 'President or Prime Minister', 'SKIP'], answer: 2 },
      { q: 'What do we call money used to buy things?', options: ['Currency', 'Recipe', 'Schedule', 'SKIP'], answer: 0 },
      { q: 'What are the four cardinal directions?', options: ['Up, down, left, right', 'North, South, East, West', 'Hot, cold, wet, dry', 'SKIP'], answer: 1 },
    ],
    2: [
      { q: 'How many continents are there on Earth?', options: ['5', '7', '6', 'SKIP'], answer: 1 },
      { q: 'What ancient civilization is famous for building the pyramids?', options: ['Greece', 'Rome', 'Egypt', 'SKIP'], answer: 2 },
      { q: 'What do we call natural materials from the Earth used by people, like water and trees?', options: ['Manufactured goods', 'Natural resources', 'Imports', 'SKIP'], answer: 1 },
      { q: 'What ocean is the largest in the world?', options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'SKIP'], answer: 2 },
      { q: 'What is the imaginary line that divides the Earth into Northern and Southern halves called?', options: ['Prime Meridian', 'Equator', 'Tropic of Cancer', 'SKIP'], answer: 1 },
    ],
    3: [
      { q: "What document declared the United States' independence from Britain in 1776?", options: ['The Constitution', 'The Declaration of Independence', 'The Bill of Rights', 'SKIP'], answer: 1 },
      { q: 'What was the primary cause that triggered World War I?', options: ['The Great Depression', 'The assassination of Archduke Franz Ferdinand', 'The invention of nuclear weapons', 'SKIP'], answer: 1 },
      { q: 'What economic system is based on private ownership and free markets?', options: ['Communism', 'Feudalism', 'Capitalism', 'SKIP'], answer: 2 },
      { q: 'What is a government run by the people through elected officials called?', options: ['Monarchy', 'Dictatorship', 'Democracy', 'SKIP'], answer: 2 },
      { q: 'What war was fought between the northern and southern United States from 1861-1865?', options: ['The Revolutionary War', 'World War I', 'The Civil War', 'SKIP'], answer: 2 },
    ],
  },
}

// Records a question index as already-shown for a (subject, level) pair so the
// enemy never re-asks it within the same question slot.
export function addAsked(asked, subject, level, index) {
  const key = `${subject}|${level}`
  const arr = asked[key] || []
  return { ...asked, [key]: arr.includes(index) ? arr : [...arr, index] }
}

// Picks a not-yet-shown question at random; if every question in the level has
// been shown, it falls back to any question in that level.
export function pickQuestion(subject, level, asked) {
  const bank = QUESTION_BANK[subject][level]
  const key = `${subject}|${level}`
  const used = asked[key] || []
  const all = bank.map((_, i) => i)
  const available = all.filter((i) => !used.includes(i))
  const pool = available.length > 0 ? available : all
  const index = pool[Math.floor(Math.random() * pool.length)]
  return { index, question: { index, text: bank[index].q, options: bank[index].options, correctIndex: bank[index].answer } }
}

const CONSTANTS = {
  pos1: 30,
  pos2: 150,
  pos3: 270,
  pos4: 390,
  pos5: 510,
}

export const bridge_2 = [
  // bridge2
  { kill: true },
  { kill: true },
  // i know its hard
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 2, chain: true },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 2, hold: 2, chain: true },
  { tempo: 1, hold: 0, chain: false, rest: true },

  // for you
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false },
  { kill: true },
  { x: CONSTANTS.pos4, y: 0, pos: 3, tempo: 1, hold: 0, chain: false },
  
  // but its not far
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 1, hold: 2, chain: true },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 1, hold: 2, chain: true },
  { tempo: 2, hold: 0, chain: false, rest: true },

  //going sick in the head
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false },
  { kill: true },
  { x: CONSTANTS.pos4, y: 0, pos: 3, tempo: 1, hold: 2, chain: true },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 1, hold: 2, chain: true },
  { tempo: 1, hold: 0, chain: false, rest: true },

  //trying to get you there
  { x: CONSTANTS.pos4, y: 0, pos: 3, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 2, hold: 0, chain: false },
  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 2, hold: 0, chain: false },
  { kill: true },
  { x: CONSTANTS.pos4, y: 0, pos: 3, tempo: 1, hold: 2, chain: true },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 1, hold: 2, chain: true },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 1, hold: 8, chain: true },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 1, hold: 8, chain: true },
  { tempo: 6, hold: 0, chain: false, rest: true },
  // and i know its hard

  // but its not fair
  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 1, hold: 8, chain: true },
  { x: CONSTANTS.pos4, y: 0, pos: 3, tempo: 1, hold: 8, chain: true },
  { tempo: 6, hold: 0, chain: false, rest: true },

  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 1, hold: 6, chain: true },
  { x: CONSTANTS.pos5, y: 0, pos: 4, tempo: 1, hold: 6, chain: true },
  { tempo: 4, hold: 0, chain: false, rest: true },

  // its not fair
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 1, hold: 4, chain: true },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 1, hold: 4, chain: true },
  { tempo: 3, hold: 0, chain: false, rest: true },

]
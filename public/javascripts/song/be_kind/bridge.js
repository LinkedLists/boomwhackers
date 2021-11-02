const CONSTANTS = {
  pos1: 30,
  pos2: 150,
  pos3: 270,
  pos4: 390,
  pos5: 510,
}

export const bridge = [
  // bridge

  { x: CONSTANTS.pos2, y: 0, pos: 1, tempo: 1, hold: 8, chain: true },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 1, hold: 8, chain: true },
  { tempo: 6, hold: 0, chain: false, rest: true },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 1, hold: 8, chain: true },
  { x: CONSTANTS.pos4, y: 0, pos: 3, tempo: 1, hold: 8, chain: true },
  { tempo: 6, hold: 0, chain: false, rest: true },
  { x: CONSTANTS.pos1, y: 0, pos: 0, tempo: 1, hold: 8, chain: true },
  { x: CONSTANTS.pos3, y: 0, pos: 2, tempo: 1, hold: 8, chain: true },

  { tempo: 10, hold: 0, chain: false, rest: true },
]
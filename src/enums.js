export const Actions = Object.freeze({
  CHANGE_SIZE: Symbol('CHANGE_SIZE'),
  CHANGE_SMILE: Symbol('CHANGE_SMILE'),
  CHEAT: Symbol('CHEAT'),
  CLEAR: Symbol('CLEAR'),
  HIGHLIGHT: Symbol('HIGHLIGHT'),
  INCREMENT: Symbol('INCREMENT'),
  LOAD_END: Symbol('LOAD_END'),
  LOAD_FAIL: Symbol('LOAD_FAIL'),
  LOAD_START: Symbol('LOAD_START'),
  LOOP: Symbol('LOOP'),
  LOSE_GAME: Symbol('LOSE_GAME'),
  RESET: Symbol('RESET'),
  REVEAL_CELL: Symbol('REVEAL_CELL'),
  START: Symbol('START'),
  STEP: Symbol('STEP'),
  STOP: Symbol('STOP'),
  TEST: Symbol('TEST'),
  TOGGLE_ACTIVE: Symbol('TOGGLE_ACTIVE'),
  TOGGLE_FLAG: Symbol('TOGGLE_FLAG'),
  TOGGLE_PEEK: Symbol('TOGGLE_PEEK'),
});

export const BoardSizes = Object.freeze({
  BEGINNER: Symbol('BEGINNER'),
  CUSTOM: Symbol('CUSTOM'),
  EXPERT: Symbol('EXPERT'),
  INTERMEDIATE: Symbol('INTERMEDIATE'),
});

export const Mines = Object.freeze({
  MINE_FALSE: -3,
  MINE_EXPLODED: -2,
  MINE: -1,
});

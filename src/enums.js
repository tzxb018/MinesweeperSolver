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
  REPORT_ERROR_END: Symbol('REPORT_ERROR_END'),
  REPORT_ERROR_START: Symbol('REPORT_ERROR_START'),
  REPORT_ERROR_TIMEOUT: Symbol('REPORT_ERROR_TIMEOUT'),
  RESET: Symbol('RESET'),
  REVEAL_CELL: Symbol('REVEAL_CELL'),
  START: Symbol('START'),
  STEP: Symbol('STEP'),
  STOP: Symbol('STOP'),
  TEST_END: Symbol('TEST_END'),
  TEST_START: Symbol('TEST_START'),
  TOGGLE_ACTIVE: Symbol('TOGGLE_ACTIVE'),
  TOGGLE_FLAG: Symbol('TOGGLE_FLAG'),
  TOGGLE_PEEK: Symbol('TOGGLE_PEEK'),
});

export const BoardSizes = Object.freeze({
  BEGINNER: Symbol('BEGINNER'),
  CUSTOM: 'CUSTOM',                       // cannot be a symbol so that web workers can properly serialize it
  EXPERT: Symbol('EXPERT'),
  INTERMEDIATE: Symbol('INTERMEDIATE'),
});

export const HistoryLogStyles = Object.freeze({
  DEFAULT: 'log',
  GREEN: 'green',
  RED: 'red',
});

export const HistoryLogSymbols = Object.freeze({
  FLAG: 'FLAG',
});

export const Mines = Object.freeze({
  MINE_FALSE: -3,
  MINE_EXPLODED: -2,
  MINE: -1,
});

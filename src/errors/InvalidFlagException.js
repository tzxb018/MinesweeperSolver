export default class InvalidFlagException {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  toString() {
    return `Invalid number of flags around (${this.row}, ${this.col})`;
  }
}

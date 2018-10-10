import React from 'react';

export default class HistoryLog {
  /**
   * @constructor
   * @param {string} message main message that describes the log
   * @param {string} color the log style to apply
   * @param {boolean} canJump true if the log can be used to jump back in time, false otherwise
   * @param {object[]} [cells] list of cells to be highlighted upon hovering over this history log
   * @param {number} cells[].row row index of cell
   * @param {number} cells[].col col index of cell
   */
  constructor(message, style, canJump, cells = []) {
    this._message = message;
    this._style = style;
    this._numJumps = 0;
    this._canJump = canJump;
    this._cellHighlight = cells;
    this._details = [];
  }

  /* Plain Getters */
  get canJump() { return this._canJump; }
  get hasHighlight() { return this._cellHighlight.length > 0; }
  get message() { return this._message; }

  /**
   * Sets the cells to be highlighted upon hovering over this history log.
   * @param {Object[]} cells list of cells to be highlighted
   * @param {number} cells[].row row index of cell
   * @param {number} cells[].col col index of cell
   */
  set cellHighlight(cells) {
    this._cellHighlight = cells.slice();
  }

  /**
   * Updates the number of jumps this history log corresponds to if it can jump.
   * @param {number} numJumps number of jumps back in time
   */
  set numJumps(numJumps) {
    if (this._canJump) {
      this._numJumps = numJumps;
    }
  }

  /**
   * Adds the given message as a detail of the log.
   * @param {string} message detail message to add to the log
   * @param {boolean} [override] true to override default tabbing
   */
  addDetail(message, override = false) {
    if (override) {
      this._details.push(message);
    } else {
      this._details.push(`\n\t${message}`);
    }
  }

  /**
   * Clears the details of the log.
   */
  clearDetails() {
    this._details = [];
  }

  /**
   * Clears the cell highlight of the log.
   */
  clearHighlight() {
    this._cellHighlight = [];
  }

  /**
   * Creates an HTML div element with the history log information.
   * @param {number} key unique key
   * @returns {HTMLDivElement} history log jsx element
   */
  display(key) {
    return (
      <div className={HistoryLog._styles[this._style]}
        key={key}
        onClick={this._canJump ? () => HistoryLog._clickHandler(this._numJumps) : null}
        onMouseEnter={this.hasHighlight ? () => HistoryLog._highlighter(this._cellHighlight) : null}
        onMouseLeave={this.hasHighlight ? () => HistoryLog._clearer() : null}
      >
        {this._message}
        {this._details}
      </div>
    );
  }

  /**
   * Sets the cell highlight clearing function.
   * @param {function} clearer function that clears previous cell highlights
   */
  static clearer(clearer) {
    HistoryLog._clearer = () => clearer();
  }

  /**
   * Sets the click handler of the history logs.
   * @param {function} clickHandler the click handler for the history logs
   */
  static clickHandler(clickHandler) {
    HistoryLog._clickHandler = key => clickHandler(key);
  }

  /**
   * Sets the cell highlighting function.
   * @param {function} highlighter function that highlights the given cells
   */
  static highlighter(highlighter) {
    HistoryLog._highlighter = cells => highlighter(cells);
  }

  /**
   * Defines the stylesheet for all history logs.
   * @param {StyleSheet} stylesheet the styles to use for the history log
   * @param {string} stylesheet.log the default style for a log message
   */
  static styles(stylesheet) {
    HistoryLog._styles = stylesheet;
  }
}

HistoryLog._styles = null;
HistoryLog._clickHandler = () => null;
HistoryLog._highlighter = () => null;
HistoryLog._clearer = () => null;

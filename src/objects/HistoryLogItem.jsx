import React from 'react';

const flag = key => (
  <svg height="10" width="8" key={key}>
    <polygon key="flag" points="5,0 4,0 0,2 0,3 4,5 5,5" style={{ fill: 'red' }} />
    <polygon key="pole" points="5,5 4,5 4,7 0,8 0,10 8,10 8,8 5,7" style={{ fill: 'black' }} />
  </svg>
);

export default class HistoryLogItem {
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
  get numJumps() { return this._numJumps; }

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
    let message = this._message;
    let i = 0;
    if (message.includes('[flag]')) {
      const newMessage = message.replace('flag]', '');
      message = [newMessage, flag(i), ']'];
      i++;
    }

    const details = this._details.slice();
    let offset = 0;
    details.slice().forEach((detail, index) => {
      if (detail.includes('[flag]')) {
        const newDetail = detail.replace('flag]', '');
        details.splice(index + offset, 1, newDetail, flag(i), ']');
        offset += 2;
        i++;
      }
    });

    return (
      <div className={HistoryLogItem._styles[this._style]}
        key={key}
        onClick={this._canJump ? () => HistoryLogItem._clickHandler(this._numJumps) : null}
        onMouseEnter={this.hasHighlight ? () => HistoryLogItem._highlighter(this._cellHighlight) : null}
        onMouseLeave={this.hasHighlight ? () => HistoryLogItem._clearer() : null}
      >
        {message}
        {details}
      </div>
    );
  }

  /**
   * Sets the cell highlight clearing function.
   * @param {function} clearer function that clears previous cell highlights
   */
  static clearer(clearer) {
    HistoryLogItem._clearer = () => clearer();
  }

  /**
   * Sets the click handler of the history logs.
   * @param {function} clickHandler the click handler for the history logs
   */
  static clickHandler(clickHandler) {
    HistoryLogItem._clickHandler = numJumps => clickHandler(numJumps);
  }

  /**
   * Sets the cell highlighting function.
   * @param {function} highlighter function that highlights the given cells
   */
  static highlighter(highlighter) {
    HistoryLogItem._highlighter = cells => highlighter(cells);
  }

  /**
   * Defines the stylesheet for all history logs.
   * @param {StyleSheet} stylesheet the styles to use for the history log
   * @param {string} stylesheet.log the default style for a log message
   */
  static styles(stylesheet) {
    HistoryLogItem._styles = stylesheet;
  }
}

HistoryLogItem._styles = null;
HistoryLogItem._clickHandler = () => null;
HistoryLogItem._highlighter = () => null;
HistoryLogItem._clearer = () => null;

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var Actions = exports.Actions = Object.freeze({
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
  REPORT_ERROR_TOGGLE: Symbol('REPORT_ERROR_TOGGLE'),
  RESET: Symbol('RESET'),
  REVEAL_CELL: Symbol('REVEAL_CELL'),
  START: Symbol('START'),
  STEP: Symbol('STEP'),
  STOP: Symbol('STOP'),
  TEST_END: Symbol('TEST_END'),
  TEST_START: Symbol('TEST_START'),
  TOGGLE_ACTIVE: Symbol('TOGGLE_ACTIVE'),
  TOGGLE_FLAG: Symbol('TOGGLE_FLAG'),
  TOGGLE_PEEK: Symbol('TOGGLE_PEEK') });


var Algorithms = exports.Algorithms = Object.freeze({
  BC: 'BC',
  BT: 'BT',
  FC: 'FC',
  MAC: 'MAC',
  mWC: 'mWC',
  mWC1: '1wC',
  mWC2: '2wC',
  mWC3: '3wC',
  mWC4: '4wC',
  STR2: 'STR2',
  Unary: 'Unary' });


var BoardSizes = exports.BoardSizes = Object.freeze({
  BEGINNER: Symbol('BEGINNER'),
  CUSTOM: 'CUSTOM', // cannot be a symbol so that web workers can properly serialize it
  EXPERT: Symbol('EXPERT'),
  INTERMEDIATE: Symbol('INTERMEDIATE') });


var HistoryLogStyles = exports.HistoryLogStyles = Object.freeze({
  DEFAULT: 'log',
  GREEN: 'green',
  RED: 'red' });


var HistoryLogSymbols = exports.HistoryLogSymbols = Object.freeze({
  FLAG: 'FLAG' });


var Mines = exports.Mines = Object.freeze({
  MINE_FALSE: -3,
  MINE_EXPLODED: -2,
  MINE: -1 });


var Smiles = exports.Smiles = Object.freeze({
  LOST: Symbol('LOST'),
  PRESSED: Symbol('PRESSED'),
  SCARED: Symbol('SCARED'),
  SMILE: Symbol('SMILE'),
  WON: Symbol('WON') });

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _react = __webpack_require__(20);var _react2 = _interopRequireDefault(_react);
var _enums = __webpack_require__(0);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

var flag = function flag(key) {return (
    _react2.default.createElement('svg', { height: '10', width: '8', key: key },
      _react2.default.createElement('polygon', { key: 'flag', points: '5,0 4,0 0,2 0,3 4,5 5,5', style: { fill: 'red' } }),
      _react2.default.createElement('polygon', { key: 'pole', points: '5,5 4,5 4,7 0,8 0,10 8,10 8,8 5,7', style: { fill: 'black' } })));};var



HistoryLogItem = function () {
  /**
                               * @constructor
                               * @param {string} message main message that describes the log
                               * @param {string} color the log style to apply
                               * @param {boolean} canJump true if the log can be used to jump back in time, false otherwise
                               * @param {object[]} [cells] list of cells to be highlighted upon hovering over this history log
                               * @param {number} cells[].row row index of cell
                               * @param {number} cells[].col col index of cell
                               */
  function HistoryLogItem(message, style, canJump) {var cells = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];_classCallCheck(this, HistoryLogItem);
    this._message = message;
    this._style = style;
    this._numJumps = 0;
    this._canJump = canJump;
    this._cellHighlight = cells;
    this._details = [];
  }

  /* Plain Getters */_createClass(HistoryLogItem, [{ key: 'addDetail',

























    /**
                                                                        * Adds the given message as a detail of the log.
                                                                        * @param {string} message detail message to add to the log
                                                                        * @param {boolean} [override] true to override default tabbing
                                                                        */value: function addDetail(
    message) {var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (override) {
        this._details.push(message);
      } else {
        this._details.push('\n\t' + message);
      }
    }

    /**
       * Clears the details of the log.
       */ }, { key: 'clearDetails', value: function clearDetails()
    {
      this._details = [];
    }

    /**
       * Clears the cell highlight of the log.
       */ }, { key: 'clearHighlight', value: function clearHighlight()
    {
      this._cellHighlight = [];
    }

    /**
       * Creates an HTML div element with the history log information.
       * @param {number} key unique key
       * @returns {HTMLDivElement} history log jsx element
       */ }, { key: 'display', value: function display(
    key) {var _this = this;
      var message = this._message;
      var i = 0;
      if (message.includes(_enums.HistoryLogSymbols.FLAG)) {
        var newMessage = message.replace(_enums.HistoryLogSymbols.FLAG + ']', '');
        message = [newMessage, flag(i), ']'];
        i++;
      }

      var details = this._details.slice();
      var offset = 0;
      details.slice().forEach(function (detail, index) {
        if (detail.includes(_enums.HistoryLogSymbols.FLAG)) {
          var newDetail = detail.replace(_enums.HistoryLogSymbols.FLAG + ']', '');
          details.splice(index + offset, 1, newDetail, flag(i), ']');
          offset += 2;
          i++;
        }
      });

      return (
        _react2.default.createElement('div', { className: HistoryLogItem._styles[this._style],
            key: key,
            onClick: this._canJump ? function () {return HistoryLogItem._clickHandler(_this._numJumps);} : null,
            onMouseEnter: this.hasHighlight ? function () {return HistoryLogItem._highlighter(_this._cellHighlight);} : null,
            onMouseLeave: this.hasHighlight ? function () {return HistoryLogItem._clearer();} : null },

          message,
          details));


    }

    /**
       * Sets the cell highlight clearing function.
       * @param {function} clearer function that clears previous cell highlights
       */ }, { key: 'canJump', get: function get() {return this._canJump;} }, { key: 'hasHighlight', get: function get() {return this._cellHighlight.length > 0;} }, { key: 'message', get: function get() {return this._message;} }, { key: 'numJumps', get: function get() {return this._numJumps;} /**
                                                                                                                                                                                                                                                                                                       * Sets the cells to be highlighted upon hovering over this history log.
                                                                                                                                                                                                                                                                                                       * @param {Object[]} cells list of cells to be highlighted
                                                                                                                                                                                                                                                                                                       * @param {number} cells[].row row index of cell
                                                                                                                                                                                                                                                                                                       * @param {number} cells[].col col index of cell
                                                                                                                                                                                                                                                                                                       */, /**
                                                                                                                                                                                                                                                                                                            * Updates the number of jumps this history log corresponds to if it can jump.
                                                                                                                                                                                                                                                                                                            * @param {number} numJumps number of jumps back in time
                                                                                                                                                                                                                                                                                                            */set: function set(numJumps) {if (this._canJump) {this._numJumps = numJumps;}} }, { key: 'cellHighlight', set: function set(cells) {this._cellHighlight = cells.slice();} }], [{ key: 'clearer', value: function clearer(_clearer) {HistoryLogItem._clearer = function () {return _clearer();};} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Sets the click handler of the history logs.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @param {function} clickHandler the click handler for the history logs
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */ }, { key: 'clickHandler', value: function clickHandler(_clickHandler) {HistoryLogItem._clickHandler = function (numJumps) {return _clickHandler(numJumps);};}

    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * Sets the cell highlighting function.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @param {function} highlighter function that highlights the given cells
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */ }, { key: 'highlighter', value: function highlighter(
    _highlighter) {
      HistoryLogItem._highlighter = function (cells) {return _highlighter(cells);};
    }

    /**
       * Defines the stylesheet for all history logs.
       * @param {StyleSheet} stylesheet the styles to use for the history log
       * @param {string} stylesheet.log the default style for a log message
       */ }, { key: 'styles', value: function styles(
    stylesheet) {
      HistoryLogItem._styles = stylesheet;
    } }]);return HistoryLogItem;}();exports.default = HistoryLogItem;


HistoryLogItem._styles = null;
HistoryLogItem._clickHandler = function () {return null;};
HistoryLogItem._highlighter = function () {return null;};
HistoryLogItem._clearer = function () {return null;};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                       * Intersects the domains of two sets. Outputing a new set of the intersection.
                                                                                                                                                                                                                                                                       * @param {Set<*>} set1
                                                                                                                                                                                                                                                                       * @param {Set<*>} set2
                                                                                                                                                                                                                                                                       * @returns {Set<*>} new set of the intersect of set1 and set2
                                                                                                                                                                                                                                                                       */
var intersect = exports.intersect = function intersect(set1, set2) {return new Set([].concat(_toConsumableArray(set1)).filter(function (value) {return set2.has(value);}));};


/**
                                                                                                                                                                               * Gets the basic viable domains of each variable.
                                                                                                                                                                               * @param {Constraint[]} constraints array of Constraints
                                                                                                                                                                               * @returns {Map<number, Set<boolean>>} map containing the allowed domain set for each variable
                                                                                                                                                                               */
var getDomains = exports.getDomains = function getDomains(constraints) {
  var domains = new Map();
  constraints.forEach(function (constraint) {
    var newDomains = constraint.supportedDomains();
    if (newDomains) {
      newDomains.forEach(function (values, key) {
        if (!domains.has(key)) {
          domains.set(key, new Set([].concat(_toConsumableArray(values))));
        } else {
          domains.set(key, intersect(domains.get(key), values));
        }
      });
    } else {
      constraint.scope.forEach(function (key) {return domains.set(key, new Set());});
    }
  });
  return domains;
};

/**
    * Formats the given number with commas separating each three digits.
    * @param {number} num number to format with commas
    * @param {string} formatted number
    */
var numberWithCommas = exports.numberWithCommas = function numberWithCommas(num) {return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');};

/**
                                                                                                                                                  * Revises the constraints of the given edge by enforcing pairwise consistency. Pairwise consistency means every tuple
                                                                                                                                                  * has a supporting tuple in the other constraint of the edge.
                                                                                                                                                  * @param {Constraint[]} edge list of constraints that form the edge
                                                                                                                                                  * @param {number[]} edge.scope list of variables common to the pair
                                                                                                                                                  * @param {Object} [diagnostics] execution metrics object
                                                                                                                                                  * @param {number} diagnostics.tuplesKilled number of tuples killed
                                                                                                                                                  * @returns {Constraint[]} list of Constraints that were revised, undefined if one of the constraints of the edge is
                                                                                                                                                  * dead
                                                                                                                                                  */
var reviseEdge = exports.reviseEdge = function reviseEdge(edge, diagnostics) {
  var isConsistent = true;
  // regionalize each constraint and find the common regions
  var regionMaps = edge.map(function (constraint) {return constraint.regionalize(edge.scope);});
  var commonRegions = [].concat(_toConsumableArray(regionMaps[0].keys())).filter(function (domain) {return (
      regionMaps.every(function (regionMap) {return regionMap.has(domain);}));});

  // revise each constraint's tuples based on the common regions
  var revisedConstraints = [];
  regionMaps.forEach(function (regionMap, index) {
    var revised = false;
    regionMap.forEach(function (tuples, domain) {
      if (!commonRegions.includes(domain)) {
        tuples.forEach(function (id) {return edge[index].kill(id);});
        if (diagnostics) {
          diagnostics.tuplesKilled += tuples.length;
        }
        revised = true;
      }
    });
    if (revised) {
      if (!edge[index].isConsistent) {
        isConsistent = false;
      } else {
        revisedConstraints.push(edge[index]);
      }
    }
  });

  return isConsistent ? revisedConstraints : undefined;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * Makes solution based on arrangement and position.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @param {boolean} value true if placing mines, false if placing open cells
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @param {number} length number of variables in the solution
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @param {number} position index to start arrangement
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @param {boolean[]} arrangement pattern of values to be placed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @returns {boolean[]} a solution according to spec
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */
var makeSolution = function makeSolution(value, length, position, arrangement) {
  var solution = [];

  // pad arrangement with default values on either end as necessary
  while (solution.length < length) {
    if (solution.length < position) {
      solution.push(!value);
    } else if (solution.length > position) {
      solution.push(!value);
    } else {
      solution = solution.concat(arrangement);
    }
  }

  return solution;
};

/**
    * Generates all the possible configurations of mines given the number of mines and variables.
    * @param {number} numMines number of mines to be placed
    * @param {number} numVariables number of variables to spread the mines across
    * @returns {boolean[][]} list of possible mine configurations
    */
var generatePossibilities = function generatePossibilities(numMines, numVariables) {
  var value = void 0;
  var numValues = void 0;
  // if there are more mines to be placed than open spaces left over, switch to placing open spaces rather than mines
  if (numMines > numVariables / 2) {
    value = false;
    numValues = numVariables - numMines;
  } else {
    value = true;
    numValues = numMines;
  }
  var possibilities = [];

  // if there is only one possibility or no possibilities, just stop now
  if (numValues === 0) {
    var solution = [];
    for (var i = 0; i < numVariables; i++) {
      solution.push(!value);
    }
    possibilities.push(solution);
    return possibilities;
  }
  if (numMines < 0) {
    return possibilities;
  }

  // set up
  var position = 0;
  var arrangement = [];
  for (var _i = 0; _i < numValues; _i++) {
    arrangement.push(value);
  }
  var gap1 = 0;
  var gap2 = 0;
  var isDone = false;

  // iterate until there are no more valid solutions
  while (!isDone) {
    // make all possible solutions with given arrangement of values
    while (position + arrangement.length <= numVariables) {
      possibilities.push(makeSolution(value, numVariables, position, arrangement));
      position++;
    }
    // adjust the arrangement if possible
    if (arrangement.length >= numVariables) {
      if (gap1 === 0) {
        if (gap2 === 0) {
          isDone = true;
        } else {
          if (numValues < 4) {
            isDone = true;
          } else {
            arrangement.splice(2, gap2);
            arrangement.splice(3, 0, !value);
            gap2 = 0;
          }
        }
      } else {
        if (numValues < 3) {
          isDone = true;
        } else {
          gap2++;
          arrangement.splice(1, gap1);
          arrangement.splice(2, 0, !value);
          gap1 = 0;
        }
      }
    } else {
      if (numValues < 2) {
        isDone = true;
      } else {
        gap1++;
        arrangement.splice(1, 0, !value);
      }
    }
    // reset the position
    position = 0;
  }

  return possibilities;
};var

Constraint = function () {
  /**
                           * @constructor
                           * @param {Object[]} variables list of variables in the scope of the constraint
                           * @param {number} variables[].key unique variable identifier
                           * @param {number} variables[].row cell row of the variable
                           * @param {number} variables[].col cell column of the variable
                           * @param {boolean} variables[].isFlagged true if the variable is flagged as a mine, false otherwise
                           * @param {number} row cell row of the constraint
                           * @param {number} col cell column of the constraint
                           * @param {number} numMines number of mines the constraint allows for
                           */
  function Constraint(variables, row, col, numMines) {_classCallCheck(this, Constraint);
    this._row = row;
    this._col = col;
    this._numMines = numMines;
    this._variables = variables;
    this._scope = variables.map(function (variable) {return variable.key;});
    this._scope.sort(function (a, b) {return a - b;});

    // calculate all possible configurations of mines and store them as tuples
    this._tuples = generatePossibilities(numMines, this._scope.length);
    this._tuples.forEach(function (tuple, index) {
      tuple.alive = true;
      tuple.id = index;
    });
    this._numAlive = this._tuples.length;
  }

  /* Plain Getters */_createClass(Constraint, [{ key: 'supportedDomains',
















    /**
                                                                           * Gets the domains of the variables in scope that are supported by at least one alive tuple. Can also take in specs
                                                                           * to enforce on the tuples, without killing them, before the supported domains are determined.
                                                                           * @param {Object[]} [specs] domain specifications to check against the tuples
                                                                           * @param {number} specs[].key variable key
                                                                           * @param {boolean} specs[].value variable domain restriction
                                                                           * @returns {Map<number, Set<boolean>>} variable keys mapped to their supported domains, undefined if no domains up to
                                                                           * spec or if no tuples alive
                                                                           */value: function supportedDomains(
    specs) {var _this = this;
      // map and filter the specs if there are any
      var specIndex = [];
      if (specs) {
        specIndex = specs.map(function (variable) {return {
            index: _this._scope.indexOf(variable.key),
            value: variable.value };});

        specIndex = specIndex.filter(function (variable) {return variable.index !== -1;});
      }

      // find the supported domains
      var domains = new Map();
      this.tuples.forEach(function (tuple) {
        if (specIndex.every(function (variable) {return tuple[variable.index] === variable.value;})) {
          tuple.forEach(function (value, index) {
            var key = _this._scope[index];
            if (!domains.has(key)) {
              domains.set(key, new Set());
            }
            domains.get(key).add(value);
          });
        }
      });

      if (domains.size === 0) {
        return undefined;
      }
      return domains;
    }

    /**
       * Gets only the restrictive domains, those with a size of one, of the variables in scope that are supported by at
       * least one alive tuple. Can also take in specs to enforce on the tuples, without killing them, before the supported
       * domains are determined. Formats them as specifications.
       * @param {Object[]} [specs] domain specifications to check against the tuples
       * @param {number} specs[].key variable key
       * @param {boolean} specs[].value variable domain restriction
       * @returns {{key: number, value: boolean}[]} list of domain specifications, empty array if no restrictions, undefined
       * if no domains up to spec or if no tuples alive
       */ }, { key: 'supportedSpecs', value: function supportedSpecs(
    specs) {
      var domains = this.supportedDomains(specs);
      if (!domains) {
        return undefined;
      }
      var newSpecs = [];
      domains.forEach(function (values, key) {
        if (values.size === 1) {
          newSpecs.push({
            key: key,
            value: [].concat(_toConsumableArray(values))[0] });

        }
      });
      return newSpecs;
    }

    /**
       * Returns whether or not the given variable is in the scope of the constraint.
       * @param {number} key unique variable key
       * @returns {boolean} true if in scope, false otherwise
       */ }, { key: 'isInScope', value: function isInScope(
    key) {return this._scope.includes(key);}

    /**
                                              * Returns whether or not the constraint supports the given specifications.
                                              * @param {Object[]} specs domain specifications to check against the tuples
                                              * @param {number} specs[].key variable key
                                              * @param {boolean} specs[].value variable domain restriction
                                              * @returns {boolean} true if at least one constraint supports the specs, false otherwise
                                              */ }, { key: 'isSupported', value: function isSupported(
    specs) {var _this2 = this;
      var specIndex = specs.map(function (variable) {return {
          index: _this2._scope.indexOf(variable.key),
          value: variable.value };});

      specIndex = specIndex.filter(function (variable) {return variable.index !== -1;});
      return this.tuples.some(function (tuple) {return specIndex.every(function (variable) {return tuple[variable.index] === variable.value;});});
    }

    /**
       * Ensures the tuple with the given id is dead. Updates numAlive if necessary.
       * @param {number} id id of the tuple to be killed
       * @returns {boolean[][]} new set of alive tuples
       */ }, { key: 'kill', value: function kill(
    id) {
      var tupleToKill = this._tuples[id];
      if (tupleToKill) {
        if (tupleToKill.alive) {
          this._numAlive--;
          tupleToKill.alive = false;
        }
      }
      return this.tuples;
    }

    /**
       * Ensures all tuples are dead, making the constraint inconsistent such that this.isConsistent is false.
       */ }, { key: 'killAll', value: function killAll()
    {
      this._tuples.forEach(function (tuple) {tuple.alive = false;});
      this._numAlive = 0;
    }

    /**
       * Ensures any tuples that don't fulfill the given domain specifications are dead. Updates numAlive if necessary. If
       * specs is undefined, behaves just as killAll().
       * @param {Object[]} specs domain specifications to enforce on the tuples
       * @param {number} specs[].key variable key
       * @param {boolean} specs[].value variable domain restriction
       * @returns {boolean[][]} new set of alive tuples
       */ }, { key: 'killIf', value: function killIf(
    specs) {var _this3 = this;
      if (specs) {
        specs.forEach(function (restriction) {
          var index = _this3._scope.indexOf(restriction.key);
          if (index >= 0) {
            _this3.tuples.forEach(function (tuple) {
              if (tuple[index] !== restriction.value) {
                _this3._numAlive--;
                tuple.alive = false;
              }
            });
          }
        });
      } else {
        this.killAll();
      }
      return this.tuples;
    }

    /**
       * Finds the list of supported domain combinations of the given variable pair.
       * @param {number[]} pair variable key pairs
       * @returns {boolean[][]} list of supported domain combinations
       */ }, { key: 'pairDomain', value: function pairDomain(
    pair) {var _this4 = this;
      var values = [];
      var columns = pair.map(function (key) {return _this4._scope.indexOf(key);});
      this.tuples.forEach(function (tuple) {return values.push(columns.map(function (index) {return tuple[index];}));});
      // filter out any duplicates
      values.forEach(function (value, index) {
        values.slice(index + 1).forEach(function (other) {
          if (value.every(function (element, i) {return element === other[i];})) {
            values.splice(values.indexOf(other), 1);
          }
        });
      });
    }

    /**
       * Finds the "regions" of tuples that are identical about the given pair. Tuples are in the same region if they have
       * the same values for all variables of the pair.
       * @param {number[]} pair list of variable keys forming a pair
       * @returns {Map<number, number[]>} pair domain possibilities mapped to their dependent tuples' ids
       */ }, { key: 'regionalize', value: function regionalize(
    pair) {var _this5 = this;
      var regions = new Map();
      var index = pair.map(function (key) {return _this5._scope.indexOf(key);});
      this.tuples.forEach(function (tuple) {
        var domain = index.map(function (i) {return tuple[i];});
        var domainKey = '';
        domain.forEach(function (b) {
          if (b) {
            domainKey += '1';
          } else {
            domainKey += '0';
          }
        });
        domainKey = parseInt(domainKey, 2);
        if (!regions.has(domainKey)) {
          regions.set(domainKey, []);
        }
        regions.get(domainKey).push(tuple.id);
      });
      return regions;
    }

    /**
       * Resets the constraint to its initial state.
       * @returns {boolean[][]} new set of alive tuples
       */ }, { key: 'reset', value: function reset()
    {
      this._tuples.forEach(function (tuple) {tuple.alive = true;});
      this._numAlive = this._tuples.length;
      return this._tuples;
    }

    /**
       * Ensures the tuple with the given id is alive. Updates numAlive if necessary.
       * @param {number} id id of tuple to be revived
       * @returns {boolean[][]} new set of alive tuples
       */ }, { key: 'revive', value: function revive(
    id) {
      var tupleToRevive = this._tuples[id];
      if (tupleToRevive) {
        if (!tupleToRevive.alive) {
          this._numAlive++;
          tupleToRevive.alive = true;
        }
      }
      return this.tuples;
    }

    /**
       * Converts a set of domains into an array of specs. The specs contain only the restrictive domains.
       * @param {Map<number, Set<boolean>>} domains variables mapped to their allowed domains
       * @returns {{key: number, value: boolean}[]} restrictive constraint specifications
       */ }, { key: 'col', get: function get() {return this._col;} }, { key: 'numAlive', get: function get() {return this._numAlive;} }, { key: 'numMines', get: function get() {return this._numMines;} }, { key: 'row', get: function get() {return this._row;} }, { key: 'scope', get: function get() {return this._scope;} }, { key: 'variables', get: function get() {return this._variables;} /**
                                                                                                                                                                                                                                                                                                                                                                                                     * Gets whether the constraint is consistent or not.
                                                                                                                                                                                                                                                                                                                                                                                                     * @returns {boolean} true if consistent, false otherwise
                                                                                                                                                                                                                                                                                                                                                                                                     */ }, { key: 'isConsistent', get: function get() {return this._numAlive > 0;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Gets an array of all currently alive tuples. Empty array if no currently alive tuples.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    */ }, { key: 'tuples', get: function get() {return this._tuples.filter(function (tuple) {return tuple.alive;});} }], [{ key: 'domainsToSpecs', value: function domainsToSpecs(domains) {var specs = [];domains.forEach(function (values, key) {if (values.size === 1) {specs.push({
            key: key,
            value: [].concat(_toConsumableArray(values))[0] });

        }
      });
      return specs;
    }

    /**
       * Intersects multiple constraint scopes to find the variables they have in common.
       * @param {...Constraint} constraints constraints to intersect
       * @returns {number[]} list of variables common to all given constraints
       */ }, { key: 'intersectScopes', value: function intersectScopes()
    {for (var _len = arguments.length, constraints = Array(_len), _key = 0; _key < _len; _key++) {constraints[_key] = arguments[_key];}
      var intersect = constraints[0].scope;
      constraints.slice(1).forEach(function (constraint) {
        intersect = intersect.filter(function (key) {return constraint.isInScope(key);});
      });
      return intersect;
    } }]);return Constraint;}();exports.default = Constraint;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.flagMines = exports.placeMines = exports.getChangedCells = exports.checkWinCondition = exports.revealNeighbors = exports.revealMines = exports.placeNumbers = exports.isOnFringe = undefined;var _enums = __webpack_require__(0);

// coordinate matrix of all adjacent cells
var coords = [
// [row, col]
[-1, -1], // top-left
[-1, 0], // top-mid
[-1, 1], // top-right
[0, 1], // mid-right
[1, 1], // bottom-right
[1, 0], // bottom-mid
[1, -1], // bottom-left
[0, -1]];


/**
           * Determines whether a cell is on the fringe.
           * @param {Immutable.List<Immutable.List<{}>>} cells matrix of cell objects
           * @param {number} i row of cell
           * @param {number } j col of cell
           * @returns {boolean} true if the cell is on the fringe, false otherwise
           */
var isOnFringe = exports.isOnFringe = function isOnFringe(cells, i, j) {return coords.some(function (element) {
    var row = i + element[0];
    var col = j + element[1];
    return row >= 0 && row < cells.size && col >= 0 && col < cells.get(0).size && !cells.getIn([row, col, 'isHidden']);
  });};

/**
         * Updates the number of nearby mines of the cells around mines.
         * @param {Immutable.List<Immutable.List<Immutable.Map>>>} cells matrix of cell objects
         * @param {object[]} mines list of mine locations
         * @param {number} mines[].row row of mine
         * @param {number} mines[].col col of mine
         * @return {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
         */
var placeNumbers = exports.placeNumbers = function placeNumbers(cells, mines) {
  var numRows = cells.size;
  var numCols = cells.get(0).size;

  return cells.withMutations(function (c) {
    mines.forEach(function (mine) {
      coords.forEach(function (element) {
        var row = mine.row + element[0];
        var col = mine.col + element[1];
        // if the coordinate exists on the board and doesn't have a mine, add to its number
        if (row >= 0 &&
        row < numRows &&
        col >= 0 &&
        col < numCols &&
        c.getIn([row, col, 'content']) !== _enums.Mines.MINE) {
          c.updateIn([row, col, 'content'], function (i) {return i + 1;});
        }
      });
    });
  });
};

/**
    * Reveals all mines that weren't found and any flags that were in the wrong place for when the game is lost.
    * @param {Immutable.Map} minefield state of the minefield
    * @returns {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
    */
var revealMines = exports.revealMines = function revealMines(minefield) {return minefield.withMutations(function (m) {
    for (var row = 0; row < m.get('cells').size; row++) {
      for (var col = 0; col < m.getIn(['cells', 0]).size; col++) {
        // if the cell has a mine
        if (m.getIn(['cells', row, col, 'content']) === _enums.Mines.MINE) {
          // if the mine is already revealed, show it as an error
          if (!m.getIn(['cells', row, col, 'isHidden'])) {
            m.setIn(['cells', row, col, 'content'], _enums.Mines.MINE_EXPLODED);
            // else reveal the mine if it isn't flagged
          } else if (!m.getIn(['cells', row, col, 'isFlagged'])) {
            m.setIn(['cells', row, col, 'isHidden'], false);
          }
          // else if the cell is flagged, show it as an error
        } else if (m.getIn(['cells', row, col, 'isFlagged'])) {
          m.setIn(['cells', row, col, 'content'], _enums.Mines.MINE_FALSE);
          m.setIn(['cells', row, col, 'isHidden'], false);
          m.update('numFlagged', function (n) {return n - 1;});
        }
        m.setIn(['cells', row, col, 'color'], 0);
      }
    }
  });};

/**
         * Reveals all hidden cells near a cell that was revealed and found to be blank.
         * @param {Immutable.Map} minefield state of the minefield
         * @param {number} row row of revealed cell
         * @param {number} col column of revealed cell
         * @returns {Immutable.Map} new minefield
         */
var revealNeighbors = exports.revealNeighbors = function revealNeighbors(minefield, row, col) {
  var cellQueue = [];
  cellQueue.push({
    y: row,
    x: col });

  var numRows = minefield.get('cells').size;
  var numCols = minefield.getIn(['cells', 0]).size;

  // reveal all neighboring cells
  return minefield.withMutations(function (m) {var _loop = function _loop() {

      var currentCell = cellQueue.pop();
      coords.forEach(function (element) {
        var x = currentCell.x + element[1];
        var y = currentCell.y + element[0];
        // if the coordinate exists on the board and isn't already revealed, reveal it
        if (x >= 0 && x < numCols &&
        y >= 0 && y < numRows &&
        m.getIn(['cells', y, x, 'isHidden'])) {
          m.setIn(['cells', y, x, 'isHidden'], false);
          m.update('numRevealed', function (n) {return n + 1;});
          // if this cell is also empty, add it to the queue so its neighbors can also be revealed
          if (m.getIn(['cells', y, x, 'content']) === 0) {
            cellQueue.push({
              x: x,
              y: y });

          }
        }
      });};do {_loop();
    } while (cellQueue.length > 0);
  });
};

/**
    * Checks if the game has been won.
    * @param {Immutable.Map} minefield state of the minefield
    * @returns {boolean} true if game has been won, false otherwise
    */
var checkWinCondition = exports.checkWinCondition = function checkWinCondition(minefield) {return minefield.get('numRevealed') === minefield.get('cells').size *
  minefield.getIn(['cells', 0]).size - minefield.get('numMines');};

/**
                                                                     * Gets all the cells that changed from the previous state to the current one. Returning their [row, col] pairs in an
                                                                     * array.
                                                                     * @param {Immutable.List<Immutable.List<Immutable.Map>>>} oldCells old matrix of cells
                                                                     * @param {Immutable.List<Immutable.List<Immutable.Map>>>} newCells new matrix of cells
                                                                     * @returns {Array<{col: number, row: number}>} array of cell locations that are different
                                                                     */
var getChangedCells = exports.getChangedCells = function getChangedCells(oldCells, newCells) {
  var changedCells = [];
  oldCells.forEach(function (group, row) {
    group.forEach(function (cell, col) {
      if (cell !== newCells.getIn([row, col])) {
        changedCells.push({
          col: col,
          row: row });

      }
    });
  });
  return changedCells;
};

/**
    * Places mines randomly on the board, avoiding the given safe cell.
    * @param {Immutable.List<Immutable.List<Immutable.Map>>>} cells matrix of cell objects
    * @param {number} numMines number of mines to be placed
    * @param {number} row row of safe cell
    * @param {number} col column of safe cell
    * @returns {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
    */
var placeMines = exports.placeMines = function placeMines(cells, numMines, row, col) {
  var minesLeft = numMines;
  var numRows = cells.size;
  var numCols = cells.get(0).size;
  var mines = [];

  var newCells = cells.withMutations(function (c) {
    while (minesLeft > 0) {
      var y = Math.floor(Math.random() * numRows);
      var x = Math.floor(Math.random() * numCols);
      // if a random cell doesn't already have a mine and is not within range of the safe cell, then place a mine there
      if (c.getIn([y, x, 'content']) !== -1 &&
      !(y >= row - 1 && y <= row + 1 && x >= col - 1 && x <= col + 1)) {
        c.setIn([y, x, 'content'], _enums.Mines.MINE);
        mines.push({
          col: x,
          row: y });

        minesLeft--;
      }
    }
  });

  return placeNumbers(newCells, mines);
};

/**
    * Flags all hidden cells that have mines for when the game is won.
    * @param {Immutable.List<Immutable.List<Immutable.Map>>>} cells matrix of cell objects
    * @return {Immutable.List<Immutable.List<Immutable.Map>>>} new cells
    */
var flagMines = exports.flagMines = function flagMines(cells) {return cells.withMutations(function (c) {
    for (var row = 0; row < c.size; row++) {
      for (var col = 0; col < c.get(0).size; col++) {
        if (c.getIn([row, col, 'content']) === _enums.Mines.MINE && !c.getIn([row, col, 'isFlagged'])) {
          c.setIn([row, col, 'isFlagged'], true);
        }
      }
    }
  });};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.logDiagnostics = exports.revise = undefined;var _Constraint = __webpack_require__(3);var _Constraint2 = _interopRequireDefault(_Constraint);
var _HistoryLogItem = __webpack_require__(1);var _HistoryLogItem2 = _interopRequireDefault(_HistoryLogItem);
var _utils = __webpack_require__(2);



var _enums = __webpack_require__(0);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}




/**
                                                                                                                                                                                                                                                                                                                       * Maps all variables to the list of their constraints.
                                                                                                                                                                                                                                                                                                                       * @param {Constraint[]} constraints list of Constraints
                                                                                                                                                                                                                                                                                                                       * @returns {Map<number, Constraint[]} variables mapped to their constraints
                                                                                                                                                                                                                                                                                                                       */
var mapVarsToConstraints = function mapVarsToConstraints(constraints) {
  var map = new Map();
  constraints.forEach(function (constraint) {
    constraint.scope.forEach(function (variable) {
      if (!map.has(variable)) {
        map.set(variable, []);
      }
      map.get(variable).push(constraint);
    });
  });
  return map;
};


/**
    * Revises a constraint with the given domains. Supported domains are recorded and returned in a new map.
    * If reduced is provided, any killed tuples are recorded there. Otherwise they are ignored.
    * @param {Constraint} constraint a table constraint to be revised
    * @param {Map<number, Set<boolean>>} domains the set of allowed variable domains
    * @param {Object} diagnostics execution metrics object
    * @param {number} diagnostics.tuplesKilled number of tuples killed
    * @param {Map<Constraint, Set<number>>} [reduced] table constraints mapped to their killed tuples
    * @returns {Map<number, Set<boolean>>} variables mapped to their new allowed domains, undefined if the constraint is
    * dead
    */
var revise = exports.revise = function revise(constraint, domains, diagnostics) {var reduced = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  // convert the domains to specs
  var specs = _Constraint2.default.domainsToSpecs(domains);

  // revise the alive tuples with the old domain sets
  var startTuples = constraint.tuples.map(function (tuple) {return tuple.id;});
  var endTuples = constraint.killIf(specs).map(function (tuple) {return tuple.id;});
  if (reduced) {
    var killedTuples = startTuples.filter(function (id) {return !endTuples.includes(id);});
    killedTuples.forEach(function (id) {return reduced.get(constraint).add(id);});
  }
  diagnostics.tuplesKilled += startTuples.length - endTuples.length;

  return constraint.supportedDomains();
};

/**
    * Implementation of simple tabular reduction algorithm. Revises constraint tuples and variable domain sets, enforcing
    * generalized arc consistency (GAC) across all constraint tables. Any variables with a domain of only one value are
    * added to the list of solvable cells.
    * @param {Immutable.Map} csp csp model of the minefield
    * @param {number} componentIndex index of component to operate on
    * @returns {Immutable.Map} csp with GAC and any solvable cells identified
    */exports.default =
function (csp, componentIndex) {return csp.withMutations(function (c) {
    if (!c.getIn(['diagnostics', _enums.Algorithms.STR2])) {
      var _diagnostics = {
        time: 0,
        revisions: 0,
        tuplesKilled: 0 };

      c.setIn(['diagnostics', _enums.Algorithms.STR2], _diagnostics);
    }
    var diagnostics = c.getIn(['diagnostics', _enums.Algorithms.STR2]);
    var STR = [];
    var domains = c.get('domains');
    var startTime = performance.now();

    var constraintMap = mapVarsToConstraints(c.get('components')[componentIndex].constraints);
    var queue = [];
    c.get('components')[componentIndex].constraints.forEach(function (element) {return queue.push(element);});

    try {var _loop = function _loop() {


        // revise the next constraint in the queue
        diagnostics.revisions++;
        var constraint = queue.shift();
        var newDomains = revise(constraint, domains, diagnostics);
        if (!newDomains) {
          throw constraint.scope;
        }

        newDomains.forEach(function (values, key) {
          // if the new domain set is different, intersect the new and old domain sets
          if (domains.get(key).size !== values.size) {
            domains.set(key, (0, _utils.intersect)(domains.get(key), values));
            // add any constraints affected by this variable back to the queue
            constraintMap.get(key).forEach(function (element) {
              if (element !== constraint && !queue.includes(element)) {
                queue.push(element);
              }
            });
          }
          // if the domain is inconsistent, break
          if (domains.get(key).size === 0) {
            throw new Array(key);
          }
        });}; // continually check constraints until no more changes can be made
      while (queue.length > 0) {_loop();}
    } catch (error) {
      error.forEach(function (key) {
        constraintMap.get(key).forEach(function (constraint) {return constraint.killAll();});
      });
    }

    // solve any variables with a domain of only one value
    domains.forEach(function (values, key) {
      if (values.size === 1) {
        STR.push({
          key: key,
          value: [].concat(_toConsumableArray(values))[0] });

      }
    });
    diagnostics.time += performance.now() - startTime;

    // add all STR cells to the list of solvable cells
    if (STR.length > 0) {
      if (!c.getIn(['solvable', _enums.Algorithms.STR2])) {
        c.setIn(['solvable', _enums.Algorithms.STR2], []);
      }
      c.updateIn(['solvable', _enums.Algorithms.STR2], function (x) {return x.concat(STR);});
    }
  });};

/**
         * Creates a formatted HistoryLogItem object to represent the diagnostics of the STR2 iteration.
         * @param {Immutable.Map} csp constraint model of the board
         * @param {number} [numRuns=1] number of iterations recorded in the diagnostics
         * @returns {HistoryLogItem} new HistoryLogItem of the diagnostics
         */
var logDiagnostics = exports.logDiagnostics = function logDiagnostics(csp) {var numRuns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var log = new _HistoryLogItem2.default(_enums.Algorithms.STR2 + ':', _enums.HistoryLogStyles.DEFAULT, false);
  var diagnostics = csp.getIn(['diagnostics', _enums.Algorithms.STR2]);
  Object.keys(diagnostics).forEach(function (key) {
    var average = diagnostics[key] / numRuns;
    var detail = void 0;
    switch (key) {
      case 'time':detail = 'CPU time\t\t\t\t' + Math.round(average * 100) / 100 + ' ms';break;
      case 'revisions':detail = '# constraints checked\t\t' + Math.round(average);break;
      case 'tuplesKilled':detail = '# tuples killed\t\t\t\t' + (0, _utils.numberWithCommas)(Math.round(average));break;
      default:detail = key + '\t\t\t\t' + Math.round(average);}

    log.addDetail(detail);
  });
  return log;
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("immutable");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.reduce = exports.constraintFilter = undefined;var _Constraint = __webpack_require__(3);var _Constraint2 = _interopRequireDefault(_Constraint);

var _utils = __webpack_require__(2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

/**
                                                                                                                                                                                                                                                                                                                          * Filters the constraints, finding those that contain any two current or future variables.
                                                                                                                                                                                                                                                                                                                          * @param {Map<number, Set<Array<Array<boolean>>>} constraints variables mapped to the constraints that contain them
                                                                                                                                                                                                                                                                                                                          * @param {Array<number>} assignmentOrder variable assignment order
                                                                                                                                                                                                                                                                                                                          * @returns {Map<number, Array<Array<Array<boolean>>>} variables mapped to the constraints relevant to their forward
                                                                                                                                                                                                                                                                                                                          * check
                                                                                                                                                                                                                                                                                                                          */
var constraintFilter = exports.constraintFilter = function constraintFilter(constraints, assignmentOrder) {
  var filteredMap = new Map();
  assignmentOrder.forEach(function (current, index) {
    var future = assignmentOrder.slice(index + 1);
    var filtered = [].concat(_toConsumableArray(constraints.get(current))).filter(function (constraint) {return (
        future.some(function (variable) {return constraints.get(variable).has(constraint);}));});
    filteredMap.set(current, filtered);
  });
  return filteredMap;
};

/**
    * Reduces the domains based on the newDomains, adding necessary elements to the queue, and storing reductions in
    * reduced.
    * @param {Map<number, Set<boolean>>} reduced map of reduced domains
    * @param {Map<number, Set<boolean>>} newDomains current valid variable domains
    * @param {Map<number, Set<boolean>>} domains old valid variable domains
    * @param {Array<number>} queue list of unvisited reduced variables
    * @returns {boolean} true if reductions are consistent, false if a domain was destroyed
    */
var reduce = exports.reduce = function reduce(reduced, newDomains, domains, queue) {
  // reduce the domains
  var consistent = true;
  newDomains.forEach(function (values, key) {
    domains.set(key, new Set([].concat(_toConsumableArray(domains.get(key))).filter(function (x) {
      if (values.has(x)) {
        return true;
      }
      reduced.get(key).add(x);
      if (!queue.includes(key)) {
        queue.push(key);
      }
      return false;
    })));
    newDomains.set(key, new Set([].concat(_toConsumableArray(domains.get(key)))));
    // check for destroyed domains
    if (domains.get(key).size === 0) {
      consistent = false;
    }
  });
  return consistent;
};

/**
    * Enforces GAC on all future variables based on the current variable assignment.
    * @param {Array{key: number, value: boolean}} stack current variable assignments
    * @param {Map<number, Array<Array<Array<boolean>>>} constraintMap future variables mapped to the constraints relevant
    * to their forward checks
    * @param {Map<number, Set<boolean>>} domains current variable domains
    * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
    * @returns {boolean} true if consistent, false otherwise
    */
var forwardCheck = function forwardCheck(stack, constraintMap, domains, reductions) {
  var current = stack.slice(-1)[0].key;
  var future = [].concat(_toConsumableArray(constraintMap.keys())).slice(stack.length);
  var newDomains = new Map();
  future.forEach(function (key) {return newDomains.set(key, new Set([].concat(_toConsumableArray(domains.get(key)))));});

  // check that the current assignment is consistent with all constraints
  var consistent = constraintMap.get(current).every(function (constraint) {
    var subFutureDomains = constraint.supportedDomains(stack);
    // update newDomains from subFutureDomains if the assignment is supported
    if (subFutureDomains) {
      subFutureDomains.forEach(function (values, key) {
        if (future.includes(key)) {
          newDomains.set(key, (0, _utils.intersect)(newDomains.get(key), values));
        }
      });
      return true;
    }
    return false;
  });

  // reduce the domains of the future variables
  if (consistent) {
    var reduced = new Map();
    future.forEach(function (key) {return reduced.set(key, new Set());});
    var queue = [];
    consistent = reduce(reduced, newDomains, domains, queue);

    while (consistent && queue.length > 0) {
      var next = queue.shift();
      consistent = constraintMap.get(next).every(function (constraint) {
        var subFutureDomains = constraint.supportedDomains(_Constraint2.default.domainsToSpecs(newDomains));
        // update newDomains from subFutureDomains if the assignment is supported
        if (subFutureDomains) {
          subFutureDomains.forEach(function (values, key) {
            if (future.includes(key)) {
              newDomains.set(key, (0, _utils.intersect)(newDomains.get(key), values));
            }
          });
          return true;
        }
        return false;
      });
      // reduce the domains of the future variables
      if (consistent) {
        consistent = reduce(reduced, newDomains, domains, queue);
      }
    }

    if (consistent) {
      reduced.forEach(function (values, key) {return reductions.get(key).push(values);});
      return true;
    }
    reduced.forEach(function (values, key) {return values.forEach(function (value) {return domains.get(key).add(value);});});
    return false;
  }
  return false;
};

/**
    * Attempts to assign the current variable a consistent value.
    * @param {Array<{key: number, value: boolean}>} stack past variable assignments
    * @param {number} key variable to be assigned
    * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap future variables mapped to the constraints relevant
    * to their forward checks
    * @param {Map<number, Set<boolean>>} domains current variable domains
    * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
    * @param {{timeChecking: number}} diagnostics execution metrics object
    * @returns {boolean} true if labeling was successful, false if unlabeling needed
    */
var label = function label(stack, key, constraintMap, domains, reductions, diagnostics) {
  var consistent = false;
  while (domains.get(key).size > 0 && !consistent) {
    stack.push({
      key: key,
      value: [].concat(_toConsumableArray(domains.get(key)))[0] });

    var startTime = performance.now();
    if (forwardCheck(stack, constraintMap, domains, reductions)) {
      consistent = true;
    } else {
      var value = stack.pop().value;
      domains.get(key).delete(value);
      reductions.get(key).slice(-1)[0].add(value);
    }
    diagnostics.timeChecking += performance.now() - startTime;
  }
  return consistent;
};

/**
    * Restores the domain of the current variable and removes the previous variable assignment from the stack.
    * @param {Array<{key: number, value: boolean}>} stack variable assignments
    * @param {Array<number>} assignmentOrder order of variable assignments
    * @param {Map<number, Set<boolean>} domains current variable domains and reductions
    * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
    * @return {boolean} true if consistent, false if more unlabeling needed
    */
var unlabel = function unlabel(stack, assignmentOrder, domains, reductions) {
  var variable = stack.pop();
  if (variable) {
    var future = assignmentOrder.slice(assignmentOrder.indexOf(variable.key) + 1);
    future.forEach(function (key) {
      var restore = [].concat(_toConsumableArray(reductions.get(key).pop()));
      restore.forEach(function (value) {return domains.get(key).add(value);});
    });
    domains.get(variable.key).delete(variable.value);
    reductions.get(variable.key).slice(-1)[0].add(variable.value);
    if (domains.get(variable.key).size > 0) {
      return true;
    }
  }
  return false;
};

/**
    * Searches the subspace until a solution is found or the entire subspace is traversed.
    * @param {Array<{key: number, value: boolean}>} stack variable assignments
    * @param {Map<number, Set<boolean>} domains variables mapped to the allowed values of the subspace
    * @param {Map<number, Array<Set<boolean>>>} reductions variables mapped to the domain reductions that have occured
    * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
    * their forward check
    * @param {Array<number>} assignmentOrder order of variable assignments
    * @param {{nodesVisited: number, backtracks: number, timeChecking: number}} diagnostics search metrics object
    * @returns {boolean} true if solution was found, false if no solution exists
    */
var search = function search(stack, domains, reductions, constraintMap, assignmentOrder, diagnostics) {
  var consistent = true;
  var currentLevel = stack.length;

  while (currentLevel >= 0 && currentLevel < assignmentOrder.length) {
    var currentVariable = assignmentOrder[currentLevel];
    if (consistent) {
      consistent = label(stack, currentVariable, constraintMap, domains, reductions, diagnostics);
      diagnostics.nodesVisited++;
      if (consistent) {
        currentLevel++;
      }
    } else {
      consistent = unlabel(stack, assignmentOrder, domains, reductions);
      currentLevel--;
      diagnostics.backtracks++;
    }
  }
  return stack.length === assignmentOrder.length;
};

/**
    * Finds all solutions to the given csp and reduces them to the backbone.
    * @param {Map<number, Set<boolean>} domains variables mapped to their allowed values
    * @param {Map<number, Array<Array<Array<boolean>>>>} constraints variables mapped to their constraints
    * @param {Array<number>} assignmentOrder order of variable assignments
    * @param {Object} diagnostics search metrics object
    * @param {number} diagnostics.timeFiltering number of ms spent filtering the constraints
    * @param {number} diagnostics.nodesVisited number of nodes the search visited
    * @param {number} diagnostics.backtracks number of backtracks the search required
    * @param {number} diagnostics.timeChecking number of ms the search required
    * @returns {Array<{key: number, value: boolean}>} list of solvable variables
    */exports.default =
function (domains, constraints, assignmentOrder, diagnostics) {
  var currentDomains = new Map();
  var reductions = new Map();
  assignmentOrder.forEach(function (key) {
    currentDomains.set(key, new Set([].concat(_toConsumableArray(domains.get(key)))));
    reductions.set(key, []);
  });
  // pad the first variable's reductions to avoid index out of bounds issues
  if (assignmentOrder.length > 0) {
    reductions.get(assignmentOrder[0]).push(new Set());
  }
  var fullySearched = false;
  var stack = [];
  var solutions = [];

  // filter the constraints
  var filterTime = performance.now();
  var constraintMap = constraintFilter(constraints, assignmentOrder);
  diagnostics.timeFiltering += performance.now() - filterTime;

  while (!fullySearched) {
    if (search(stack, currentDomains, reductions, constraintMap, assignmentOrder, diagnostics)) {
      // save the solution
      solutions.push(stack.slice());

      // find the next variable that could be solved in a different way
      var next = void 0;
      while (!next && stack.length > 0) {
        var top = stack.pop();
        if (currentDomains.get(top.key).size > 1) {
          next = top;
        } else {// restore the reductions to clean up for the next search
          assignmentOrder.slice(assignmentOrder.indexOf(top.key) + 1).forEach(function (key) {return (
              [].concat(_toConsumableArray(reductions.get(key).pop())).forEach(function (d) {return currentDomains.get(key).add(d);}));});
        }
      }

      // remove the domain so the same solution isn't found again
      if (next) {
        assignmentOrder.slice(assignmentOrder.indexOf(next.key) + 1).forEach(function (key) {return (
            [].concat(_toConsumableArray(reductions.get(key).pop())).forEach(function (d) {return currentDomains.get(key).add(d);}));});
        reductions.get(next.key).slice(-1)[0].add(next.value);
        currentDomains.get(next.key).delete(next.value);
      } else {
        fullySearched = true;
      }
    } else {
      fullySearched = true;
    }
  }

  // reduce the solutions to the backbone
  var backbone = [];
  assignmentOrder.forEach(function (key, index) {
    var solutionValues = new Set();
    solutions.forEach(function (solution) {return solutionValues.add(solution[index].value);});
    if (solutionValues.size === 1) {
      backbone.push({
        key: key,
        value: [].concat(_toConsumableArray(solutionValues))[0] });

    }
  });
  return backbone;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.parseSolvable = undefined;var _immutable = __webpack_require__(6);var _immutable2 = _interopRequireDefault(_immutable);
var _HistoryLogItem = __webpack_require__(1);var _HistoryLogItem2 = _interopRequireDefault(_HistoryLogItem);
var _enums = __webpack_require__(0);





var _cellUtils = __webpack_require__(4);



var _reducerFunctions = __webpack_require__(9);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}




/**
                                                                                                                                                                                                                                                                                                                                                            * Filters solvable, removing duplicates and throwing an error if a contradiction is found. A contradiction is any
                                                                                                                                                                                                                                                                                                                                                            * variable with multiple different solutions. The filtered solvable variables are then linked back to the cells they
                                                                                                                                                                                                                                                                                                                                                            * represent.
                                                                                                                                                                                                                                                                                                                                                            * @param {Immutable.Map} solvableSpecs map of algorithms to the solvable specs they found
                                                                                                                                                                                                                                                                                                                                                            * @param {object[]} variables list of current variable cells
                                                                                                                                                                                                                                                                                                                                                            * @param {number} variables[].key unique variable identifier
                                                                                                                                                                                                                                                                                                                                                            * @param {number} variables[].row cell row of the variable
                                                                                                                                                                                                                                                                                                                                                            * @param {number} variables[].col cell col of the variable
                                                                                                                                                                                                                                                                                                                                                            * @returns {Immutable.Map} solvable cells filtered and remapped
                                                                                                                                                                                                                                                                                                                                                            */
var parseSolvable = exports.parseSolvable = function parseSolvable(solvableSpecs, variables) {
  console.assert([].concat(_toConsumableArray(solvableSpecs.keys())).every(function (key) {return _reducerFunctions.algorithms.includes(key);}),
  'A solvable set was created but not accounted for');
  var solvable = new Map();
  _reducerFunctions.algorithms.forEach(function (algorithm) {
    if (solvableSpecs.has(algorithm)) {
      solvable.set(algorithm, solvableSpecs.get(algorithm).slice());
    }
  });
  var solutions = new Map();
  var contradictions = new Set();

  // separate any old solvable from the list
  var oldSolvable = new Map();
  solvable.forEach(function (specs, algorithm) {
    var oldSpecs = [];
    var newSpecs = specs.filter(function (spec) {
      if (spec.row !== undefined) {
        if (solutions.has(spec.key)) {
          if (solutions.get(spec.key) !== spec.value) {
            contradictions.add(spec.key);
          }
        } else {
          solutions.set(spec.key, spec.value);
          oldSpecs.push(spec);
        }
        return false;
      }
      return true;
    });
    solvable.set(algorithm, newSpecs);
    oldSolvable.set(algorithm, oldSpecs);
  });

  // filter solvable
  solvable.forEach(function (specs, algorithm) {
    var newSolvable = [];
    specs.forEach(function (spec) {
      if (solutions.has(spec.key)) {
        if (solutions.get(spec.key) !== spec.value) {
          contradictions.add(spec.key);
        }
      } else {
        solutions.set(spec.key, spec.value);
        newSolvable.push(spec);
      }
    });
    solvable.set(algorithm, newSolvable);
  });

  // map solvable specs to their cells
  solvable.forEach(function (specs, algorithm) {
    var solvableCells = specs.filter(function (spec) {return !contradictions.has(spec.key);});
    solvableCells = solvableCells.map(function (spec) {
      var variable = variables.find(function (element) {return element.key === spec.key;});
      return {
        key: spec.key,
        value: spec.value,
        row: variable.row,
        col: variable.col };

    });
    solvable.set(algorithm,
    solvableCells.concat(oldSolvable.get(algorithm).filter(function (spec) {return !contradictions.has(spec.key);})));
  });
  solvable.forEach(function (specs, algorithm) {
    if (specs.length === 0) {
      solvable.delete(algorithm);
    }
  });

  return _immutable2.default.Map(solvable);
};

/**
    * Solves all cells found to be solvable, losing the game if a cell that had a mine was incorrectly revealed.
    * @param {Immutable.Map} state state of board
    * @param {boolean} doLog false if solve should be recorded instead of logged, true otherwise
    * @return {Immutable.Map} updated state
    */exports.default =
function (state) {var doLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;return state.withMutations(function (s) {
    // solve each cell
    var oldNumFlagged = s.getIn(['minefield', 'numFlagged']);
    var oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
    var lostGame = false;
    var solvedCount = new Map();
    var neighborQueue = [];

    s.getIn(['csp', 'solvable']).forEach(function (cells, algorithm) {
      var numRevealed = s.getIn(['minefield', 'numRevealed']);
      var numFlagged = 0;
      cells.forEach(function (cell) {
        // if the cell should have a mine and there are not too many flags already, flag it
        if (cell.value && s.getIn(['minefield', 'numFlagged']) < s.getIn(['minefield', 'numMines'])) {
          s.setIn(['minefield', 'cells', cell.row, cell.col, 'isFlagged'], true);
          s.updateIn(['minefield', 'numFlagged'], function (n) {return n + 1;});
          numFlagged++;
          // else if the cell should be revealed, reveal it
        } else if (!cell.value) {
          s.setIn(['minefield', 'cells', cell.row, cell.col, 'isHidden'], false);
          s.updateIn(['minefield', 'numRevealed'], function (n) {return n + 1;});
          if (s.getIn(['minefield', 'cells', cell.row, cell.col, 'content']) === 0) {
            neighborQueue.push({
              row: cell.row,
              col: cell.col,
              algorithm: algorithm });

          } else if (s.getIn(['minefield', 'cells', cell.row, cell.col, 'content']) === _enums.Mines.MINE) {
            lostGame = true;
          }
        }
      });
      // record the results
      solvedCount.set(algorithm, {
        numRevealed: s.getIn(['minefield', 'numRevealed']) - numRevealed,
        numFlagged: numFlagged });

    });
    // handle any neighbors that need revealing
    neighborQueue.forEach(function (cell) {
      var numRevealed = s.getIn(['minefield', 'numRevealed']);
      s.update('minefield', function (m) {return (0, _cellUtils.revealNeighbors)(m, cell.row, cell.col);});
      solvedCount.get(cell.algorithm).numRevealed += s.getIn(['minefield', 'numRevealed']) - numRevealed;
    });
    s.updateIn(['csp', 'solvable'], function (o) {return o.clear();});

    // check that an error wasn't made
    if (lostGame) {
      return (0, _reducerFunctions.loseGame)(s);
    }

    // log the results if necessary
    s.update('historyLog', function (h) {return h.pop();});
    if (doLog) {
      var numRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;
      var numFlagged = s.getIn(['minefield', 'numFlagged']) - oldNumFlagged;

      var cellOrCells = 'cells';
      if (numFlagged + numRevealed === 1) {
        cellOrCells = 'cell';
      }
      var message = 'Solved ' + (numFlagged + numRevealed) + ' ' + cellOrCells + ', ' + numFlagged + '[' + _enums.HistoryLogSymbols.FLAG + ']';
      var changedCells = (0, _cellUtils.getChangedCells)(state.getIn(['minefield', 'cells']), s.getIn(['minefield', 'cells']));
      var log = new _HistoryLogItem2.default(message, _enums.HistoryLogStyles.DEFAULT, true, changedCells);

      solvedCount.forEach(function (count, algorithm) {
        cellOrCells = 'cells';
        if (count.numFlagged + count.numRevealed === 1) {
          cellOrCells = 'cell';
        }
        var detail =
        algorithm + ' solved ' + (count.numFlagged + count.numRevealed) + ' ' + cellOrCells + ', ' + count.numFlagged + ('[' +
        _enums.HistoryLogSymbols.FLAG + ']');
        log.addDetail(detail);
      });
      s.update('historyLog', function (h) {return h.push(log);});

      // else accumulate the results
    } else {
      solvedCount.forEach(function (count, algorithm) {
        if (!s.getIn(['csp', 'count']).has(algorithm)) {
          s.getIn(['csp', 'count']).set(algorithm, {
            numFlagged: 0,
            numRevealed: 0 });

        }
        var counter = s.getIn(['csp', 'count']).get(algorithm);
        counter.numFlagged += count.numFlagged;
        counter.numRevealed += count.numRevealed;
      });
    }
    return s;
  });};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.toggleFlag = exports.toggleActive = exports.loseGame = exports.loop = exports.logErrorReport = exports.loadFail = exports.initialize = exports.cheat = exports.changeSize = exports.step = exports.revealCell = exports.winGame = exports.reset = exports.algorithms = undefined;var _immutable = __webpack_require__(6);var _immutable2 = _interopRequireDefault(_immutable);
var _HistoryLogItem = __webpack_require__(1);var _HistoryLogItem2 = _interopRequireDefault(_HistoryLogItem);
var _enums = __webpack_require__(0);






var _index = __webpack_require__(16);var _index2 = _interopRequireDefault(_index);
var _solve = __webpack_require__(8);var _solve2 = _interopRequireDefault(_solve);

var _cellUtils = __webpack_require__(4);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}








var algorithms = exports.algorithms = [_enums.Algorithms.Unary, _enums.Algorithms.BT, _enums.Algorithms.STR2, _enums.Algorithms.mWC1, _enums.Algorithms.mWC2,
_enums.Algorithms.mWC3, _enums.Algorithms.mWC4];

/**
                                                  * Handles the reset action by reverting the cells, csp model, and undo history to their starting states.
                                                  * @param state state of the board
                                                  * @returns newState
                                                  */
var reset = exports.reset = function reset(state) {return state.withMutations(function (s) {
    // reset all the cells
    for (var i = 0; i < s.getIn(['minefield', 'cells']).size; i++) {
      for (var j = 0; j < s.getIn(['minefield', 'cells', 0]).size; j++) {
        s.setIn(['minefield', 'cells', i, j], _immutable2.default.Map({
          color: 0,
          content: 0,
          isFlagged: false,
          isHidden: true }));

      }
    }

    // clear out the csp model
    s.deleteIn(['csp', 'components']);
    s.setIn(['csp', 'isConsistent'], true);
    s.updateIn(['csp', 'solvable'], function (o) {return o.clear();});

    // reset the other settings
    s.update('historyLog', function (h) {return h.clear();});
    s.set('isGameRunning', false);
    s.setIn(['minefield', 'numFlagged'], 0);
    s.setIn(['minefield', 'numRevealed'], 0);

    // reset the number of mines if necessary
    switch (s.get('size')) {
      case _enums.BoardSizes.BEGINNER:s.setIn(['minefield', 'numMines'], 10);break;
      case _enums.BoardSizes.INTERMEDIATE:s.setIn(['minefield', 'numMines'], 40);break;
      case _enums.BoardSizes.EXPERT:s.setIn(['minefield', 'numMines'], 99);break;
      default:}

  });};

/**
         * Wins the game.
         * @param state
         * @return new state
         */
var winGame = exports.winGame = function winGame(state) {return state.withMutations(function (s) {
    s.updateIn(['minefield', 'cells'], function (c) {return (0, _cellUtils.flagMines)(c);});
    s.setIn(['minefield', 'numFlagged'], s.getIn(['minefield', 'numMines']));
    s.set('isGameRunning', false);
  });};

/**
         * Handles the reveal cell action as performed by the user or by cheat.
         * @param state state of the board
         * @param {number} row row of the cell
         * @param {number} col col of the cell
         * @returns newState
         */
var revealCell = exports.revealCell = function revealCell(state, row, col) {
  // if there are no mines already, place mines and start the game
  var oldCells = state.getIn(['minefield', 'cells']);
  var newState = void 0;
  var popFromHistory = true;
  if (state.getIn(['minefield', 'numRevealed']) === 0) {
    newState = state.updateIn(['minefield', 'cells'], function (c) {return (
        (0, _cellUtils.placeMines)(c, state.getIn(['minefield', 'numMines']), row, col));});
    newState = newState.set('isGameRunning', true);
    oldCells = newState.getIn(['minefield', 'cells']);
    popFromHistory = false;
  }

  // if the game is running, reveal the cell, else do nothing and return the old state
  if (state.get('isGameRunning') || !popFromHistory) {
    newState = popFromHistory ? state.set('isGameRunning', true) : newState.set('isGameRunning', true);
    newState = newState.withMutations(function (s) {
      // reveal the cell
      var oldNumRevealed = s.getIn(['minefield', 'numRevealed']);
      s.setIn(['minefield', 'cells', row, col, 'isHidden'], false);
      s.updateIn(['minefield', 'numRevealed'], function (n) {return n + 1;});
      if (s.getIn(['minefield', 'cells', row, col, 'content']) === 0) {
        s.update('minefield', function (m) {return (0, _cellUtils.revealNeighbors)(m, row, col);});
      }
      var numCellsRevealed = s.getIn(['minefield', 'numRevealed']) - oldNumRevealed;

      // post the action to the history log
      var cellOrCells = 'cells';
      if (numCellsRevealed === 1) {
        cellOrCells = 'cell';
      }
      var message = '[' + row + ',' + col + '] revealed ' + numCellsRevealed + ' ' + cellOrCells;
      if (popFromHistory) {
        s.update('historyLog', function (h) {return h.pop();});
      }
      var log = new _HistoryLogItem2.default(message, 'log', true, (0, _cellUtils.getChangedCells)(oldCells, s.getIn(['minefield', 'cells'])));
      s.update('historyLog', function (h) {return h.push(log);});
    });

    // check if the game has been won
    if ((0, _cellUtils.checkWinCondition)(newState.get('minefield'))) {
      return winGame(newState);
    }

    // set the new csp model
    return (0, _index2.default)(newState, !popFromHistory);
  }
  return state;
};

/**
    * Handles the step action by solving and advancing the csp once if possible.
    * @param state state of the board
    * @param {boolean} [isLogged] default solveCSP will be logged, false if log isn't wanted
    * @returns newState, or oldState if no changes could be made
    */
var step = exports.step = function step(state) {var isLogged = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  // if the csp model is consistent and there is at least one solvable cell, advance the csp
  if (state.getIn(['csp', 'isConsistent']) &&
  state.getIn(['csp', 'solvable']).size > 0) {
    // solve the current csp
    var newState = (0, _solve2.default)(state, isLogged);

    // check if the game has been lost
    if (!newState.get('isGameRunning')) {
      return newState;
    }

    // check if the game has been won and reprocess the csp
    if ((0, _cellUtils.checkWinCondition)(newState.get('minefield'))) {
      return winGame(newState);
    }
    return (0, _index2.default)(newState);
  }
  return state;
};

/**
    * Converts the change size action to a reset action.
    * @param state state of the board
    * @param {object} newSize new size to make the board
    * @param {number} newSize.rows number of rows
    * @param {number} newSize.cols number of cols
    * @param {number} newSize.numMines number of mines
    * @param {symbol} newSize.size string description of the new size
    * @return newState
    */
var changeSize = exports.changeSize = function changeSize(state, newSize) {return state.withMutations(function (s) {
    s.updateIn(['minefield', 'cells'], function (c) {return c.setSize(newSize.rows);});
    for (var i = 0; i < newSize.rows; i++) {
      s.setIn(['minefield', 'cells', i], _immutable2.default.List().setSize(newSize.cols));
    }
    s.setIn(['minefield', 'numMines'], newSize.numMines);
    s.set('size', newSize.size);

    // reset the board
    return reset(s);
  });};

/**
         * Converts the cheat action into a reveal cell action.
         * @param state state of the board
         * @param {boolean} [isRandom=true] true if pick cheat cell randomly, false if prioritize unsolvable cells on the fringe
         * @returns newState
         */
var cheat = exports.cheat = function cheat(state) {var isRandom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
  var col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);

  // if selection style is not random, prioritize the fringe
  var cellFound = false;
  if (!isRandom && state.get('isGameRunning')) {
    var solvable = new Set();
    state.getIn(['csp', 'solvable']).forEach(function (set) {return set.forEach(function (e) {return solvable.add(e.key);});});
    var variables = [];
    state.getIn(['csp', 'components']).forEach(function (component) {var _variables;return (_variables = variables).push.apply(_variables, _toConsumableArray(component.variables));});
    variables = variables.filter(function (variable) {return (
        state.getIn(['minefield', 'cells', variable.row, variable.col, 'content']) !== _enums.Mines.MINE &&
        !solvable.has(variable.key));});
    cellFound = variables[Math.floor(Math.random() * variables.length)];
    if (cellFound) {
      row = cellFound.row;
      col = cellFound.col;
    }
  }
  // else find a random safe cell
  if (!cellFound) {
    while (!state.getIn(['minefield', 'cells', row, col, 'isHidden']) ||
    state.getIn(['minefield', 'cells', row, col, 'content']) === _enums.Mines.MINE) {
      row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
      col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
    }
  }

  // reveal the cell
  return revealCell(state, row, col);
};

/**
    * Handles the default action that sets up the initial state of the board.
    * @returns initial state
    */
var initialize = exports.initialize = function initialize() {var _Immutable$Map, _Immutable$Map2;
  // create the cell matrix
  var cells = _immutable2.default.List().withMutations(function (c) {
    for (var i = 0; i < 16; i++) {
      var row = _immutable2.default.List().withMutations(function (r) {
        for (var j = 0; j < 16; j++) {
          r.push(_immutable2.default.Map({
            color: 0,
            content: 0,
            isFlagged: false,
            isHidden: true }));

        }
      });
      c.push(row);
    }
  });

  // wrap the cells in the minefield
  var minefield = _immutable2.default.Map({
    cells: cells,
    numFlagged: 0,
    numMines: 40,
    numRevealed: 0 });


  // create the csp model
  var csp = _immutable2.default.Map({
    algorithms: _immutable2.default.Map((_Immutable$Map2 = {}, _defineProperty(_Immutable$Map2,
    _enums.Algorithms.BT, _immutable2.default.Map({
      subSets: _immutable2.default.Map((_Immutable$Map = {}, _defineProperty(_Immutable$Map,
      _enums.Algorithms.BC, true), _defineProperty(_Immutable$Map,
      _enums.Algorithms.FC, true), _defineProperty(_Immutable$Map,
      _enums.Algorithms.MAC, true), _Immutable$Map)),

      isActive: false })), _defineProperty(_Immutable$Map2,

    _enums.Algorithms.STR2, _immutable2.default.Map({
      isActive: false })), _defineProperty(_Immutable$Map2,

    _enums.Algorithms.mWC, _immutable2.default.Map({
      isActive: true,
      m: 2 })), _Immutable$Map2)),


    diagnostics: _immutable2.default.Map(),
    isConsistent: true,
    solvable: _immutable2.default.Map() });


  // return the initial state map
  return _immutable2.default.Map({
    csp: csp,
    historyLog: _immutable2.default.List(),
    isGameRunning: false,
    minefield: minefield,
    size: _enums.BoardSizes.INTERMEDIATE });

};

/**
    * Logs the reason that the load attempt failed.
    * @param state state of the board
    * @param {string} error reason for the failure
    */
var loadFail = exports.loadFail = function loadFail(state, error) {
  var message = 'Failed to load minefield: ' + error;
  var log = new _HistoryLogItem2.default(message, _enums.HistoryLogStyles.RED, false);
  return state.update('historyLog', function (h) {return h.push(log);});
};

/**
    * Logs the server response to the attempt to send an error report.
    * @param state state of the board
    * @param {string} response server response to the sent error report
    * @returns newState
    */
var logErrorReport = exports.logErrorReport = function logErrorReport(state, response) {
  var message = void 0;
  var style = void 0;
  if (response.ok) {
    message = 'Successfully sent error report';
    style = _enums.HistoryLogStyles.GREEN;
  } else {
    message = 'Failed to send error report: ' + response;
    style = _enums.HistoryLogStyles.RED;
  }
  var log = new _HistoryLogItem2.default(message, style, false);
  return state.update('historyLog', function (h) {return h.push(log);});
};

/**
    * Converts the loop action into a series of step actions that advance the csp as far as possible.
    * @param state state of the board
    * @param {boolean} [isLogged] true (default) solve action will be logged, false if logging should be ignored
    * @returns newState, or oldState if no changes could be made
    */
var loop = exports.loop = function loop(state) {var isLogged = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  // solve the csp until step can no longer make any changes
  var oldState = state;
  var newState = void 0;
  if (oldState.getIn(['csp', 'solvable']).size > 0) {
    if (!oldState.getIn(['csp', 'count'])) {
      newState = oldState.setIn(['csp', 'count'], new Map());
    } else {
      newState = oldState;
      oldState = undefined;
    }
  } else {
    if (!isLogged && !oldState.getIn(['csp', 'count'])) {
      return oldState.setIn(['csp', 'count'], new Map());
    }
    return oldState;
  }
  while (newState !== oldState) {
    oldState = newState;
    newState = step(oldState, false);
  }

  // record the action in the history log
  if (isLogged) {
    var numFlagged = newState.getIn(['minefield', 'numFlagged']) - state.getIn(['minefield', 'numFlagged']);
    var numRevealed = newState.getIn(['minefield', 'numRevealed']) - state.getIn(['minefield', 'numRevealed']);
    var cellOrCells = 'cells';
    if (numFlagged + numRevealed === 1) {
      cellOrCells = 'cell';
    }
    var message = 'Solved ' + (numFlagged + numRevealed) + ' ' + cellOrCells + ', ' + numFlagged + '[' + _enums.HistoryLogSymbols.FLAG + ']';
    var log = new _HistoryLogItem2.default(
    message,
    _enums.HistoryLogStyles.DEFAULT,
    true,
    (0, _cellUtils.getChangedCells)(state.getIn(['minefield', 'cells']), newState.getIn(['minefield', 'cells'])));

    algorithms.forEach(function (algorithm) {
      if (newState.getIn(['csp', 'count']).has(algorithm)) {
        var count = newState.getIn(['csp', 'count']).get(algorithm);
        cellOrCells = 'cells';
        if (count.numFlagged + count.numRevealed === 1) {
          cellOrCells = 'cell';
        }
        var detail =
        algorithm + ' solved ' + (count.numFlagged + count.numRevealed) + ' ' + cellOrCells + ', ' + count.numFlagged + ('[' +
        _enums.HistoryLogSymbols.FLAG + ']');
        log.addDetail(detail);
      }
    });
    if (newState.get('isGameRunning')) {
      newState = newState.update('historyLog', function (h) {return h.pop().push(log);});
      message = 'Finds 0 solvable cells';
      newState = newState.update('historyLog', function (h) {return (
          h.push(new _HistoryLogItem2.default(message, _enums.HistoryLogStyles.DEFAULT, false)));});
    } else {
      newState = newState.update('historyLog', function (h) {return h.push(log);});
    }
    // clean up the results of the loop
    return newState.deleteIn(['csp', 'count']);
  }
  return newState;
};

/**
    * Loses the game.
    * @param state state of the board
    * @param {number} [row] row of the cell that caused the loss
    * @param {number} [col] col of the cell that caused the loss
    * @returns newState
    */
var loseGame = exports.loseGame = function loseGame(state, row, col) {return state.withMutations(function (s) {
    if (row && col) {
      s.setIn(['minefield', 'cells', row, col, 'isHidden'], false);
    }
    s.update('minefield', function (m) {return (0, _cellUtils.revealMines)(m);});
    s.set('isGameRunning', false);
  });};

/**
         * Handles the toggle active action by changed the active status of the specified algorithm.
         * @param state state of the board
         * @param {string} algorithm name of the algorithm to toggle
         * @param {string|number} [modifier] modifier to apply to the algorithm change
         * @returns newState
         */
var toggleActive = exports.toggleActive = function toggleActive(state, algorithm, modifier) {return state.withMutations(function (s) {
    if (modifier) {
      switch (algorithm) {
        case _enums.Algorithms.BT:s.updateIn(['csp', 'algorithms', _enums.Algorithms.BT, 'subSets', modifier], function (a) {return !a;});break;
        case _enums.Algorithms.mWC:s.setIn(['csp', 'algorithms', _enums.Algorithms.mWC, 'm'], modifier);break;
        default:}

    } else {
      s.updateIn(['csp', 'algorithms', algorithm, 'isActive'], function (a) {return !a;});
    }
    if (s.get('isGameRunning')) {
      s.update('historyLog', function (h) {return h.pop();});
      return (0, _index2.default)(s, true);
    }
    return s;
  });};

/**
         * Handles the toggle flag action by changing the flag status of the cell if possible
         * @param state state of the board
         * @param {number} row row of the cell
         * @param {number} col col of the cell
         * @returns newState
         */
var toggleFlag = exports.toggleFlag = function toggleFlag(state, row, col) {
  if (state.get('isGameRunning')) {
    return state.withMutations(function (s) {
      var message = void 0;

      // if the cell is not already flagged and there are flags available to be placed, place the flag
      if (!s.getIn(['minefield', 'cells', row, col, 'isFlagged']) &&
      s.getIn(['minefield', 'numFlagged']) < s.getIn(['minefield', 'numMines'])) {
        s.setIn(['minefield', 'cells', row, col, 'isFlagged'], true);
        s.updateIn(['minefield', 'numFlagged'], function (n) {return n + 1;});
        message = '[' + row + ',' + col + '] flagged';

        // else if the cell is already flagged, remove the flag
      } else if (s.getIn(['minefield', 'cells', row, col, 'isFlagged'])) {
        s.setIn(['minefield', 'cells', row, col, 'isFlagged'], false);
        s.updateIn(['minefield', 'numFlagged'], function (n) {return n - 1;});
        message = '[' + row + ',' + col + '] unflagged';
      }

      // record the event in the history log and reprocess the csp
      s.update('historyLog', function (h) {return h.pop().push(new _HistoryLogItem2.default(message, _enums.HistoryLogStyles.DEFAULT, true));});
      return (0, _index2.default)(s);
    });
  }
  return state;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _fs = __webpack_require__(19);

var _testFunctions = __webpack_require__(18);
var _reducerFunctions = __webpack_require__(9);
var _cellUtils = __webpack_require__(4);




var populateMinefield = function populateMinefield(state) {
  var row = Math.floor(Math.random() * state.getIn(['minefield', 'cells']).size);
  var col = Math.floor(Math.random() * state.getIn(['minefield', 'cells', 0]).size);
  var newState = state.updateIn(['minefield', 'cells'], function (c) {return (
      (0, _cellUtils.placeMines)(c, state.getIn(['minefield', 'numMines']), row, col));});
  newState = newState.update('minefield', function (m) {return (0, _cellUtils.revealNeighbors)(m, row, col);});
  return newState;
};

var createXMLDocumentString = function createXMLDocumentString(minefield) {
  var bombs = [];
  var squares = [];
  minefield.get('cells').forEach(function (row, y) {
    row.forEach(function (cell, x) {
      if (cell.get('content') === -1) {
        bombs.push({ x: x, y: y });
      } else if (!cell.get('isHidden')) {
        squares.push({ x: x, y: y });
      }
    });
  });
  var xmlString = '<field>\n';
  xmlString += '\t<dimensions x="' + minefield.get('cells').size + '" y="' + minefield.getIn(['cells', 0]).size + '" />\n';
  xmlString += '\t<bombs>\n';
  bombs.forEach(function (bomb) {
    xmlString += '\t\t<bomb x="' + bomb.x + '" y="' + bomb.y + '" />\n';
  });
  xmlString += '\t</bombs>\n';
  xmlString += '\t<knownsquares>\n';
  squares.forEach(function (square) {
    xmlString += '\t\t<square x="' + square.x + '" y="' + square.y + '" />\n';
  });
  xmlString += '\t</knownsquares>\n';
  xmlString += '</field>\n';
  return xmlString;
};

var generateTestCases = function generateTestCases(boardSettings, numInstances) {
  var state = (0, _testFunctions.initTestState)(boardSettings);
  for (var i = 0; i < numInstances; i++) {
    state = populateMinefield(state);
    var instance = createXMLDocumentString(state.get('minefield'));
    (0, _fs.writeFile)('src/tests/cases/instance' + i + '.xml', instance, function (err) {if (err) throw err;});
    state = (0, _reducerFunctions.reset)(state);
  }
  console.log('Tests successfully generated');
};

var boardSettings = {
  numRows: 16,
  numCols: 16,
  numMines: 40,
  algorithms: (0, _reducerFunctions.initialize)().getIn(['csp', 'algorithms']) };


generateTestCases(boardSettings, 1000);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                       * Filters the constraints, finding those that contain the current and at least one past variable.
                                                                                                                                                                                                                                                                       * @param {Map<number, Set<Array<Array<boolean>>>} constraints variables mapped to the constraints that contain them
                                                                                                                                                                                                                                                                       * @param {Array<number>} assignmentOrder variable assignment order
                                                                                                                                                                                                                                                                       * @returns {Map<number, Array<Array<Array<boolean>>>>} variables mapped to the constraints relevant to their backcheck
                                                                                                                                                                                                                                                                       */
var constraintFilter = function constraintFilter(constraints, assignmentOrder) {
  var filteredMap = new Map();
  assignmentOrder.forEach(function (current, index) {
    var past = assignmentOrder.slice(0, index);
    var filtered = [].concat(_toConsumableArray(constraints.get(current))).filter(function (constraint) {return (
        past.some(function (variable) {return constraints.get(variable).has(constraint);}));});
    filteredMap.set(current, filtered);
  });
  return filteredMap;
};

/**
    * Checks if the current variable assignments are supported by all constraints.
    * @param {Array<{key: number, value: boolean}>} stack current variable assignments
    * @param {Array<Array<Array<boolean>>>} constraints constraints relevant to the back check
    * @returns {boolean} true if consistent, false otherwise
    */
var backCheck = function backCheck(stack, constraints) {return constraints.every(function (constraint) {return constraint.isSupported(stack);});};

/**
                                                                                                                                                    * Attempts to assign the current variable a consistent value.
                                                                                                                                                    * @param {Array<{key: number, value: boolean}>} stack past variable assignments
                                                                                                                                                    * @param {number} key variable to be assigned
                                                                                                                                                    * @param {Array<Array<Array<boolean>>>>} constraints constraints relevant to the back check
                                                                                                                                                    * @param {Set<boolean>} domains current variable domains
                                                                                                                                                    * @param {{timeChecking: number}} diagnostics execution metrics object
                                                                                                                                                    * @returns {boolean} true if labeling was successful, false if unlabeling needed
                                                                                                                                                    */
var label = function label(stack, key, constraints, domains, diagnostics) {
  var consistent = false;
  while (domains.size > 0 && !consistent) {
    stack.push({
      key: key,
      value: [].concat(_toConsumableArray(domains))[0] });

    var startTime = performance.now();
    if (backCheck(stack, constraints)) {
      consistent = true;
    } else {
      domains.delete(stack.pop().value);
    }
    diagnostics.timeChecking += performance.now() - startTime;
  }
  return consistent;
};

/**
    * Restores the domain of the current variable and removes the previous variable assignment from the stack.
    * @param {Array<{key: number, value: boolean}>} stack variable assignments
    * @param {number} key variable to be restored
    * @param {Map<number, Set<boolean>} domains current variable domains
    * @param {Set<boolean>} restorations original variable domains
    * @returns {boolean} true if consistent, false if more unlabeling needed
    */
var unlabel = function unlabel(stack, key, domains, restorations) {
  domains.set(key, new Set([].concat(_toConsumableArray(restorations))));
  var variable = stack.pop();
  if (variable) {
    domains.get(variable.key).delete(variable.value);
    if (domains.get(variable.key).size > 0) {
      return true;
    }
  }
  return false;
};

/**
    * Searches the subspace until a solution is found or the entire subspace is traversed.
    * @param {Array<{key: number, value: boolean}>} stack variable assignments
    * @param {Map<number, Set<boolean>} currentDomains variables mapped to the allowed values of the subspace
    * @param {Map<number, Set<boolean>} globalDomains variables mapped to the backup values of the subspace
    * @param {Map<number, Array<Array<Array<boolean>>>>} constraintMap variables mapped to the constraints relevant to
    * their back check
    * @param {Array<number>} assignmentOrder order of variable assignments
    * @param {{nodesVisited: number, backtracks: number, timeChecking: number}} diagnostics search metrics object
    * @returns {boolean} true if solution was found, false if no solution exists
    */
var search = function search(stack, currentDomains, globalDomains, constraintMap, assignmentOrder, diagnostics) {
  var consistent = true;
  var currentLevel = stack.length;

  while (currentLevel >= 0 && currentLevel < assignmentOrder.length) {
    var currentVariable = assignmentOrder[currentLevel];
    if (consistent) {
      consistent = label(stack, currentVariable, constraintMap.get(currentVariable),
      currentDomains.get(currentVariable), diagnostics);
      diagnostics.nodesVisited++;
      if (consistent) {
        currentLevel++;
      }
    } else {
      consistent = unlabel(stack, currentVariable, currentDomains, globalDomains.get(currentVariable));
      currentLevel--;
      diagnostics.backtracks++;
    }
  }
  return stack.length === assignmentOrder.length;
};

/**
    * Finds all solutions, by back checking, to the given csp and reduces them to the backbone.
    * @param {Map<number, Set<boolean>} domains variables mapped to their allowed values
    * @param {Map<number, Array<Array<Array<boolean>>>>} constraints variables mapped to their constraints
    * @param {Array<number>} assignmentOrder order of variable assignments
    * @param {Object} diagnostics search metrics object
    * @param {number} diagnostics.timeFiltering number of ms spent filtering the constraints
    * @param {number} diagnostics.nodesVisited number of nodes the search visited
    * @param {number} diagnostics.backtracks number of backtracks the search required
    * @param {number} diagnostics.timeChecking number of ms the search required
    * @returns {Array[{key: number, value: boolean}]} list of solvable variables
    */exports.default =
function (domains, constraints, assignmentOrder, diagnostics) {
  var currentDomains = new Map();
  assignmentOrder.forEach(function (key) {return currentDomains.set(key, new Set([].concat(_toConsumableArray(domains.get(key)))));});
  var fullySearched = false;
  var stack = [];
  var solutions = [];

  // filter the constraints
  var filterTime = performance.now();
  var constraintMap = constraintFilter(constraints, assignmentOrder);
  diagnostics.timeFiltering += performance.now() - filterTime;

  while (!fullySearched) {
    if (search(stack, currentDomains, domains, constraintMap, assignmentOrder, diagnostics)) {
      // save the solution
      solutions.push(stack.slice());

      // find the next variable that could be solved in a different way
      var next = void 0;
      while (!next && stack.length > 0) {
        var top = stack.pop();
        if (currentDomains.get(top.key).size > 1) {
          next = top;
        } else {// restore the domain to clean up for the next search
          currentDomains.set(top.key, new Set([].concat(_toConsumableArray(domains.get(top.key)))));
        }
      }

      // remove the domain so the same solution isn't found again
      if (next) {
        currentDomains.get(next.key).delete(next.value);
      } else {
        fullySearched = true;
      }
    } else {
      fullySearched = true;
    }
  }

  // reduce the solutions to the backbone
  var backbone = [];
  assignmentOrder.forEach(function (key, index) {
    var solutionValues = new Set();
    solutions.forEach(function (solution) {return solutionValues.add(solution[index].value);});
    if (solutionValues.size === 1) {
      backbone.push({
        key: key,
        value: [].concat(_toConsumableArray(solutionValues))[0] });

    }
  });
  return backbone;
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _forwardCheck = __webpack_require__(7);
var _STR = __webpack_require__(5);function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

/**
                                                                                                                                                                                                                          * Reduces the domains based on the newDomains, adding necessary elements to the queue, and storing reductions in
                                                                                                                                                                                                                          * reduced
                                                                                                                                                                                                                          * @param {Map<number, Set<boolean>>} reduced map of reduced domains
                                                                                                                                                                                                                          * @param {Map<number, Set<boolean>>} newDomains current valid variable domains
                                                                                                                                                                                                                          * @param {Map<number, Set<boolean>>} domains old valid variable domains
                                                                                                                                                                                                                          * @param {Constraint[]} queue list of unvisited constraints
                                                                                                                                                                                                                          * @param {Map<number, Constraint[]>} constraintMap variables mapped to the constraints relevant to their forward check
                                                                                                                                                                                                                          * @param {Constraint} constraint current constraint being reduced
                                                                                                                                                                                                                          * @returns {boolean} true if reductions are consistent, false if a domain was destroyed
                                                                                                                                                                                                                          */
var reduce = function reduce(reduced, newDomains, domains, queue, constraintMap, constraint) {
  // reduce the domains
  var consistent = true;
  newDomains.forEach(function (values, key) {
    if (domains.get(key).size !== values.size) {
      domains.set(key, new Set([].concat(_toConsumableArray(domains.get(key))).filter(function (x) {
        if (values.has(x)) {
          return true;
        }
        reduced.get(key).add(x);
        return false;
      })));
      constraintMap.get(key).forEach(function (element) {
        if (element !== constraint && !queue.includes(element)) {
          queue.push(element);
        }
      });
      // check for destroyed domains
      if (domains.get(key).size === 0) {
        consistent = false;
      }
    }
  });
  return consistent;
};

/**
    * Restores the reductions of the given key.
    * @param {number} restoreKey variable key to restore reductions from
    * @param {number[]} assignmentOrder order of variable assignments
    * @param {Map<number, Constraint[]>} constraintMap variables mapped to the constraints relevant to their forward check
    * @param {Map<(number|Constraint), Set<(boolean|number)>[]>} reductions variables and constraints mapped to their
    * domain and tuple reductions respectively
    * @param {Map<number, Set<boolean>>} domains variables mapped to their valid domain
    * @param {object} diagnostics execution metrics object
    * @param {number} diagnostics.tuplesKilled number of tuples killed
    */
var restore = function restore(restoreKey, assignmentOrder, constraintMap, reductions, domains, diagnostics) {
  var futureConstraints = new Set();
  assignmentOrder.slice(assignmentOrder.indexOf(restoreKey) + 1).forEach(function (key) {
    [].concat(_toConsumableArray(reductions.get(key).pop())).forEach(function (d) {return domains.get(key).add(d);});
    constraintMap.get(key).forEach(function (constraint) {return futureConstraints.add(constraint);});
  });
  constraintMap.get(restoreKey).forEach(function (constraint) {return futureConstraints.add(constraint);});

  futureConstraints.forEach(function (constraint) {
    var tuplesToRestore = [].concat(_toConsumableArray(reductions.get(constraint).pop()));
    tuplesToRestore.forEach(function (id) {return constraint.revive(id);});
    diagnostics.tuplesKilled -= tuplesToRestore.length;
  });
};

/**
    * Maintains GAC on all future variables and constraints using STR based on the current variable assignment.
    * @param {Object[]} stack current variable assignments
    * @param {number} stack[].key variable key
    * @param {boolean} stack[].value variable assignment
    * @param {Map<number, Constraint[]>} constraintMap variables mapped to the constraints relevant to their forward check
    * @param {Map<number, Set<boolean>>} domains current variable domains
    * @param {Map<(number|Constraint), Set<(boolean|number)>[]>} reductions variables and constraints mapped to their
    * domain and tuple reductions respectively
    * @param {Object} diagnostics execution metrics object
    * @param {number} diagnostics.tuplesKilled number of tuples killed
    * @returns {boolean} true if consistent, false otherwise
    */
var forwardCheckSTR = function forwardCheckSTR(stack, constraintMap, domains, reductions, diagnostics) {
  var current = stack.slice(-1)[0];
  var future = [].concat(_toConsumableArray(constraintMap.keys())).slice(stack.length);
  var reduced = new Map();
  var futureConstraints = new Set();
  future.forEach(function (key) {
    reduced.set(key, new Set());
    constraintMap.get(key).forEach(function (constraint) {return futureConstraints.add(constraint);});
  });
  reduced.set(current.key, new Set());
  domains.set(current.key, new Set([].concat(_toConsumableArray(domains.get(current.key))).filter(function (x) {
    if (x === current.value) {
      return true;
    }
    reduced.get(current.key).add(x);
    return false;
  })));

  var queue = [];
  constraintMap.get(current.key).forEach(function (constraint) {
    queue.push(constraint);
    futureConstraints.add(constraint);
  });
  futureConstraints.forEach(function (constraint) {return reduced.set(constraint, new Set());});
  var consistent = true;var _loop = function _loop() {


    // revise the next constraint in the queue
    var constraint = queue.shift();
    var newDomains = (0, _STR.revise)(constraint, domains, diagnostics, reduced);
    if (newDomains) {
      [].concat(_toConsumableArray(newDomains.keys())).forEach(function (key) {
        if (!future.includes(key)) {
          newDomains.delete(key);
        }
      });

      // update the future domains and add any affected constraints back to the queue
      consistent = reduce(reduced, newDomains, domains, queue, constraintMap, constraint);
    } else {
      consistent = false;
    }};while (consistent && queue.length > 0) {_loop();
  }

  if (consistent) {
    reduced.get(current.key).forEach(function (value) {return domains.get(current.key).add(value);});
    reduced.delete(current.key);
    reduced.forEach(function (values, key) {return reductions.get(key).push(values);});
  } else {
    reduced.forEach(function (values, key) {
      if (typeof key === 'number') {
        values.forEach(function (value) {return domains.get(key).add(value);});
      } else {
        values.forEach(function (value) {return key.revive(value);});
      }
    });
  }

  return consistent;
};

/**
    * Attempts to assign the current variable a consistent value.
    * @param {Object[]} stack past variable assignments
    * @param {number} stack[].key variable key
    * @param {boolean} stack[].value variable assignment
    * @param {number} key variable to be assigned
    * @param {Map<number, Constraint[]>} constraintMap variables mapped to the constraints relevant to their forward checks
    * @param {Map<number, Set<boolean>>} domains current variable domains
    * @param {Map<(number|Constraint), Set<(boolean|number)>[]>} reductions variables and constraints mapped to their
    * domain and tuple reductions respectively
    * @param {Object} diagnostics execution metrics object
    * @param {number} diagnostics.timeChecking number of ms spent forward checking
    * @returns {boolean} true if labeling was successful, false if unlabeling needed
    */
var label = function label(stack, key, constraintMap, domains, reductions, diagnostics) {
  var consistent = false;
  while (domains.get(key).size > 0 && !consistent) {
    stack.push({
      key: key,
      value: [].concat(_toConsumableArray(domains.get(key)))[0] });

    var startTime = performance.now();
    if (forwardCheckSTR(stack, constraintMap, domains, reductions, diagnostics)) {
      consistent = true;
    } else {
      var value = stack.pop().value;
      domains.get(key).delete(value);
      reductions.get(key).slice(-1)[0].add(value);
    }
    diagnostics.timeChecking += performance.now() - startTime;
  }
  return consistent;
};

/**
    * Restores the domain of the current variable and removes the previous variable assignment from the stack.
    * @param {Object[]} stack past variable assignments
    * @param {number} stack[].key variable key
    * @param {boolean} stack[].value variable assignment
    * @param {number[]} assignmentOrder order of variable assignments
    * @param {Map<number, Constraint[]>} constraintMap variables mapped to the constraints relevant to their forward check
    * @param {Map<number, Set<boolean>>} domains current variable domains
    * @param {Map<(number|Constraint), Set<(boolean|number)>[]>} reductions variables and constraints mapped to their
    * domain and tuple reductions respectively
    * @param {Object} diagnostics execution metrics object
    * @param {number} diagnostics.tuplesKilled number of tuples killed
    * @return {boolean} true if consistent, false if more unlabeling needed
    */
var unlabel = function unlabel(stack, assignmentOrder, constraintMap, domains, reductions, diagnostics) {
  var variable = stack.pop();
  if (variable) {
    restore(variable.key, assignmentOrder, constraintMap, reductions, domains, diagnostics);
    domains.get(variable.key).delete(variable.value);
    reductions.get(variable.key).slice(-1)[0].add(variable.value);
    if (domains.get(variable.key).size > 0) {
      return true;
    }
  }
  return false;
};

/**
    * Searches the subspace until a solution is found or the entire subspace is traversed.
    * @param {Object[]} stack variable assignments
    * @param {number} stack[].key variable key
    * @param {boolean} stack[].boolean variable assignment
    * @param {Map<number, Set<boolean>>} domains variables mapped to the allowed values of the subspace
    * @param {Map<(number|Constraint), Set<(boolean|number)>[]>} reductions variables and constraints mapped to their
    * domain and tuple reductions respectively
    * @param {Map<number, Constraint[]>} constraintMap variables mapped to the constraints relevant to their forward check
    * @param {number[]} assignmentOrder order of variable assignments
    * @param {Object} diagnostics search metrics object
    * @param {number} diagnostics.nodesVisited number of nodes the search visited
    * @param {number} diagnostics.backtracks number of backtracks the search required
    * @param {number} diagnostics.timeChecking number of ms the search required
    * @returns {boolean} true if solution was found, false if no solution exists
    */
var search = function search(stack, domains, reductions, constraintMap, assignmentOrder, diagnostics) {
  var consistent = true;
  var currentLevel = stack.length;

  while (currentLevel >= 0 && currentLevel < assignmentOrder.length) {
    var currentVariable = assignmentOrder[currentLevel];
    if (consistent) {
      consistent = label(stack, currentVariable, constraintMap, domains, reductions, diagnostics);
      diagnostics.nodesVisited++;
      if (consistent) {
        currentLevel++;
      }
    } else {
      consistent = unlabel(stack, assignmentOrder, constraintMap, domains, reductions, diagnostics);
      currentLevel--;
      diagnostics.backtracks++;
    }
  }
  return stack.length === assignmentOrder.length;
};

/**
    * Finds all solutions to the given csp and reduces them to the backbone.
    * @param {Map<number, Set<boolean>>} domains variables mapped to their allowed values
    * @param {Map<number, Constraint[]>} constraints variables mapped to their constraints
    * @param {number[]} assignmentOrder order of variable assignments
    * @param {Object} diagnostics search metrics object
    * @param {number} diagnostics.timeFiltering number of ms spent filtering the constraints
    * @param {number} diagnostics.nodesVisited number of nodes the search visited
    * @param {number} diagnostics.backtracks number of backtracks the search required
    * @param {number} diagnostics.timeChecking number of ms the search required
    * @returns {{key: number, value: boolean}[]} list of solvable variables
    */exports.default =
function (domains, constraints, assignmentOrder, diagnostics) {
  if (!diagnostics.tuplesKilled) {
    diagnostics.tuplesKilled = 0;
  }
  // filter the constraints
  var filterTime = performance.now();
  var constraintMap = (0, _forwardCheck.constraintFilter)(constraints, assignmentOrder);
  diagnostics.timeFiltering += performance.now() - filterTime;

  var currentDomains = new Map();
  var reductions = new Map();
  assignmentOrder.forEach(function (key) {
    currentDomains.set(key, new Set([].concat(_toConsumableArray(domains.get(key)))));
    reductions.set(key, []);
    constraintMap.get(key).forEach(function (constraint) {return reductions.set(constraint, [new Set()]);});
  });
  // pad the first variable's reductions to avoid index out of bounds issues
  if (assignmentOrder.length > 0) {
    reductions.get(assignmentOrder[0]).push(new Set());
  }
  var fullySearched = false;
  var stack = [];
  var solutions = [];

  while (!fullySearched) {
    if (search(stack, currentDomains, reductions, constraintMap, assignmentOrder, diagnostics)) {
      // save the solution
      solutions.push(stack.slice());

      // find the next variable that could be solved in a different way
      var next = void 0;
      while (!next && stack.length > 0) {
        var top = stack.pop();
        if (currentDomains.get(top.key).size > 1) {
          next = top;
        } else {// restore the reductions to clean up for the next search
          restore(top.key, assignmentOrder, constraintMap, reductions, currentDomains, diagnostics);
        }
      }

      // remove the domain so the same solution isn't found again
      if (next) {
        restore(next.key, assignmentOrder, constraintMap, reductions, currentDomains, diagnostics);
        reductions.get(next.key).slice(-1)[0].add(next.value);
        currentDomains.get(next.key).delete(next.value);
      } else {
        fullySearched = true;
      }
    } else {
      fullySearched = true;
    }
  }

  // return the constraints to their previous state
  reductions.forEach(function (values, key) {
    if (typeof key !== 'number') {
      values.forEach(function (value) {return key.revive(value);});
    }
  });

  // reduce the solutions to the backbone
  var backbone = [];
  assignmentOrder.forEach(function (key, index) {
    var solutionValues = new Set();
    solutions.forEach(function (solution) {return solutionValues.add(solution[index].value);});
    if (solutionValues.size === 1) {
      backbone.push({
        key: key,
        value: [].concat(_toConsumableArray(solutionValues))[0] });

    }
  });
  return backbone;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.logDiagnostics = undefined;var _HistoryLogItem = __webpack_require__(1);var _HistoryLogItem2 = _interopRequireDefault(_HistoryLogItem);
var _utils = __webpack_require__(2);
var _enums = __webpack_require__(0);




var _backCheck = __webpack_require__(11);var _backCheck2 = _interopRequireDefault(_backCheck);
var _forwardCheck = __webpack_require__(7);var _forwardCheck2 = _interopRequireDefault(_forwardCheck);
var _forwardCheckSTR = __webpack_require__(12);var _forwardCheckSTR2 = _interopRequireDefault(_forwardCheckSTR);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

var algorithms = new Map([
[_enums.Algorithms.BC, function (domains, constraints, assignmentOrder, diagnostics) {return (
    (0, _backCheck2.default)(domains, constraints, assignmentOrder, diagnostics));}],
[_enums.Algorithms.FC, function (domains, constraints, assignmentOrder, diagnostics) {return (
    (0, _forwardCheck2.default)(domains, constraints, assignmentOrder, diagnostics));}],
[_enums.Algorithms.MAC, function (domains, constraints, assignmentOrder, diagnostics) {return (
    (0, _forwardCheckSTR2.default)(domains, constraints, assignmentOrder, diagnostics));}]]);


/**
                                                                                               * Groups all the constraints by the variables they contain.
                                                                                               * @param {Constraint[]} constraints csp model of the minefield
                                                                                               * @returns {Map<number, Set<Constraint>>} variables mapped to the constraints that contain them
                                                                                               */
var mapVariablesToConstraints = function mapVariablesToConstraints(constraints) {
  var map = new Map();

  constraints.forEach(function (constraint) {
    constraint.scope.forEach(function (variable) {
      if (!map.has(variable)) {
        map.set(variable, new Set());
      }
      map.get(variable).add(constraint);
    });
  });

  return map;
};

/**
    * Performs a backtracking search on the csp until a viable solution is found or the entire search tree is traversed,
    * indicating that the problem is impossible.
    * @param {Immutable.Map} csp constraint model of the minefield
    * @param {number} componentIndex index of component to operate on
    * @param {Immutable.Map<string, boolean> | Map<string, boolean>} isActive backtracking algorithms mapped to whether
    * they are active or not
    * @returns {Immutable.Map} updated constraint model
    */exports.default =
function (csp, componentIndex, isActive) {return csp.withMutations(function (c) {
    var solvable = new Map();
    [].concat(_toConsumableArray(algorithms.keys())).forEach(function (key) {return solvable.set(key, []);});

    // sort the constraints and set the assignment order
    var constraints = mapVariablesToConstraints(c.get('components')[componentIndex].constraints);
    var assignmentOrder = [].concat(_toConsumableArray(constraints.keys()));
    assignmentOrder.sort(function (a, b) {return c.get('domains').get(a).size - c.get('domains').get(b).size;});

    // search the tree with each active algorithm
    algorithms.forEach(function (search, algorithmKey) {
      if (isActive.get(algorithmKey)) {
        if (!c.getIn(['diagnostics', algorithmKey])) {
          var diagnostics = {
            nodesVisited: 0,
            backtracks: 0,
            timeChecking: 0,
            timeFiltering: 0 };

          c.setIn(['diagnostics', algorithmKey], diagnostics);
        }

        // search the tree
        var solvableVars =
        search(c.get('domains'), constraints, assignmentOrder, c.getIn(['diagnostics', algorithmKey]));

        solvable.set(algorithmKey, solvable.get(algorithmKey).concat(solvableVars));
      }
    });

    var solvableSet = [].concat(_toConsumableArray(solvable.values()));
    var hasSolvable = solvableSet.some(function (set) {
      if (set.length > 0) {
        solvableSet = set;
        return true;
      }
      return false;
    });

    if (hasSolvable) {
      if (!c.getIn(['solvable', _enums.Algorithms.BT])) {
        c.setIn(['solvable', _enums.Algorithms.BT], []);
      }
      c.updateIn(['solvable', _enums.Algorithms.BT], function (x) {return x.concat(solvableSet);});
      solvableSet.forEach(function (cell) {return c.get('domains').set(cell.key, new Set([cell.value]));});
    }
  });};

/**
         * Creates a formatted HistoryLogItem object to represent the diagnostics of the search iteration.
         * @param {Immutable.Map} csp constraint model of the board
         * @param {number} [numRuns=1] number of iterations recorded in the diagnostics
         * @returns {HistoryLogItem} new HistoryLogItem of the diagnostics
         */
var logDiagnostics = exports.logDiagnostics = function logDiagnostics(csp) {var numRuns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var log = new _HistoryLogItem2.default('Search', _enums.HistoryLogStyles.DEFAULT, false);
  csp.getIn(['algorithms', _enums.Algorithms.BT, 'subSets']).forEach(function (isActive, algorithm) {
    if (isActive) {
      var diagnostics = csp.getIn(['diagnostics', algorithm]);
      log.addDetail('\n' + algorithm + ':', true);
      Object.keys(diagnostics).forEach(function (key) {
        var average = diagnostics[key] / numRuns;
        var detail = void 0;
        switch (key) {
          case 'nodesVisisted':detail = '# nodes visited\t\t\t' + (0, _utils.numberWithCommas)(Math.round(average));break;
          case 'backtracks':detail = '# backtracks\t\t\t\t' + (0, _utils.numberWithCommas)(Math.round(average));break;
          case 'timeChecking':detail = 'time spent checking\t\t' + Math.round(average * 100) / 100 + ' ms';break;
          case 'timeFiltering':detail = 'time spent filtering\t\t\t' + Math.round(average * 100) / 100 + ' ms';break;
          case 'tuplesKilled':detail = '# tuples killed\t\t\t\t' + (0, _utils.numberWithCommas)(Math.round(average));break;
          default:detail = key + '\t\t\t\t' + Math.round(average);}

        log.addDetail(detail);
      });
    }
  });
  return log;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.logDiagnostics = undefined;var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _Constraint = __webpack_require__(3);var _Constraint2 = _interopRequireDefault(_Constraint);
var _HistoryLogItem = __webpack_require__(1);var _HistoryLogItem2 = _interopRequireDefault(_HistoryLogItem);
var _enums = __webpack_require__(0);




var _STR = __webpack_require__(5);var _STR2 = _interopRequireDefault(_STR);
var _utils = __webpack_require__(2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}





/**
                                                                                                                                                                                                                                                                                                                         * Finds all the edges in the graph formed by the given constraints.
                                                                                                                                                                                                                                                                                                                         * @param {Constraint[]} constraints list of Constraints
                                                                                                                                                                                                                                                                                                                         * @returns {Constraint[][]>} list of graph edges
                                                                                                                                                                                                                                                                                                                         */
var findEdges = function findEdges(constraints) {
  var edges = [];

  constraints.forEach(function (constraint1, index1) {
    constraints.slice(index1 + 1).forEach(function (constraint2) {
      var scope = _Constraint2.default.intersectScopes(constraint1, constraint2);
      if (scope.length > 1) {
        var edge = [constraint1, constraint2];
        edge.scope = scope;
        edges.push(edge);
      }
    });
  });

  return edges;
};

/**
    * Maps the edges to the constraints that they contain.
    * @param {Constraint[][]} edges list of graph edges
    * @return {Map<Constraint, Set<Constraint[]>>} constraints mapped to their edges
    */
var mapEdges = function mapEdges(edges) {
  var edgeMap = new Map();

  edges.forEach(function (edge) {return edge.forEach(function (constraint) {
      if (!edgeMap.has(constraint)) {
        edgeMap.set(constraint, new Set());
      }
      edgeMap.get(constraint).add(edge);
    });});

  return edgeMap;
};

/**
    * Finds all the pairs of size m that can be formed from the given edges. A pair is a series of nodes that form a
    * connected graph.
    * @param {Map<Constraint, Set<Constraint[]>>} edgeMap constraints mapped to their edges
    * @param {Constraint[][]} edges list of graph edges
    * @param {number} m the number of constraints to pair up
    * @returns {object[]} every valid pair of edges of size m
    */
var findPairs = function findPairs(edgeMap, edges, m) {
  // map each constraint to its graph neighbors
  var constraintMap = new Map();
  edges.forEach(function (edge) {
    if (!constraintMap.has(edge[0])) {
      constraintMap.set(edge[0], []);
    }
    constraintMap.get(edge[0]).push(edge[1]);
  });

  var edgePairs = [];
  [].concat(_toConsumableArray(constraintMap.keys())).forEach(function (constraint1) {
    var pairs = [];
    pairs.push([constraint1]);var _loop = function _loop(
    i) {
      var temp = [];
      pairs.forEach(function (pair) {return pair.forEach(function (constraint) {
          var neighbors = constraintMap.get(constraint);
          if (neighbors) {
            neighbors = neighbors.filter(function (n) {return !pair.includes(n);});
            neighbors.forEach(function (n) {return temp.push([].concat(_toConsumableArray(pair), [n]));});
          }
        });});
      pairs = temp;};for (var i = 2; i <= m; i++) {_loop(i);
    }
    edgePairs.push.apply(edgePairs, _toConsumableArray(pairs));
  });

  return edgePairs.map(function (constraints) {
    var pair = [];
    constraints.forEach(function (constraint1, index1) {
      constraints.slice(index1 + 1).forEach(function (constraint2) {
        var edge = [].concat(_toConsumableArray((0, _utils.intersect)(edgeMap.get(constraint1), edgeMap.get(constraint2))))[0];
        if (edge) {
          pair.push(edge);
        }
      });
    });
    return pair;
  });
};

/**
    * Revises the constraints of the given pair by enforcing pairwise consistency. Pairwise consistency means every tuple
    * has a supporting tuple in the other constraints of the pair.
    * @param {object[]} pair list of edges that form the pair
    * @param {Constraint[]} pair[].edge edge of the pair
    * @param {number[]} pair[].edge.scope list of variables common to the pair
    * @param {number} pair[].edge.id unique identifier of the edge
    * @param {Object} [diagnostics] execution metrics object
    * @param {number} diagnostics.tuplesKilled number of tuples killed
    * @returns {Constraint[]} list of Constraints that were revised, undefined if one of the constraints of the pair is
    * dead
    */
var revise = function revise(pair, diagnostics) {
  var isConsistent = true;
  var revisedSet = new Set();
  var queue = pair;

  // revise each edge of the pair until they reach equilibrium
  var _loop2 = function _loop2() {
    var edge = queue.shift();
    var revised = (0, _utils.reviseEdge)(edge, diagnostics);
    if (revised) {
      revised.forEach(function (constraint) {
        revisedSet.add(constraint);
        queue.push.apply(queue, _toConsumableArray(pair.filter(function (element) {return (
            element !== edge && element.includes(constraint) && !queue.includes(element));})));
      });
    } else {
      isConsistent = false;
    }};while (isConsistent && queue.length > 0) {_loop2();
  }

  return isConsistent ? [].concat(_toConsumableArray(revisedSet)) : undefined;
};

/**
    * Pair-wise consistency algorithm. Enforces tuple consistency between pairs of constraints that have scope that
    * intersect over at least 2 variables. Tuple consistency means every alive tuple of each constraint in the pair has an
    * alive supporting tuple in all other constraints of the pair.
    * @param {Immutable.Map} csp constraint representation of the minesweeper board
    * @param {number} componentIndex index of component to operate on
    * @param {number} [size=2] the maximum number of constraints to form pairs with
    */exports.default =
function (csp, componentIndex) {var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var newCSP = csp;

  // run GAC as mWC-1 if it has not already been done
  if (!csp.getIn(['algorithms', _enums.Algorithms.STR2, 'isActive'])) {
    newCSP = (0, _STR2.default)(csp, componentIndex).withMutations(function (c) {
      if (!c.getIn(['diagnostics', _enums.Algorithms.mWC1])) {
        var diagnostics = {
          time: 0,
          revisions: 0,
          tuplesKilled: 0 };

        c.setIn(['diagnostics', _enums.Algorithms.mWC1], diagnostics);
      }
      Object.entries(c.getIn(['diagnostics', _enums.Algorithms.STR2])).forEach(function (_ref) {var _ref2 = _slicedToArray(_ref, 2),key = _ref2[0],value = _ref2[1];
        c.getIn(['diagnostics', _enums.Algorithms.mWC1])[key] += value;
      });
      c.deleteIn(['diagnostics', _enums.Algorithms.STR2]);
      if (c.getIn(['solvable', _enums.Algorithms.STR2])) {
        c.setIn(['solvable', _enums.Algorithms.mWC1], c.getIn(['solvable', _enums.Algorithms.STR2]));
        c.deleteIn(['solvable', _enums.Algorithms.STR2]);
      }
    });
  }

  // run PWC for each additional level of m
  var names = [_enums.Algorithms.mWC2, _enums.Algorithms.mWC3, _enums.Algorithms.mWC4];
  return newCSP.withMutations(function (c) {
    var mWC = [[], [], []];
    // get all the edges
    var edges = findEdges(c.get('components')[componentIndex].constraints);var _loop3 = function _loop3(
    m) {var _mWC;
      var name = names[m - 2];
      if (!c.getIn(['diagnostics', name])) {
        var _diagnostics = {
          time: 0,
          revisions: 0,
          tuplesKilled: 0 };

        c.setIn(['diagnostics', name], _diagnostics);
      }
      var diagnostics = c.getIn(['diagnostics', name]);
      var PWC = [];
      var startTime = performance.now();

      // build the pairs and map each constraint to its pairs
      var pairs = findPairs(mapEdges(edges), edges, m);
      var constraintsToPairs = new Map();
      pairs.forEach(function (pair) {
        var constraints = new Set();
        pair.forEach(function (edge) {return edge.forEach(function (constraint) {return constraints.add(constraint);});});
        constraints.forEach(function (constraint) {
          if (!constraintsToPairs.has(constraint)) {
            constraintsToPairs.set(constraint, []);
          }
          constraintsToPairs.get(constraint).push(pair);
        });
      });

      // revise the pairs until they reach a steady state
      var queue = [].concat(_toConsumableArray(pairs));
      try {var _loop4 = function _loop4() {

          diagnostics.revisions++;
          var pair = queue.shift();
          var revisedConstraints = revise(pair, diagnostics);
          if (!revisedConstraints) {
            throw pair;
          }
          revisedConstraints.forEach(function (constraint) {return (
              queue.push.apply(queue, _toConsumableArray(constraintsToPairs.get(constraint).filter(function (p) {return p !== pair && !queue.includes(p);}))));});};while (queue.length > 0) {_loop4();
        }
      } catch (error) {
        error.forEach(function (constraint) {return constraint.killAll();});
      }

      // solve any variables with a domain of only one value
      c.get('components')[componentIndex].constraints.forEach(function (constraint) {
        var specs = constraint.supportedSpecs();
        if (specs) {
          PWC.push.apply(PWC, _toConsumableArray(specs));
        }
      });
      diagnostics.time += performance.now() - startTime;

      // add all PWC cells to the list of solvable cells
      (_mWC = mWC[m - 2]).push.apply(_mWC, PWC);};for (var m = 2; m <= size; m++) {_loop3(m);
    }
    mWC.forEach(function (cells, index) {
      var m = index + 2;
      var name = names[m - 2];
      if (cells.length > 0) {
        if (!c.getIn(['solvable', name])) {
          c.setIn(['solvable', name], []);
        }
        c.updateIn(['solvable', name], function (x) {return x.concat(cells);});
      }
    });
  });
};

/**
    * Creates a formatted HistoryLogItem object to represent the diagnostics of the mWC iteration.
    * @param {Immutable.Map} csp constraint model of the board
    * @param {number} [numRuns=1] number of iterations recorded in the diagnostics
    * @returns {HistoryLogItem} new HistoryLogItem of the diagnostics
    */
var logDiagnostics = exports.logDiagnostics = function logDiagnostics(csp) {var numRuns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var names = [_enums.Algorithms.mWC1, _enums.Algorithms.mWC2, _enums.Algorithms.mWC3, _enums.Algorithms.mWC4];
  var log = new _HistoryLogItem2.default('m-Wise Consistency:', _enums.HistoryLogStyles.DEFAULT, false);
  for (var m = 1; m <= csp.getIn(['algorithms', _enums.Algorithms.mWC, 'm']); m++) {
    var _name = names[m - 1];
    if (csp.getIn(['diagnostics', _name])) {(function () {
        log.addDetail('\n' + _name + ':', true);
        var diagnostics = csp.getIn(['diagnostics', _name]);
        Object.keys(diagnostics).forEach(function (key) {
          var average = diagnostics[key] / numRuns;
          var detail = void 0;
          switch (key) {
            case 'time':detail = 'CPU time\t\t\t\t' + Math.round(average * 100) / 100 + ' ms';break;
            case 'revisions':detail = '# pairs checked\t\t\t' + Math.round(average);break;
            case 'tuplesKilled':detail = '# tuples killed\t\t\t\t' + (0, _utils.numberWithCommas)(Math.round(average));break;
            default:detail = key + '\t\t\t\t' + Math.round(average);}

          log.addDetail(detail);
        });})();
    }
  }
  return log;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _Constraint = __webpack_require__(3);var _Constraint2 = _interopRequireDefault(_Constraint);
var _cellUtils = __webpack_require__(4);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                    * Creates a variable for each fringe cell.
                                                                                                                                                    * @param {Object[][]} cells matrix of cells
                                                                                                                                                    * @returns {Object[]} array of variable objects
                                                                                                                                                    */
var getVariables = function getVariables(cells) {
  var variables = [];
  var numRows = cells.size;
  var numCols = cells.get(0).size;

  // find all fringe cells and create a variable object for them
  for (var row = 0; row < numRows; row++) {
    for (var col = 0; col < numCols; col++) {
      if (cells.getIn([row, col, 'isHidden']) && (0, _cellUtils.isOnFringe)(cells, row, col)) {
        var key = row * numCols + col;
        // variable object
        variables.push({
          col: col, // column of cell
          isFlagged: cells.getIn([row, col, 'isFlagged']), // state of cell
          key: key, // variable number
          row: row // row of cell
        });
      }
    }
  }

  return variables;
};

/**
    * Generates the variables and constraints that form the csp model of the minesweeper game.
    * @param {Immutable.List<Immutable.List<{}>>} cells state of the board cell matrix
    * @returns {Immutable.Map} csp model with list of constraints and variables
    */exports.default =
function (csp, cells) {
  // get the variables
  var variables = getVariables(cells);

  // generate the constraints
  var constraints = [];var _loop = function _loop(
  row) {var _loop2 = function _loop2(
    col) {
      if (!cells.getIn([row, col, 'isHidden']) && cells.getIn([row, col, 'content']) > 0) {
        var numMines = cells.getIn([row, col, 'content']);
        var variablesInScope = variables.filter(function (variable) {
          var rowDiff = Math.abs(variable.row - row);
          var colDiff = Math.abs(variable.col - col);
          if (rowDiff <= 1 && colDiff <= 1) {
            if (variable.isFlagged) {
              numMines--;
              return false;
            }
            return true;
          }
          return false;
        });
        if (variablesInScope.length > 0 || numMines < 0) {
          constraints.push(new _Constraint2.default(variablesInScope, row, col, numMines));
        }
      }};for (var col = 0; col < cells.get(0).size; col++) {_loop2(col);
    }};for (var row = 0; row < cells.size; row++) {_loop(row);
  }
  variables = variables.filter(function (variable) {return !variable.isFlagged;});
  variables.forEach(function (variable) {delete variable.isFlagged;});

  return csp.withMutations(function (c) {
    c.set('constraints', constraints);
    c.set('variables', variables);
    c.delete('components');
  });
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _index = __webpack_require__(13);var _index2 = _interopRequireDefault(_index);
var _mWC = __webpack_require__(14);var _mWC2 = _interopRequireDefault(_mWC);
var _STR = __webpack_require__(5);var _STR2 = _interopRequireDefault(_STR);
var _HistoryLogItem = __webpack_require__(1);var _HistoryLogItem2 = _interopRequireDefault(_HistoryLogItem);
var _enums = __webpack_require__(0);



var _utils = __webpack_require__(2);

var _generateCSP = __webpack_require__(15);var _generateCSP2 = _interopRequireDefault(_generateCSP);
var _reduceComponents = __webpack_require__(17);var _reduceComponents2 = _interopRequireDefault(_reduceComponents);
var _solve = __webpack_require__(8);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

/* Algorithms mapped to their corresponding display colors */
var algorithmColors = new Map([
[_enums.Algorithms.Unary, 1],
[_enums.Algorithms.BT, 2],
[_enums.Algorithms.STR2, 3],
[_enums.Algorithms.mWC1, 3],
[_enums.Algorithms.mWC2, 4],
[_enums.Algorithms.mWC3, 5],
[_enums.Algorithms.mWC4, 6]]);


/**
                                * Checks csp model for any inconsistencies. Any unsatisfied constraints are highlighted red on the board and solving is
                                * disabled to avoid errors.
                                * @param {Immutable.Map} state state of the board
                                * @returns {Immutable.Map} updated state with any inconsistencies highlighted red and solving disabled if inconsistent
                                */
var checkConsistency = function checkConsistency(state) {return state.withMutations(function (s) {
    // remove previous inconsistency
    if (!s.getIn(['csp', 'isConsistent'])) {
      s.setIn(['csp', 'isConsistent'], true);
    }

    // color any inconsistent constraints
    var inconsistentCount = 0;
    s.getIn(['csp', 'components']).forEach(function (component) {
      component.constraints.forEach(function (constraint) {
        if (constraint.isAlive) {
          s.setIn(['minefield', 'cells', constraint.row, constraint.col, 'color'], -1);
          s.setIn(['csp', 'isConsistent'], false);
          inconsistentCount++;
        } else {
          s.setIn(['minefield', 'cells', constraint.row, constraint.col, 'color'], 0);
        }
      });
    });

    // log the processing message
    var log = void 0;
    if (inconsistentCount > 0) {
      var cellOrCells = 'inconsistencies';
      if (inconsistentCount === 1) {
        cellOrCells = 'inconsistency';
      }
      var message = 'Processing stopped due to ' + inconsistentCount + ' ' + cellOrCells;
      log = new _HistoryLogItem2.default(message, _enums.HistoryLogStyles.RED, true);
    } else {
      var count = 0;
      var details = [];
      var _cellOrCells = 'cells';
      s.getIn(['csp', 'solvable']).forEach(function (solvable, algorithm) {
        count += solvable.length;
        _cellOrCells = 'cells';
        if (solvable.length === 1) {
          _cellOrCells = 'cell';
        }
        details.push(algorithm + ' finds ' + solvable.length + ' solvable ' + _cellOrCells);
      });
      _cellOrCells = 'cells';
      if (count === 1) {
        _cellOrCells = 'cell';
      }
      var _message = 'Finds ' + count + ' solvable ' + _cellOrCells;
      log = new _HistoryLogItem2.default(_message, _enums.HistoryLogStyles.DEFAULT, false);
      details.forEach(function (detail) {return log.addDetail(detail);});
    }

    s.update('historyLog', function (h) {return h.push(log);});
  });};

/**
         * Color codes all cells that are solvable.
         * @param {object[][]} cells matrix of cell objects
         * @param {Immutable.Map} csp state of the csp model
         * @returns {object[][]} updated version of cells
         */
var colorSolvable = function colorSolvable(cells, csp) {return cells.withMutations(function (c) {
    // clear previous coloring
    csp.get('components').forEach(function (component) {
      component.variables.forEach(function (variable) {
        c.setIn([variable.row, variable.col, 'color'], 0);
        c.deleteIn([variable.row, variable.col, 'solution']);
      });
    });

    // color each solvable set of cells
    csp.get('solvable').forEach(function (solvable, algorithm) {
      var color = algorithmColors.get(algorithm);
      solvable.forEach(function (cell) {
        c.setIn([cell.row, cell.col, 'color'], color);
        c.setIn([cell.row, cell.col, 'solution'], cell.value);
      });
    });
    return c;
  });};

/**
         * Filters current minefield components against the old components to find which ones have changed and need to be
         * reevaluated.
         * @param {object[]} oldComponents previous list of unique minefield components
         * @param {object[]} components current list of unique minefield components
         * @returns {number[]} list of current component indices that need to be reevaluated
         */
var filterComponents = function filterComponents(oldComponents, components) {
  var activeComponents = [];
  if (oldComponents) {
    components.forEach(function (component, i) {
      var changed = !oldComponents.some(function (oldComponent) {return oldComponent.id === component.id;});
      if (changed) {
        activeComponents.push(i);
      }
    });
  } else {
    for (var i = 0; i < components.length; i++) {
      activeComponents.push(i);
    }
  }
  return activeComponents;
};

/**
    * Generates the csp model of the minefield. Enforces unary consistency and normalizes the constraints. Separates the
    * model into its distinct component problems. Enforces any further consistency algorithms specified by the state.
    * Checks that the proposed solution is consistent with all constraints.
    * @param {Immutable.Map} state state of the board
    * @param {boolean} [forceReevaluation=false] flag variable to force all components to be reevaluated whether they
    * changed or not
    * @returns {Immutable.Map} state with csp model, solvable cells colored, and any inconsistencies colored
    */exports.default =
function (state) {var forceReevaluation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;return state.withMutations(function (s) {
    // generate the csp model of the minefield
    s.update('csp', function (c) {return (0, _generateCSP2.default)(c, s.getIn(['minefield', 'cells']));});

    // enfore unary consistency, normalize, and separate variables and constraints into individual components
    s.update('csp', function (c) {return (0, _reduceComponents2.default)(c);});

    // filter out any components that did not change
    var activeComponents = [];
    if (forceReevaluation) {
      for (var i = 0; i < s.getIn(['csp', 'components']).length; i++) {
        activeComponents.push(i);
      }
    } else {
      activeComponents = filterComponents(state.getIn(['csp', 'components']), s.getIn(['csp', 'components']));
    }

    // get the variable domains
    var constraints = [];
    s.getIn(['csp', 'components']).forEach(function (component) {return constraints.push.apply(constraints, _toConsumableArray(component.constraints));});
    s.setIn(['csp', 'domains'], (0, _utils.getDomains)(constraints));

    // solve the csp with BTS
    if (s.getIn(['csp', 'algorithms', _enums.Algorithms.BT, 'isActive']) && (
    s.getIn(['csp', 'algorithms', _enums.Algorithms.BT, 'subSets', _enums.Algorithms.BC]) ||
    s.getIn(['csp', 'algorithms', _enums.Algorithms.BT, 'subSets', _enums.Algorithms.FC]) ||
    s.getIn(['csp', 'algorithms', _enums.Algorithms.BT, 'subSets', _enums.Algorithms.MAC]))) {
      activeComponents.forEach(function (componentIndex) {
        s.update('csp', function (c) {return (0, _index2.default)(c, componentIndex, c.getIn(['algorithms', _enums.Algorithms.BT, 'subSets']));});
      });
    } else {
      s.deleteIn(['csp', 'solvable', _enums.Algorithms.BT]);
    }

    // reduce the domains and tighten the constraints with STR
    if (s.getIn(['csp', 'algorithms', _enums.Algorithms.STR2, 'isActive'])) {
      s.deleteIn(['csp', 'solvable', _enums.Algorithms.mWC1]);
      activeComponents.forEach(function (componentIndex) {
        s.update('csp', function (c) {return (0, _STR2.default)(c, componentIndex);});
      });
    } else {
      s.deleteIn(['csp', 'solvable', _enums.Algorithms.STR2]);
    }

    // tighten the contstraints with PWC
    if (s.getIn(['csp', 'algorithms', _enums.Algorithms.mWC, 'isActive'])) {
      activeComponents.forEach(function (componentIndex) {
        s.update('csp', function (c) {return (0, _mWC2.default)(c, componentIndex, c.getIn(['algorithms', _enums.Algorithms.mWC, 'm']));});
      });
    } else {
      var names = [_enums.Algorithms.mWC1, _enums.Algorithms.mWC2, _enums.Algorithms.mWC3, _enums.Algorithms.mWC4];
      names.forEach(function (name) {s.deleteIn(['csp', 'solvable', name]);});
    }

    // parse the solvable cells
    s.updateIn(['csp', 'solvable'], function (o) {return (0, _solve.parseSolvable)(o, s.getIn(['csp', 'variables']));});

    // color the solvable cells
    s.updateIn(['minefield', 'cells'], function (c) {return colorSolvable(c, s.get('csp'));});

    // check for consistency
    return checkConsistency(s);
  });};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _utils = __webpack_require__(2);

/**
                                                                                                                      * Enforces unary consistency on all constraints. Constraints with a scope of only one variable are tested against all
                                                                                                                      * other constraints. Each unary constraint is then enforced on the constraints. The unary specs are then returned.
                                                                                                                      * @param {Constraint[]} constraints list of Constraints
                                                                                                                      * @returns {{key: number, value: boolean}[]} unary specs that can be solved
                                                                                                                      */
var enforceUnary = function enforceUnary(constraints) {
  // find all unary specs
  var unary = [];
  constraints.forEach(function (constraint) {
    if (constraint.scope.length === 1 && constraint.numAlive === 1) {
      unary.push({
        key: constraint.scope[0],
        value: constraint.tuples[0][0] });

    }
  });

  // enfore unary consistency
  constraints.forEach(function (constraint) {return constraint.killIf(unary);});

  return unary;
};


/**
    * Normalizes the constraints such that any constraint that is a subset of another constraint is removed, reducing the
    * total number of constraints. A constraint is a subset of another constraint if all of the variables within its scope
    * are also within the scope of the other constraint. Any constraint that completely envelopes that subset has its
    * solutions reduced to only those that also satisfy the subset.
    * @param {Constraint[]} constraints constraint model of the minesweeper board
    * @returns {Constraint[]} normalized constraints
    */
var normalize = function normalize(constraints) {
  // for all constraints check if all their variables are contained in another constraint
  constraints.slice().forEach(function (subConstraint) {
    var wasSubset = false; // flag for if this constraint was enveloped by another

    constraints.forEach(function (constraint) {
      // if constraint envelopes subConstraint, it is a subset
      if (subConstraint !== constraint && subConstraint.scope.every(function (key) {return constraint.isInScope(key);})) {
        var pair = [constraint, subConstraint];
        pair.scope = subConstraint.scope;
        (0, _utils.reviseEdge)(pair);
        wasSubset = true;
      }
    });

    // if the subConstraint was enveloped by any other constraint, remove it from the search space
    if (wasSubset) {
      constraints.splice(constraints.indexOf(subConstraint), 1);
    }
  });
  return constraints;
};

/**
    * Normalizes the constraint pool, reducing it to only unique constraints. Then separates variables and constraints into
    * individual component problems. A component is a set of all the constraints that have overlapping scopes and all the
    * variables that are a part of those scopes.
    * @param {Immutable.Map} csp csp model of the minefield
    * @returns {Immutable.Map} csp with normalized constraints and variables consolidated into components
    */exports.default =
function (csp) {
  // enforce unary consistency on the constraints
  var unary = enforceUnary(csp.get('constraints'));

  // normalize constraints and add the visited property to the variables
  var components = [];
  var constraints = normalize(csp.get('constraints'));
  var variables = csp.get('variables');
  var isVisited = new Map();
  variables.forEach(function (variable) {return isVisited.set(variable.key, false);});

  variables.forEach(function (variable) {
    if (!isVisited.get(variable.key)) {(function () {
        var stack = [];
        stack.push(variable.key);
        // new component object
        var component = {
          constraints: [], // list of relevant Constraints
          id: '',
          variables: [] // list of relevant variable objects
        };
        // grab all relevant variables and constraints until the component is completed
        var _loop = function _loop() {
          var currentKey = stack.pop();
          var currentVariable = variables.find(function (element) {return element.key === currentKey;});
          // check all relevant constraints for unvisited variables
          constraints.slice().forEach(function (constraint) {
            // if the constraint includes the variable
            if (constraint.isInScope(currentKey)) {
              constraint.scope.forEach(function (key) {
                if (key !== currentKey && !isVisited.get(key) && !stack.includes(key)) {
                  stack.push(key);
                }
              });
              // cut the constraint from the list to the component
              component.constraints.push(constraints.splice(constraints.indexOf(constraint), 1)[0]);
            }
          });
          isVisited.set(currentKey, true);
          component.variables.push(currentVariable);};while (stack.length > 0) {_loop();
        }

        // create a unique id for the component so it can be identified later
        var keys = component.variables.map(function (v) {return v.key;});
        keys.sort(function (a, b) {return a - b;});
        var id = '' + keys[0];
        keys.slice(1).forEach(function (key) {id += '_' + key;});
        component.id = id;

        components.push(component);})();
    }
  });

  return csp.withMutations(function (c) {
    c.delete('constraints');
    c.set('components', components);
    if (unary.length > 0) {
      c.setIn(['solvable', 'Unary'], unary);
    } else {
      c.deleteIn(['solvable', 'Unary']);
    }
  });
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.postResults = exports.initTestState = undefined;var _immutable = __webpack_require__(6);var _immutable2 = _interopRequireDefault(_immutable);
var _enums = __webpack_require__(0);
var _HistoryLogItem = __webpack_require__(1);var _HistoryLogItem2 = _interopRequireDefault(_HistoryLogItem);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}

/**
                                                                                                                                                                                                                                                                                                                                                                                                                * Mocks the state of the board with the given settings such that the tests can operate on a separate version of the
                                                                                                                                                                                                                                                                                                                                                                                                                * state.
                                                                                                                                                                                                                                                                                                                                                                                                                * @param {number} numRows number of rows in the minefield
                                                                                                                                                                                                                                                                                                                                                                                                                * @param {number} numCols number of columns in the minefield
                                                                                                                                                                                                                                                                                                                                                                                                                * @param {number} numMines number of mines in the minefield
                                                                                                                                                                                                                                                                                                                                                                                                                * @param {Immutable.Map} algorithms algorithm structure to test with
                                                                                                                                                                                                                                                                                                                                                                                                                * @returns {Immutable.Map} mocked version of state for testing with the given settings
                                                                                                                                                                                                                                                                                                                                                                                                                */
var initTestState = exports.initTestState = function initTestState(_ref) {var numRows = _ref.numRows,numCols = _ref.numCols,numMines = _ref.numMines,algorithms = _ref.algorithms;
  // create the cell matrix
  var cells = _immutable2.default.List().withMutations(function (c) {
    for (var i = 0; i < numRows; i++) {
      var row = _immutable2.default.List().withMutations(function (r) {
        for (var j = 0; j < numCols; j++) {
          r.push(_immutable2.default.Map({
            color: 0,
            content: 0,
            isFlagged: false,
            isHidden: true }));

        }
      });
      c.push(row);
    }
  });

  // wrap the cells in the minefield
  var minefield = _immutable2.default.Map({
    cells: cells,
    numFlagged: 0,
    numMines: numMines,
    numRevealed: 0 });


  // create the csp model
  var csp = _immutable2.default.Map({
    algorithms: algorithms,
    diagnostics: _immutable2.default.Map(),
    isConsistent: true,
    solvable: _immutable2.default.Map() });


  // return the initial state map
  return _immutable2.default.Map({
    csp: csp,
    historyLog: _immutable2.default.List(),
    isGameRunning: false,
    minefield: minefield,
    size: _enums.BoardSizes.CUSTOM });

};

/**
    * Posts the test results to the history log of state.
    * @param state state of the board
    * @param results mocked state containing test result logs
    * @returns newState with the test results posted
    */
var postResults = exports.postResults = function postResults(state, results) {
  // serialize the history logs back into HistoryLogItem
  var historyLogs = results.get('historyLog').map(function (o) {
    var log = new _HistoryLogItem2.default(o.get('_message'), o.get('_style'), o.get('_canJump'));
    o.get('_details').forEach(function (detail) {
      log.addDetail(detail, true);
    });
    return log;
  });
  return state.update('historyLog', function (h) {return h.push.apply(h, _toConsumableArray(historyLogs));});
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ })
/******/ ]);
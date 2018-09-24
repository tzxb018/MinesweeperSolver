/**
 * Makes solution based on arrangement and position.
 * @param {boolean} value true if placing mines, false if placing open cells
 * @param {number} length number of variables in the solution
 * @param {number} position index to start arrangement
 * @param {boolean[]} arrangement pattern of values to be placed
 * @returns {boolean[]} a solution according to spec
 */
const makeSolution = (value, length, position, arrangement) => {
  let solution = [];

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
const generatePossibilities = (numMines, numVariables) => {
  let value;
  let numValues;
  // if there are more mines to be placed than open spaces left over, switch to placing open spaces rather than mines
  if (numMines > (numVariables / 2)) {
    value = false;
    numValues = numVariables - numMines;
  } else {
    value = true;
    numValues = numMines;
  }
  const possibilities = [];

  // if there is only one possibility, just stop now
  if (numValues === 0) {
    const solution = [];
    for (let i = 0; i < numVariables; i++) {
      solution.push(!value);
    }
    possibilities.push(solution);
    return possibilities;
  }

  // set up
  let position = 0;
  const arrangement = [];
  for (let i = 0; i < numValues; i++) {
    arrangement.push(value);
  }
  let gap1 = 0;
  let gap2 = 0;
  let isDone = false;

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
};

export default class Constraint {
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
  constructor(variables, row, col, numMines) {
    this.row = row;
    this.col = col;
    this.numMines = numMines;
    this.variables = variables;
    this.scope = [];
    let minesLeftToPlace = numMines;
    variables.forEach(variable => {
      if (variable.isFlagged) {
        minesLeftToPlace--;
      } else {
        this.scope.push(variable.key);
      }
    });
    this.scope.sort((a, b) => a - b);

    // calculate all possible configurations of mines and store them as tuples
    this.tuples = generatePossibilities(minesLeftToPlace, this.scope.length);
    this.tuples.forEach((tuple, index) => {
      tuple.alive = true;
      tuple.id = index;
    });
    this.numAlive = this.tuples.length;
  }

  /* Plain Getters */
  get col() { return this.col; }
  get numAlive() { return this.numAlive; }
  get numMines() { return this.numMines; }
  get row() { return this.row; }
  get scope() { return this.scope; }
  get variables() { return this.variables; }
  /**
   * Gets whether the constraint is consistent or not.
   * @returns {boolean} true if consistent, false otherwise
   */
  get isConsistent() { return this.numAlive > 0; }
  /**
   * Gets the domains of the variables in scope that are supported by at least one alive tuple.
   * @returns {Map<number, Set<boolean>>} variable keys mapped to their supported domains
   */
  get supportedDomains() {
    const aliveTuples = this.tuples.filter(tuple => tuple.alive);
    const domains = new Map();
    aliveTuples.forEach(tuple => {
      tuple.forEach((value, index) => {
        const key = this.scope[index];
        if (!domains.has(key)) {
          domains.set(key, new Set());
        }
        domains.get(key).add(value);
      });
    });
    return domains;
  }
  /**
   * Gets only the restrictive domains, those with a size of one, of the variables in scope that are supported by at
   * least one alive tuple. Formats them as specifications.
   * @returns {Object[]} list of domain specifications {key: number, value: boolean}, empty array if no restrictions
   */
  get supportedSpecs() {
    const domains = this.supportedDomains;
    const specs = [];
    domains.forEach((values, key) => {
      if (values.size === 1) {
        specs.push({
          key,
          value: [...values][0],
        });
      }
    });
    return specs;
  }
  /**
   * Gets an array of all currently alive tuples. Empty array if no currently alive tuples.
   */
  get tuples() { return this.tuples.filter(tuple => tuple.alive); }

  /**
   * Returns whether or not the given variable is in the scope of the constraint.
   * @param {number} key unique variable key
   * @returns {boolean} true if in scope, false otherwise
   */
  isInScope(key) { return this.scope.includes(key); }

  /**
   * Returns whether or not the constraint supports the given specifications.
   * @param {Object[]} specs domain specifications to check against the tuples
   * @param {number} specs[].key variable key
   * @param {boolean} specs[].value variable domain restriction
   * @returns {boolean} true if at least one constraint supports the specs, false otherwise
   */
  isSupported(specs) {
    const aliveTuples = this.tuples.filter(tuple => tuple.alive);
    let specIndex = specs.map(variable => ({
      index: this.scope.indexOf(variable.key),
      value: variable.value,
    }));
    specIndex = specIndex.filter(variable => variable.index !== -1);
    return aliveTuples.some(tuple => specIndex.every(variable => tuple[variable.index] === variable.value));
  }

  /**
   * Ensures the tuple with the given id is dead. Updates numAlive if necessary.
   * @param {number} id id of the tuple to be killed
   * @returns {boolean[][]} new set of alive tuples
   */
  kill(id) {
    const tupleToKill = this.tuples[id];
    if (tupleToKill) {
      if (tupleToKill.alive) {
        this.numAlive--;
        tupleToKill.alive = false;
      }
    }
    return this.tuples.filter(tuple => tuple.alive);
  }

  /**
   * Ensures all tuples are dead, making the constraint inconsistent such that this.isConsistent is false.
   */
  killAll() {
    this.tuples.forEach(tuple => { tuple.alive = false; });
    this.numAlive = 0;
  }

  /**
   * Ensures any tuples that don't fulfill the given domain specifications are dead. Updates numAlive if necessary.
   * @param {Object[]} specs domain specifications to enforce on the tuples
   * @param {number} specs[].key variable key
   * @param {boolean} specs[].value variable domain restriction
   * @returns {boolean[][]} new set of alive tuples
   */
  killIf(specs) {
    specs.forEach(restriction => {
      const index = this.scope.indexOf(restriction.key);
      if (index >= 0) {
        this.tuples.forEach(tuple => {
          if (tuple.alive && tuple[index] !== restriction.value) {
            this.numAlive--;
            tuple.alive = false;
          }
        });
      }
    });
    return this.tuples.filter(tuple => tuple.alive);
  }

  /**
   * Ensures any tuples that don't fulfill at least one of the given pair options for each specification are dead.
   * Updates numAlive if necessary.
   * @param {Object[]} specs pair specifications to enforce on the tuples
   * @param {number[]} specs[].pair variable key pair
   * @param {boolean[]} specs[].options variable pair domain options
   * @returns {boolean[][]} new set of alive tuples
   */
  killIfPairs(specs) {
    specs.forEach(restriction => {
      const indices = [];
      restriction.pair.forEach(key => indices.push(this.scope.indexOf(key)));
      if (indices.every(element => element >= 0)) {
        this.tuples.forEach(tuple => {
          if (tuple.alive
          && !restriction.options.some(option => indices.every((index, i) => tuple[index] === option[i]))) {
            this.numAlive--;
            tuple.alive = false;
          }
        });
      }
    });
    return this.tuples.filter(tuple => tuple.alive);
  }

  /**
   * Finds the list of supported domain combinations of the given variable pairs.
   * @param {number[][]} pairs list of variable key pairs
   * @returns {Map<number[], boolean[][]>} list of supported domain combinations
   */
  pairDomains(pairs) {
    const domains = [];
    pairs.forEach(pair => {
      const columns = pair.map(key => this.scope.indexOf(key));
      this.tuples.filter(tuple => tuple.alive).forEach(tuple => domains.push(columns.map(index => tuple[index])));
      // filter out any duplicates
      domains.forEach((domain, index) => {
        domains.slice(index + 1).forEach(other => {
          if (domain.every((element, i) => element === other[i])) {
            domains.splice(domains.indexOf(other), 1);
          }
        });
      });
    });
    return domains;
  }

  /**
   * Resets the constraint to its initial state.
   * @returns {boolean[][]} new set of alive tuples
   */
  reset() {
    this.tuples.forEach(tuple => { tuple.alive = true; });
    this.numAlive = this.tuples.length;
    return this.tuples;
  }

  /**
   * Ensures the tuple with the given id is alive. Updates numAlive if necessary.
   * @param {number} id id of tuple to be revived
   * @returns {boolean[][]} new set of alive tuples
   */
  revive(id) {
    const tupleToRevive = this.tuples[id];
    if (tupleToRevive) {
      if (!tupleToRevive.alive) {
        this.numAlive++;
        tupleToRevive.alive = true;
      }
    }
    return this.tuples.filter(tuple => tuple.alive);
  }

  /**
   * Converts a set of pair domains into an array of specs. The specs contain only the restrictive pair domains.
   * @param {Map<number[], boolean[][]>} pairDomains variable pairs mapped to their allowed pair domains
   * @returns {{pair: number[], options: boolean[][]}[]} restrictive constraint specifications
   */
  static pairDomainsToOptions(pairDomains) {
    const specs = [];
    pairDomains.forEach((options, pair) => {
      if (options.length < (2 ** pair.length)) {
        specs.push({
          pair,
          options,
        });
      }
    });
    return specs;
  }

  /**
   * Converts a set of domains into an array of specs. The specs contain only the restrictive domains.
   * @param {Map<number, Set<boolean>>} domains variables mapped to their allowed domains
   * @returns {{key: number, value: boolean}[]} restrictive constraint specifications
   */
  static domainsToSpecs(domains) {
    const specs = [];
    domains.forEach((values, key) => {
      if (values.size === 1) {
        specs.push({
          key,
          value: [...values][0],
        });
      }
    });
    return specs;
  }
}

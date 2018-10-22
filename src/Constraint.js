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

  // if there is only one possibility or no possibilities, just stop now
  if (numValues === 0) {
    const solution = [];
    for (let i = 0; i < numVariables; i++) {
      solution.push(!value);
    }
    possibilities.push(solution);
    return possibilities;
  }
  if (numMines < 0) {
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
    this._row = row;
    this._col = col;
    this._numMines = numMines;
    this._variables = variables;
    this._scope = variables.map(variable => variable.key);
    this._scope.sort((a, b) => a - b);

    // calculate all possible configurations of mines and store them as tuples
    this._tuples = generatePossibilities(numMines, this._scope.length);
    this._tuples.forEach((tuple, index) => {
      tuple.alive = true;
      tuple.id = index;
    });
    this._numAlive = this._tuples.length;
  }

  /* Plain Getters */
  get col() { return this._col; }
  get numAlive() { return this._numAlive; }
  get numMines() { return this._numMines; }
  get row() { return this._row; }
  get scope() { return this._scope; }
  get variables() { return this._variables; }
  /**
   * Gets whether the constraint is consistent or not.
   * @returns {boolean} true if consistent, false otherwise
   */
  get isConsistent() { return this._numAlive > 0; }
  /**
   * Gets an array of all currently alive tuples. Empty array if no currently alive tuples.
   */
  get tuples() { return this._tuples.filter(tuple => tuple.alive); }

  /**
   * Gets the domains of the variables in scope that are supported by at least one alive tuple. Can also take in specs
   * to enforce on the tuples, without killing them, before the supported domains are determined.
   * @param {Object[]} [specs] domain specifications to check against the tuples
   * @param {number} specs[].key variable key
   * @param {boolean} specs[].value variable domain restriction
   * @returns {Map<number, Set<boolean>>} variable keys mapped to their supported domains, undefined if no domains up to
   * spec or if no tuples alive
   */
  supportedDomains(specs) {
    // map and filter the specs if there are any
    let specIndex = [];
    if (specs) {
      specIndex = specs.map(variable => ({
        index: this._scope.indexOf(variable.key),
        value: variable.value,
      }));
      specIndex = specIndex.filter(variable => variable.index !== -1);
    }

    // find the supported domains
    const domains = new Map();
    this.tuples.forEach(tuple => {
      if (specIndex.every(variable => tuple[variable.index] === variable.value)) {
        tuple.forEach((value, index) => {
          const key = this._scope[index];
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
   */
  supportedSpecs(specs) {
    const domains = this.supportedDomains(specs);
    if (!domains) {
      return undefined;
    }
    const newSpecs = [];
    domains.forEach((values, key) => {
      if (values.size === 1) {
        newSpecs.push({
          key,
          value: [...values][0],
        });
      }
    });
    return newSpecs;
  }

  /**
   * Returns whether or not the given variable is in the scope of the constraint.
   * @param {number} key unique variable key
   * @returns {boolean} true if in scope, false otherwise
   */
  isInScope(key) { return this._scope.includes(key); }

  /**
   * Returns whether or not the constraint supports the given specifications.
   * @param {Object[]} specs domain specifications to check against the tuples
   * @param {number} specs[].key variable key
   * @param {boolean} specs[].value variable domain restriction
   * @returns {boolean} true if at least one constraint supports the specs, false otherwise
   */
  isSupported(specs) {
    let specIndex = specs.map(variable => ({
      index: this._scope.indexOf(variable.key),
      value: variable.value,
    }));
    specIndex = specIndex.filter(variable => variable.index !== -1);
    return this.tuples.some(tuple => specIndex.every(variable => tuple[variable.index] === variable.value));
  }

  /**
   * Ensures the tuple with the given id is dead. Updates numAlive if necessary.
   * @param {number} id id of the tuple to be killed
   * @returns {boolean[][]} new set of alive tuples
   */
  kill(id) {
    const tupleToKill = this._tuples[id];
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
   */
  killAll() {
    this._tuples.forEach(tuple => { tuple.alive = false; });
    this._numAlive = 0;
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
      const index = this._scope.indexOf(restriction.key);
      if (index >= 0) {
        this.tuples.forEach(tuple => {
          if (tuple[index] !== restriction.value) {
            this._numAlive--;
            tuple.alive = false;
          }
        });
      }
    });
    return this.tuples;
  }

  /**
   * Finds the list of supported domain combinations of the given variable pair.
   * @param {number[]} pair variable key pairs
   * @returns {boolean[][]} list of supported domain combinations
   */
  pairDomain(pair) {
    const values = [];
    const columns = pair.map(key => this._scope.indexOf(key));
    this.tuples.forEach(tuple => values.push(columns.map(index => tuple[index])));
    // filter out any duplicates
    values.forEach((value, index) => {
      values.slice(index + 1).forEach(other => {
        if (value.every((element, i) => element === other[i])) {
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
   */
  regionalize(pair) {
    const regions = new Map();
    const index = pair.map(key => this._scope.indexOf(key));
    this.tuples.forEach(tuple => {
      const domain = index.map(i => tuple[i]);
      let domainKey = '';
      domain.forEach(b => {
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
      regions.get(domainKey).push(tuple.key);
    });
    return regions;
  }

  /**
   * Resets the constraint to its initial state.
   * @returns {boolean[][]} new set of alive tuples
   */
  reset() {
    this._tuples.forEach(tuple => { tuple.alive = true; });
    this._numAlive = this._tuples.length;
    return this._tuples;
  }

  /**
   * Ensures the tuple with the given id is alive. Updates numAlive if necessary.
   * @param {number} id id of tuple to be revived
   * @returns {boolean[][]} new set of alive tuples
   */
  revive(id) {
    const tupleToRevive = this._tuples[id];
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

  /**
   * Intersects multiple constraint scopes to find the variables they have in common.
   * @param {...Constraint} constraints constraints to intersect
   * @returns {number[]} list of variables common to all given constraints
   */
  static intersectScopes(...constraints) {
    let intersect = constraints[0].scope;
    constraints.slice(1).forEach(constraint => {
      intersect = intersect.filter(key => constraint.isInScope(key));
    });
    return intersect;
  }
}

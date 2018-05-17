/**
 * Determines whether a cell is on the fringe.
 * @param cells matrix of cells
 * @param i row of cell
 * @param j col of cell
 * @returns boolean
 */
const isOnFringe = (cells, i, j) => {
  // if the cell has any revealed cells adjacent to it, return true, else, return false
  if (i - 1 >= 0 && j - 1 >= 0 && !cells.getIn([i - 1, j - 1, 'hidden'])) {
    return true;
  } else if (i - 1 >= 0 && !cells.getIn([i - 1, j, 'hidden'])) {
    return true;
  } else if (i - 1 >= 0 && j + 1 < cells.get(0).size && !cells.getIn([i - 1, j + 1, 'hidden'])) {
    return true;
  } else if (j + 1 < cells.get(0).size && !cells.getIn([i, j + 1, 'hidden'])) {
    return true;
  } else if (i + 1 < cells.size && j + 1 < cells.get(0).size && !cells.getIn([i + 1, j + 1, 'hidden'])) {
    return true;
  } else if (i + 1 < cells.size && !cells.getIn([i + 1, j, 'hidden'])) {
    return true;
  } else if (i + 1 < cells.size && j - 1 >= 0 && !cells.getIn([i + 1, j - 1, 'hidden'])) {
    return true;
  } else if (j - 1 >= 0 && !cells.getIn([i, j - 1, 'hidden'])) {
    return true;
  }
  return false;
};

/**
 * Formulates valid solution based on arrangement and position.
 * @param value value to be placed
 * @param length number of variables in the solution
 * @param position index to start arrangement
 * @param arrangement pattern of values to be placed
 * @returns arrangement with necessary padding on either end to make a valid solution
 */
const makeSolution = (value, length, position, arrangement) => {
  let solution = [];

  // pad solution with default values on either end as necessary
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
 * Generates all the possible configurations of mines.
 * @param minesLeft number of mines still to be placed
 * @param numVariables number of variable cells
 * @returns matrix of configurations with one solution in each row
 */
const generatePossibilities = (minesLeft, numVariables) => {
  let value = true;
  let numValues = minesLeft;
  // if there are more mines to be placed than open spaces left over, switch to placing open spaces
  if (minesLeft > numVariables / 2) {
    value = false;
    numValues = numVariables - minesLeft;
  }
  const configurations = [];
  // edge case: if there is only one possibility just stop now
  if (numValues === 0) {
    configurations.push([]);
    for (let i = 0; i < numVariables; i++) {
      configurations[0].push(!value);
    }
    return configurations;
  }
  // create the first arrangement of values
  let position = 0;                     // index to start the arrangment
  const arrangement = [];               // arrangement of values to be placed
  for (let i = 0; i < numValues; i++) {
    arrangement.push(value);
  }
  let gap1 = 0;                         // length of gap between first and second value
  let gap2 = 0;                         // length of gap between second and third value
  let flag = true;                      // flag if a solution is found to be invalid

  // iterate until there are no more valid solutions
  while (flag) {
    // make all possible solutions with given arrangement of values
    while (position + arrangement.length <= numVariables) {
      configurations.push(makeSolution(value, numVariables, position, arrangement));
      position++;
    }
    // adjust the arrangement and check if it is a valid solution
    if (arrangement.length >= numVariables) {
      if (gap1 === 0) {
        if (gap2 === 0) {
          flag = false;
        } else {
          if (numValues < 4) {
            flag = false;
          } else {
            arrangement.splice(2, gap2);
            arrangement.splice(3, 0, !value);
            gap2 = 0;
          }
        }
      } else {
        if (numValues < 3) {
          flag = false;
        } else {
          gap2++;
          arrangement.splice(1, gap1);
          arrangement.splice(2, 0, !value);
          gap1 = 0;
        }
      }
    } else {
      if (numValues < 2) {
        flag = false;
      } else {
        gap1++;
        arrangement.splice(1, 0, !value);
      }
    }
    // reset the position
    position = 0;
  }

  return configurations;
};

/**
 * Creates the constraint object representing the given cell.
 * @param variables array of variable objects
 * @param row cell row
 * @param col cell col
 * @param numMines number of mines this constraint allows for
 * @returns matrix with variable keys in first row, and all possible solutions in subsequent rows
 */
const buildConstraint = (variables, row, col, numMines) => {
  const constraint = [];
  constraint.row = row;
  constraint.col = col;
  constraint.push([]);
  let minesLeft = numMines;

  // find all variables in the scope and store their keys in the first row of the constraint
  variables.forEach(variable => {
    if (variable.row >= row - 1
        && variable.row <= row + 1
        && variable.col >= col - 1
        && variable.col <= col + 1) {
      // if the variable is flagged, adjust the number of mines to be placed
      if (variable.isFlagged) {
        minesLeft--;
      // else add the variable to the constraint scope
      } else {
        constraint[0].push(variable.key);
      }
    }
  });

  // return empty constraint if too many flags around it
  if (minesLeft < 0) {
    constraint.alive = 0;
    return constraint;
  }

  // calculate all possible configurations of mines
  const configurations = generatePossibilities(minesLeft, constraint[0].length);
  // transfer the solutions into the constraint
  for (let i = 1; i <= configurations.length; i++) {
    constraint.push([]);
    constraint[i].alive = true;
    for (let j = 0; j < constraint[0].length; j++) {
      constraint[i].push(configurations[i - 1][j]);
    }
  }
  constraint.alive = constraint.length - 1;
  return constraint;
};

/**
 * Creates a variable for each fringe cell
 * @param cells matrix of cells
 * @returns array of variable objects
 */
const getVariables = cells => {
  const variables = [];
  let key = 0;

  // find all fringe cells and create a variable object for them
  for (let row = 0; row < cells.size; row++) {
    for (let col = 0; col < cells.get(0).size; col++) {
      if (cells.getIn([row, col, 'hidden']) && isOnFringe(cells, row, col)) {
        // variable object
        variables.push({
          col,                                            // column of cell
          isFlagged: cells.getIn([row, col, 'flagged']),  // state of cell
          key,                                            // variable number
          row,                                            // row of cell
        });
        key++;
      }
    }
  }

  return variables;
};

/**
 * Generates the variables and constraints that form the csp model of the minesweeper game.
 * @param csp the old csp model
 * @param cells state of the board cell matrix
 * @returns csp model with list of constraints and variables
 */
export default (csp, cells) => {
  // get the variables
  const variables = getVariables(cells);

  // generate the constraints
  const constraints = [];
  for (let row = 0; row < cells.size; row++) {
    for (let col = 0; col < cells.get(0).size; col++) {
      if (!cells.getIn([row, col, 'hidden'])
      && cells.getIn([row, col, 'mines']) > 0) {
        constraints.push(buildConstraint(variables, row, col, cells.getIn([row, col, 'mines'])));
      }
    }
  }

  return csp.withMutations(c => {
    c.set('constraints', constraints);
    c.set('variables', variables);
    c.delete('components');
  });
};

import Immutable from 'immutable';

/**
 * Determines whether a cell is on the fringe
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
 * Formulates valid solution based on arrangement and position
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
 * Generates all the possible configurations of mines
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
 * Creates the constraint for a given cell
 * @param variables list of all variables found
 * @param x cell row
 * @param y cell col
 * @param numMines number of mines this constraint allows for
 * @returns matrix with variable keys in first row, and all possible solutions in subsequent rows
 */
export const buildConstraint = (variables, x, y, numMines) => {
  const constraint = [];
  constraint.push([]);
  let minesLeft = numMines;

  // find all variables in the scope and store their keys in the first row of the constraint
  for (let key = 0; key < variables.length; key++) {
    if (variables[key].row >= x - 1 && variables[key].row <= x + 1
        && variables[key].col >= y - 1 && variables[key].col <= y + 1) {
      constraint[0].push(key);
      // adjust the number of mines to be placed if a cell is already flagged
      if (variables[key].isFlagged) {
        minesLeft--;
      }
    }
  }

  // calculate all possible configurations of mines
  const numVariables = constraint[0].length - (numMines - minesLeft);
  const configurations = generatePossibilities(minesLeft, numVariables);
  // create enough space in the constraint to store the solutions
  for (let i = 1; i <= configurations.length; i++) {
    constraint.push([]);
    for (let j = 0; j < constraint[0].length; j++) {
      constraint[i].push(false);
    }
  }

  // transfer the solutions into each row of the constraint
  let count = 0;
  for (let i = 0; i < constraint[0].length; i++) {
    if (variables[constraint[0][i]].isFlagged) {
      for (let j = 1; j <= configurations.length; j++) {
        constraint[j][i] = true;
      }
    } else {
      for (let j = 1; j <= configurations.length; j++) {
        constraint[j][i] = configurations[j - 1][count];
      }
      count++;
    }
  }

  return constraint;
};

/**
 * Separates variables and constraints into individual components
 * @param vars array of variable objects
 * @param constrs list of constraint matrices
 * @returns immutable list of component objects
 */
export const separateComponents = (vars, constrs) => {
  // create copy of variables and constraints
  let components = Immutable.List();
  const constraints = constrs;
  const variables = vars;
  // add a marker to all variables to record which have been visited already
  for (let i = 0; i < variables.length; i++) {
    variables[i].visited = false;
  }

  // look at each variable to discern separate components
  for (let i = 0; i < variables.length; i++) {
    // grab the first unvisited variable and make a new component for it
    if (!variables[i].visited) {
      const stack = [];
      stack.push(i);
      // component object
      const component = {
        constraints: [],  // list of relevant constraint matrices
        variables: [],    // list of relevant variable objects
      };
      // grab all relevant variables and constraints until the component is completed
      while (stack.length > 0) {
        // check all relevant constraints for unvisited variables
        for (let j = 0; j < constraints.length; j++) {
          if (constraints[j][0].includes(stack[0])) {
            for (let k = 0; k < constraints[j][0].length; k++) {
              const key = constraints[j][0][k];
              if (!variables[key].visited) {
                stack.push(key);
              }
            }
            // cut visited contraint from the list to the component
            component.constraints.push(constraints.splice(j, 1));
          }
        }
        // shift visited variable (original) from the stack to the component
        variables[stack[0]].visited = true;
        component.variables.push(vars[stack.shift()]);
      }
      // add completed component to the list
      components = components.push(component);
    }
  }

  return components;
};

/**
 * Find each fringe cell and create a variable for it
 * @param cells matrix of cells
 * @returns list of variable objects
 */
export const setVariables = cells => {
  const variables = [];
  let count = 0;

  // find all fringe cells and create a variable for them
  for (let i = 0; i < cells.size; i++) {
    for (let j = 0; j < cells.get(0).size; j++) {
      if (cells.getIn([i, j, 'hidden']) && isOnFringe(cells, i, j)) {
        // variable object
        variables.push({
          col: j,                                     // column of cell
          isFlagged: cells.getIn([i, j, 'flagged']),  // state of cell
          key: count,                                 // variable number
          row: i,                                     // row of cell
        });
        count++;
      }
    }
  }

  return variables;
};

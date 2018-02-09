import Immutable from 'immutable';
import { generatePossibilities } from './algorithm';

/**
 * Color codes all cells that are part of a component
 * @param {*} cells array of cells
 * @param {*} components list of components
 */
export const colorCodeComponents = (cells, components) => cells.withMutations(c => {
  // removes any old coloring
  for (let i = 0; i < cells.size; i++) {
    for (let j = 0; j < cells.get(0).size; j++) {
      c.setIn([i, j, 'component'], 0);
    }
  }

  // adds the new color to the pertinent cells
  for (let i = 0; i < components.size; i++) {
    for (let j = 0; j < components.get(i).variables.length; j++) {
      const variable = components.get(i).variables[j];
      c.setIn([variable.row, variable.col, 'component'], i + 1);
    }
  }
  return c;
});

/**
 * Creates the constraint for cell at row: x, col: y
 * @param {*} variables array of variables
 * @param {*} x row
 * @param {*} y col
 * @param {*} numMines number of mines this constraint allows for
 */
export const buildConstraint = (variables, x, y, numMines) => {
  const constraint = [];
  constraint.push([]);
  let minesLeft = numMines;
  for (let key = 0; key < variables.length; key++) {
    // if the variable is within the scope of the constraint, add it to the list
    if (variables[key].row >= x - 1 && variables[key].row <= x + 1
        && variables[key].col >= y - 1 && variables[key].col <= y + 1) {
      constraint[0].push(key);
      // if the variable is already flagged, adjust minesLeft to be placed
      if (variables[key].isFlagged) {
        minesLeft--;
      }
    }
  }

  // get all possible configurations and transfer them to the constraint
  const numVariables = constraint[0].length - (numMines - minesLeft);
  const configurations = generatePossibilities(minesLeft, numVariables);
  for (let i = 1; i <= configurations.length; i++) {
    constraint.push([]);
    for (let j = 0; j < constraint[0].length; j++) {
      constraint[i].push(false);
    }
  }
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
 * Enforces unary constraints
 * @param {*} constraints
 */
export const enforceUnary = (constrs) => {
  const constraints = constrs;
  for (let i = 0; i < constraints.length; i++) {
    for (let k = 0; k < constraints[i][0].length; k++) {
      let j = 1;
      const value = constraints[i][j][k];
      let unary = true;
      while (j < constraints[i].length && unary) {
        unary = constraints[i][j][k] === value;
        j++;
      }
      if (unary) {
        console.log('is unary');
      }
    }
  }
  return constraints;
};

/**
 * Calculates whether the cell at row: i, col: j is on a fringe
 * @param {*} cells array of cells
 * @param {*} i row
 * @param {*} j col
 */
const isOnFringe = (cells, i, j) => {
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
 * Checks if a given solution is supported by a given constraint
 * @param {*} solution possible solution
 * @param {*} constraint array of possible solutions
 */
const isSupported = (solution, constraint) => {
  let i = 1;
  let support = false;
  while (i < constraint.length && !support) {
    support = constraint[i].every((value, index) => value === solution[index]);
    i++;
  }
  return support;
};

/**
 * Reduces the number of constraints by removing any that are contained
 * within another
 * @param {*} constraints array of constraints
 */
export const normalize = (constraints) => {
  const normalized = constraints;
  // for all constraints check if all their variables are contained in another constraint
  for (let i = 0; i < normalized.length; i++) {
    let wasSubset = false;
    for (let l = 0; l < normalized.length; l++) {
      let isSubset = true;
      // if this is a possible subset
      if (i !== l && normalized[i][0].length <= normalized[l][0].length) {
        const keyIndex = [];
        for (let k = 0; k < normalized[i][0].length; k++) {
          const index = normalized[l][0].indexOf(normalized[i][0][k]);
          if (index === -1) {
            isSubset = false;
          } else {
            keyIndex.push(index);
          }
        }
        // if still a subset
        if (isSubset) {
          // check that each possibility in the big set has support in the subset
          for (let m = 1; m < normalized[l].length; m++) {
            const solution = [];
            keyIndex.forEach(element => {
              solution.push(normalized[l][m][element]);
            });
            // if it isn't supported delete it out of the big array
            if (!isSupported(solution, normalized[i])) {
              normalized[l].splice(m, 1);
            }
          }
        }
      } else {
        isSubset = false;
      }
      if (isSubset) {
        wasSubset = true;
      }
    }
    if (wasSubset) {
      // after all the big arrays are all cleaned up, delete the small array from normalized
      normalized.splice(i, 1);
      i--;
    }
  }
  return normalized;
};

/**
 * Separates variables into individual component problems
 * @param {*} vars array of fringe variable objects
 * @param {*} constraints array of constraint objects
 */
export const separateComponents = (vars, constrs) => {
  let components = Immutable.List();
  const constraints = constrs;
  const variables = vars;
  // add a marker to all variables to record which have been visited already
  for (let i = 0; i < variables.length; i++) {
    variables[i].visited = false;
  }

  for (let i = 0; i < variables.length; i++) {
    // grab the first unvisited variable and make a new component for it
    if (!variables[i].visited) {
      const stack = [];
      stack.push(i);
      const component = {
        constraints: [],
        variables: [],
      };
      while (stack.length > 0) {
        // grab all unvisited variables from all relevant constraints
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
        // shift visited variable from the stack to the component
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
 * Finds each fringe cell and assigns it a variable
 * @param {*} cells array of cells
 */
export const setVariables = (cells) => {
  const variables = [];
  let count = 0;
  for (let i = 0; i < cells.size; i++) {
    for (let j = 0; j < cells.get(0).size; j++) {
      if (cells.getIn([i, j, 'hidden']) && isOnFringe(cells, i, j)) {
        variables.push({
          col: j,
          isFlagged: cells.getIn([i, j, 'flagged']),
          key: count,
          row: i,
        });
        count++;
      }
    }
  }
  return variables;
};

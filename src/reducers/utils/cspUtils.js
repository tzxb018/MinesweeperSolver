import Immutable from 'immutable';

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
 * Algorithm that generates all the possible configurations of mines
 * @param {*} minesLeft number of mines left to be found
 * @param {*} numVariables number of variable cells
 * @param {*} numPossibilities number of possible configurations
 */
const generateAllPossibilities = (minesLeft, numVariables, numPossibilities) => {
  const configurations = [];
  let lead = 0;
  let firstGap = null;
  let secondGap = null;
  let thirdGap = null;
  let placeValue = true;
  let valuesNeeded = minesLeft;
  if (minesLeft > numVariables / 2) {
    placeValue = false;
    valuesNeeded = numVariables - minesLeft;
  }
  // calculate which variables are needed
  if (valuesNeeded > 1) {
    firstGap = 0;
  }
  if (valuesNeeded > 2) {
    secondGap = 0;
  }
  if (valuesNeeded > 3) {
    thirdGap = 0;
  }
  // for all solutions
  for (let i = 0; i < numPossibilities; i++) {
    // add space for new solution
    configurations.push([]);
    let valuesLeft = valuesNeeded;
    let totalGaps = 0;
    // if the gaps are maxed, reset those that are full and iterate
    if (totalGaps === numVariables - valuesNeeded) {
      // if lead is empty, something else needs reset
      if (lead === 0) {
        // if first gap is empty, the second gap needs reset
        if (firstGap === 0) {
          secondGap = 0;
          thirdGap++;
        // else reset first gap
        } else {
          firstGap = 0;
          secondGap++;
        }
      // else reset lead
      } else {
        lead = 0;
        firstGap++;
      }
    } else {
      lead++;
    }
    for (let j = 0; j < numVariables; j++) {
      // if all values are already placed, finish solution with defaults
      if (valuesLeft === 0) {
        configurations[i].push(!placeValue);
      } else {
        // if the lead is over, place the first value
        if (j === lead) {
          configurations[i].push(placeValue);
          valuesLeft--;
          totalGaps += lead;
        // if the first gap is needed and over, place the second value
        } else if (firstGap !== null && j === lead + firstGap + 1) {
          configurations[i].push(placeValue);
          valuesLeft--;
          totalGaps += firstGap;
        // if the second gap is needed and over, place the third value
        } else if (secondGap !== null && j === lead + firstGap + secondGap + 2) {
          configurations[i].push(placeValue);
          valuesLeft--;
          totalGaps += secondGap;
        // if the third gap is needed and over, place the fourth value
        } else if (thirdGap !== null && j === lead + firstGap + secondGap + thirdGap + 3) {
          configurations[i].push(placeValue);
          valuesLeft--;
          totalGaps += thirdGap;
        // if none of the gaps are finished, pad with default values
        } else {
          configurations[i].push(!placeValue);
        }
      }
    }
  }
  return configurations;
};

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

  // calculate how many possible configurations there are and fill the contstraint with
  // enough space to fit each one
  const numVariables = constraint[0].length - (numMines - minesLeft);
  let numPossibilities = 1;
  for (let i = 0; i < minesLeft; i++) {
    numPossibilities *= (numVariables - i) / (i + 1);
  }
  for (let i = 1; i <= numPossibilities; i++) {
    constraint.push([]);
    for (let j = 0; j < numVariables; j++) {
      constraint[i].push(null);
    }
  }

  // get all possible configurations and transfer them to the constraint
  const configurations = generateAllPossibilities(minesLeft, numVariables, numPossibilities);
  let count = 0;
  for (let i = 0; i < constraint[0].length; i++) {
    if (variables[constraint[0][i]].isFlagged) {
      for (let j = 1; j <= numPossibilities; j++) {
        constraint[j][i] = true;
      }
    } else {
      for (let j = 1; j <= numPossibilities; j++) {
        constraint[j][i] = configurations[j - 1][count];
      }
      count++;
    }
  }
  return constraint;
};

/**
 * Finds whether the given constraint contains the given key
 * @param {*} constraint
 * @param {*} key
 */
const constraintContains = (constraint, key) => {
  for (let i = 0; i < constraint.length; i++) {
    if (constraint[0][i] === key) {
      return true;
    }
  }
  return false;
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
      variables[i].visited = true;
      const component = {
        constraints: [],
        variables: [],
      };
      while (stack.length > 0) {
        // grab all unvisited variables from all relevant constraints
        for (let j = 0; j < constraints.length; j++) {
          if (constraintContains(constraints[j], stack[0])) {
            for (let k = 0; k < constraints[j][0].length; k++) {
              const key = constraints[j][0][k];
              if (!variables[key].visited) {
                stack.push(key);
                variables[key].visited = true;
              }
            }
            // cut visited contraint from the list to the component
            component.constraints.push(constraints.splice(j, 1));
          }
        }
        // shift visited variable from the stack to the component
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

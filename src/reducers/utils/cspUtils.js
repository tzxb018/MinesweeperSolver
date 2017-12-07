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
  let minesLeft = numMines;
  for (let i = 0; i < variables.length; i++) {
    // if the variable is within the scope of the constraint, add it to the list
    if (variables[i].row >= x - 1 && variables[i].row <= x + 1
        && variables[i].col >= y - 1 && variables[i].col <= y + 1) {
      constraint.push([]);
      constraint[constraint.length - 1].push(i);
      // if the variable is already flagged, adjust minesLeft to be placed
      if (variables[i].isFlagged) {
        minesLeft--;
      }
    }
  }

  // calculate how many possible configurations there are
  const numVariables = constraint.length - (numMines - minesLeft);
  let numPossibilities = 1;
  for (let i = 0; i < minesLeft; i++) {
    numPossibilities *= (numVariables - i) / (i + 1);
  }

  // preset any flagged variables in the constraint to true
  for (let i = 0; i < constraint.length; i++) {
    if (variables[constraint[i]].isFlagged) {
      for (let j = 1; j <= numPossibilities; j++) {
        constraint[i].push(true);
      }
    }
  }

  // get all possible configurations and transfer them to the constraint
  const configurations = generateAllPossibilities(minesLeft, numVariables, numPossibilities);
  let count = 0;
  for (let i = 0; i < constraint.length; i++) {
    if (constraint[i].length === 1) {
      for (let j = 0; j < numPossibilities; j++) {
        constraint[i].push(configurations[j][count]);
        count++;
      }
    }
  }
  return constraint;
};

/**
 * Calculates whether the cell at row: i, col: j is on a fringe
 * @param {*} cells array of cells
 * @param {*} i row
 * @param {*} j col
 */
export const isOnFringe = (cells, i, j) => {
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

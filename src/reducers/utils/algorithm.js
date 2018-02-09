/**
 * Formulates solution based on where mines should be
 * @param value value to be placed
 * @param length number of variables in the solution
 * @param position index to start arrangement
 * @param arrangement array of value indices for the arrangement
 */
const makeSolution = (value, length, position, arrangement) => {
  let solution = [];
  while (solution.length < length) {
    // if the position hasn't been reached yet, pad with defaults
    if (solution.length < position) {
      solution.push(!value);
    // if the arrangement is finished, finish with defaults
    } else if (solution.length > position) {
      solution.push(!value);
    // do the arrangement
    } else {
      solution = solution.concat(arrangement);
    }
  }
  return solution;
};

/**
 * Algorithm that generates all the possible configurations of mines
 * @param {*} minesLeft number of mines left to be found
 * @param {*} numVariables number of variable cells
 */
export const generatePossibilities = (minesLeft, numVariables) => {
  let value = true;
  let numValues = minesLeft;
  // if there are more mines to be placed than open spaces, switch to placing open spaces for efficiency
  if (minesLeft > numVariables / 2) {
    value = false;
    numValues = numVariables - minesLeft;
  }
  const configurations = [];
  // if there is only one possibility just stop now
  if (numValues === 0) {
    configurations.push([]);
    for (let i = 0; i < numVariables; i++) {
      configurations[0].push(!value);
    }
    return configurations;
  }
  let position = 0;
  const arrangement = [];
  for (let i = 0; i < numValues; i++) {
    arrangement.push(value);
  }
  let gap1 = 0;
  let gap2 = 0;
  let flag = true;
  // for all solutions
  while (flag) {
    // make all solutions with given arrangement
    while (position + arrangement.length <= numVariables) {
      configurations.push(makeSolution(value, numVariables, position, arrangement));
      position++;
    }
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
    position = 0;
  }
  return configurations;
};

/**
 * Checks if a given solution is supported by a given constraint
 * @param solution possible solution
 * @param constraint matrix of possible solutions
 * @returns boolean
 */
export const check = (solution, constraint) => {
  let i = 1;
  let support = false;

  // check for at least one possible solution in the constraint that matches
  while (i < constraint.length && !support) {
    support = constraint[i].every((value, index) => value === solution[index]);
    i++;
  }

  return support;
};

/**
 * Checks if a variable takes on the same value for every possibility in a constraint
 * @param constraint matrix of possible solutions
 * @param index index of variable to be checked
 * @returns boolean
 */
export const isConstant = (constraint, index) => {
  let j = 1;
  const value = constraint[1][index];
  let unary = true;
  while (j < constraint.length && unary) {
    unary = constraint[j][index] === value;
    j++;
  }
  return unary;
};

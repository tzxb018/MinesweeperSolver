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


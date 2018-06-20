/**
 * Checks if the solution is supported by the constraint.
 * @param {Array<{key: number, value: boolean}>} solution current solution
 * @param {Array<Array<boolean>>} constraint set of allowed solutions
 * @returns {boolean} true if supported, false otherwise
 */
export const check = (solution, constraint) => constraint.some(tuple =>
  tuple.alive && solution.every(variable => tuple[constraint[0].indexOf(variable.key)] === variable.value));

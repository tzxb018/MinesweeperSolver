import { check } from 'algorithms/utils';

/**
 * Normalizes the constraints such that any constraint that is a subset of another constraint is removed, reducing the
 * total number of constraints. Any constraint that completely envelopes that subset has its solutions reduced to only
 * those that also satisfy the subset.
 * @param {Array<Array<Array<boolean>>>} constraints constraint model of the minesweeper board
 * @returns {Array<Array<Array<boolean>>>} normalized constraints
 */
const normalize = constraints => {
  // for all constraints check if all their variables are contained in another constraint
  constraints.slice().forEach(subConstraint => {
    let wasSubset = false;  // flag for if this constraint was enveloped by another

    constraints.forEach(constraint => {
      // if constraint envelopes subConstraint, it is a subset
      if (subConstraint !== constraint
      && subConstraint[0].length <= constraint[0].length
      && subConstraint[0].every(key => constraint[0].includes(key))) {
        const keyIndex = new Map();
        subConstraint[0].forEach(key => keyIndex.set(key, constraint[0].indexOf(key)));
        // filter out any tuples that are not supported by the subConstraint
        constraint.forEach(tuple => {
          if (tuple.alive) {
            const solution = [];
            keyIndex.forEach((index, key) => solution.push({
              key,
              value: tuple[index],
            }));
            if (!check(solution, subConstraint)) {
              tuple.alive = false;
              constraint.alive--;
            }
          }
        });
        wasSubset = true;
      }
    });

    // if the subConstraint was enveloped by any other constraint, remove it from the search space
    if (wasSubset) {
      constraints.splice(constraints.indexOf(subConstraint), 1);
    }
  });
  return constraints;
};

/**
 * Reduces the constraint pool through normalization before separating variables and constraints into individual
 * component problems.
 * @param {Immutable.Map} csp csp model of the minefield
 * @returns {Immutable.Map} csp with constraints and variables deleted and consolidated into components
 */
export default csp => {
  // normalize constraints and add the visited property to the variables
  const components = [];
  const constraints = normalize(csp.get('constraints'));
  const variables = new Map();
  const isVisited = new Map();
  csp.get('variables').forEach(variable => {
    variables.set(variable.key, {
      col: variable.col,
      row: variable.row,
    });
    isVisited.set(variable.key, false);
  });

  [...variables.keys()].forEach(key => {
    if (!isVisited.get(key)) {
      const stack = [];
      stack.push(key);
      // new component object
      const component = {
        constraints: [],  // list of relevant constraint matrices
        variables: [],    // list of relevant variable objects
      };
      // grab all relevant variables and constraints until the component is completed
      while (stack.length > 0) {
        const currentKey = stack.shift();
        // check all relevant constraints for unvisited variables
        constraints.slice().forEach(constraint => {
          if (constraint[0].includes(currentKey)) {
            constraint[0].forEach(varKey => {
              if (varKey !== currentKey && !isVisited.get(varKey) && !stack.includes(varKey)) {
                stack.push(varKey);
              }
            });
            // cut visited constraint from the list to the component
            component.constraints.push(constraints.splice(constraints.indexOf(constraint), 1)[0]);
          }
        });
        isVisited.set(currentKey, true);
        const currentVariable = variables.get(currentKey);
        component.variables.push({
          col: currentVariable.col,
          key: currentKey,
          row: currentVariable.row,
        });
      }
      components.push(component);
    }
  });

  return csp.withMutations(c => {
    c.delete('variables');
    c.delete('constraints');
    c.set('components', components);
  });
};

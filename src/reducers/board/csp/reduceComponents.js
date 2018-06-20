import { check } from 'algorithms/utils';

/**
 * Normalizes the constraints.
 * Any constraint that is a subset of another constraint is removed, reducing the total number of constraints. Any
 * constraint that completely envelopes that subset has its solutions reduced to only those that also satisfy the
 * subset.
 * @param {Immutable.Map} constraints constraint model of the minesweeper board
 * @returns {Immutable.Map} normalized constraints
 */
const normalize = constraints => {
  // for all constraints check if all their variables are contained in another constraint
  constraints.forEach((subset, subsetIndex) => {
    let wasSubset = false;  // flag for if this constraint was enveloped by another
    constraints.forEach((constraint, i) => {
      const keyIndex = [];
      // check if constraint envelopes the subset
      if (subsetIndex !== i
          && subset[0].every(key => {
            const index = constraint[0].indexOf(key);
            if (index === -1) {
              return false;
            }
            keyIndex.push(index);
            return true;
          })) {
        // filter out any possibilities not supported by the subset
        for (let j = 1; j < constraint.length; j++) {
          if (constraint[j].alive) {
            const solution = keyIndex.map(index => ({
              key: constraint[0][index],
              value: constraint[j][index],
            }));
            if (!check(solution, subset)) {
              constraints[i][j].alive = false;
              constraints[i].alive--;
            }
          }
        }
        wasSubset = true;
      }
    });
    if (wasSubset) {
      constraints.splice(subsetIndex, 1);
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
  const variables = csp.get('variables').map(variable => ({
    ...variable,
    visited: false,
  }));

  variables.forEach(variable => {
    if (!variable.visited) {
      const stack = [];
      stack.push(variable.key);
      // new component object
      const component = {
        constraints: [],  // list of relevant constraint matrices
        variables: [],    // list of relevant variable objects
      };
      // grab all relevant variables and constraints until the component is completed
      while (stack.length > 0) {
        // check all relevant constraints for unvisited variables
        constraints.slice().forEach(constraint => {
          if (constraint[0].includes(stack[0])) {
            constraint[0].forEach(key => {
              if (!variables.find(element => element.key === key).visited && !stack.includes(key)) {
                stack.push(key);
              }
            });
            // cut visited constraint from the list to the component
            component.constraints.push(constraints.splice(constraints.indexOf(constraint), 1)[0]);
          }
        });
        const index = variables.findIndex(element => element.key === stack[0]);
        variables[index].visited = true;
        if (!component.variables.some(element => element.key === stack[0])) {
          component.variables.push(csp.get('variables')[index]);
        }
        stack.shift();
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

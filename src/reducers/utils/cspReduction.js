import Immutable from 'immutable';

/**
 * Checks if a given solution is supported by a given constraint
 * @param solution possible solution
 * @param constraint matrix of possible solutions
 * @returns boolean
 */
const isSupported = (solution, constraint) => {
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
 * Color codes all cells that are part of a component
 * @param cells array of cells
 * @param components list of component objects
 * @returns updated version of cells
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
});

/**
 * Enforces constraints with any variables that only ever take on one value
 * @param constraints array of constraint objects
 * @returns updated version of constraints
 */
export const enforceUnary = (constrs) => {
  const constraints = constrs;
  const unaryVariables = [];

  // find all unary variables
  for (let i = 0; i < constraints.length; i++) {
    for (let k = 0; k < constraints[i][0].length; k++) {
      let j = 1;
      const value = constraints[i][j][k];
      let unary = true;
      while (j < constraints[i].length && unary) {
        unary = constraints[i][j][k] === value;
        j++;
      }
      // if it is unary and not already in the list, add it to the list
      if (unary) {
        if (!unaryVariables.some(element => element.key === constraints[i][0][k])) {
          unaryVariables.push({
            key: constraints[i][0][k],
            value,
          });
        }
      }
    }
  }

  // enforce all unary variables on the constraints
  unaryVariables.forEach(element => {
    constraints.forEach(constraint => {
      const index = constraint[0].indexOf(element.key);
      if (index !== -1) {
        for (let j = 1; j < constraint.length; j++) {
          // cut out a solution if it does not match the unary constraint
          if (constraint[j][index] !== element.value) {
            constraint.splice(j, 1);
            j--;
          }
        }
      }
    });
  });

  return constraints;
};

/**
 * Reduces the number of constraints by removing any that are contained within another
 * @param constraints array of constraint objects
 * @returns reduced array of constraint objects
 */
export const normalize = constraints => {
  const normalized = constraints;

  // for all constraints check if all their variables are contained in another constraint
  for (let i = 0; i < normalized.length; i++) {
    let wasSubset = false;  // flag for if this constraint was enveloped by any other
    for (let l = 0; l < normalized.length; l++) {
      let isSubset = true;  // flag for if this constraints envelopes the other
      // if this is a possible subset, check if it envelopes the other
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
        // if it is a subset, filter out any possibilities not supported by the subset
        if (isSubset) {
          for (let m = 1; m < normalized[l].length; m++) {
            const solution = [];
            keyIndex.forEach(element => {
              solution.push(normalized[l][m][element]);
            });
            if (!isSupported(solution, normalized[i])) {
              normalized[l].splice(m, 1);
            }
          }
        }
      } else {
        isSubset = false;
      }
      // if this was a subset, flag that the subset can now be deleted
      if (isSubset) {
        wasSubset = true;
      }
    }
    // if this was a subset, delete it from the list of constraint objects
    if (wasSubset) {
      normalized.splice(i, 1);
      i--;
    }
  }

  return normalized;
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
            component.constraints.push(constraints.splice(j, 1)[0]);
          }
        }
        // shift visited variable (original) from the stack to the component if it isn't already there
        variables[stack[0]].visited = true;
        if (!component.variables.some(element => element.key === stack[0])) {
          component.variables.push(vars[stack.shift()]);
        } else {
          stack.shift();
        }
      }
      // add completed component to the list
      components = components.push(component);
    }
  }

  return components;
};

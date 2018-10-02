/**
 * Finds all unary constraints and returns any unary restrictions as specs. Unary constraints are those with a scope of
 * only one variable.
 * @param {Constraint[]} constraints array of Constraints
 * @returns {{key: number, value: boolean}[]} unary domain specifications
 */
const findUnary = constraints => {
  const unary = [];
  // for each unary constraint
  constraints.forEach(constraint => {
    if (constraint.scope.length === 1 && constraint.numAlive === 1) {
      unary.push({
        key: constraint.scope[0],
        value: constraint.tuples[0][0],
      });
    }
  });

  return unary;
};

/**
 * Enforces unary consistency on all constraints. Constraints with a scope of only one variable are tested against all
 * other constraints. Each unary constraint is then enforced on the constraints. The unary specs are then returned.
 * @param {Constraint[]} constraints list of Constraints
 * @returns {{key: number, value: boolean}[]} unary specs that can be solved
 */
const enforceUnary = constraints => {
  // find all unary variables
  const specs = findUnary(constraints);

  // enfore unary consistency
  constraints.forEach(constraint => constraint.killIf(specs));

  return specs;
};


/**
 * Normalizes the constraints such that any constraint that is a subset of another constraint is removed, reducing the
 * total number of constraints. A constraint is a subset of another constraint if all of the variables within its scope
 * are also within the scope of the other constraint. Any constraint that completely envelopes that subset has its
 * solutions reduced to only those that also satisfy the subset.
 * @param {Constraint[]} constraints constraint model of the minesweeper board
 * @returns {Constraint[]} normalized constraints
 */
const normalize = constraints => {
  // for all constraints check if all their variables are contained in another constraint
  constraints.slice().forEach(subConstraint => {
    let wasSubset = false;  // flag for if this constraint was enveloped by another

    constraints.forEach(constraint => {
      // if constraint envelopes subConstraint, it is a subset
      if (subConstraint !== constraint && subConstraint.scope.every(key => constraint.isInScope(key))) {
        const specs = subConstraint.supportedSpecs();
        // filter out any tuples that are not supported by the subConstraint
        constraint.killIf(specs);
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
 * Normalizes the constraint pool, reducing it to only unique constraints. Then separates variables and constraints into
 * individual component problems. A component is a set of all the constraints that have overlapping scopes and all the
 * variables that are a part of those scopes.
 * @param {Immutable.Map} csp csp model of the minefield
 * @returns {Immutable.Map} csp with normalized constraints and variables consolidated into components
 */
export default csp => {
  // enforce unary consistency on the constraints
  let unarySolvable = enforceUnary(csp.get('constraints'));

  // solve the unary specs
  unarySolvable = unarySolvable.map(spec => {
    const variable = csp.get('variables').find(element => element.key === spec.key);
    return ({
      col: variable.col,
      key: spec.key,
      row: variable.row,
      value: spec.value,
    });
  });

  // normalize constraints and add the visited property to the variables
  const components = [];
  const normalized = normalize(csp.get('constraints'));
  const constraints = normalized.slice();
  const variables = csp.get('variables');
  const isVisited = new Map();
  variables.forEach(variable => isVisited.set(variable.key, false));

  variables.forEach(variable => {
    if (!isVisited.get(variable.key)) {
      const stack = [];
      stack.push(variable.key);
      // new component object
      const component = {
        constraints: [],  // list of relevant Constraints
        variables: [],    // list of relevant variable objects
      };
      // grab all relevant variables and constraints until the component is completed
      while (stack.length > 0) {
        const currentKey = stack.pop();
        const currentVariable = variables.find(element => element.key === currentKey);
        // check all relevant constraints for unvisited variables
        constraints.slice().forEach(constraint => {
          // if the constraint includes the variable
          if (constraint.isInScope(currentKey)) {
            constraint.scope.forEach(key => {
              if (key !== currentKey && !isVisited.get(key) && !stack.includes(key)) {
                stack.push(key);
              }
            });
            // cut the constraint from the list to the component
            component.constraints.push(constraints.splice(constraints.indexOf(constraint), 1)[0]);
          }
        });
        isVisited.set(currentKey, true);
        component.variables.push(currentVariable);
      }
      components.push(component);
    }
  });

  return csp.withMutations(c => {
    c.set('constraints', normalized);
    c.set('components', components);
    if (unarySolvable.length > 0) {
      c.setIn(['solvable', 'Unary'], unarySolvable);
    } else {
      c.deleteIn(['solvable', 'Unary']);
    }
  });
};

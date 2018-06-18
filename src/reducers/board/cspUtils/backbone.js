/**
 * Checks if a variable takes on the same value for every alive possibility in a constraint
 * @param {Array<Array<boolean>>} constraint matrix of possible solutions
 * @param {number} index index of variable to be checked
 * @returns {Array<boolean>} array of possible values for the variable
 */
const getVariableDomain = (constraint, index) => {
  let i = 1;
  let value;
  while (value === undefined && i < constraint.length) {
    if (constraint[i].alive) {
      value = constraint[i][index];
    }
    i++;
  }
  let unary = true;
  while (i < constraint.length && unary) {
    if (constraint[i].alive) {
      unary = constraint[i][index] === value;
    }
    unary = constraint[i][index] === value;
    i++;
  }
  const domain = [];
  domain.key = constraint[0][index];
  if (value !== undefined && unary) {
    domain.push(value);
    return domain;
  }
  domain.push(false, true);
  return domain;
};

/**
 * Intersects the two domains
 * @param array1
 * @param array2
 * @returns the intersection of the two domains in a new array
 */
const intersection = (array1, array2) => {
  const newArray = array1.filter(element => array2.includes(element));
  newArray.key = array1.key;
  return newArray;
};

/**
 * Finds the domain of each variable.
 * @param constraints list of constraint objects
 * @returns list of variable domains
 */
const getAllDomains = constraints => {
  const domains = [];

  constraints.forEach(constraint => {
    constraint[0].forEach((varKey, varIndex) => {
      const domain = getVariableDomain(constraint, varIndex);
      // if this domain has not already been calculated, then add it, else intersect the two domains
      const index = domains.findIndex(element => element.key === varKey);
      if (index === -1) {
        domains.push(domain);
      } else {
        domains[index] = intersection(domains[index], domain);
      }
    });
  });

  return domains;
};

/**
 * Finds the backbone of the csp by creating the domain and finding those variables that take on only one value in all
 * solutions.
 * @param csp constraint model of the minefield
 * @returns updated csp model with solvable backbone identified
 */
export default csp => csp.withMutations(c => {
  // get the domains of each component and filter it to find the backbone
  c.get('components').forEach(component => {
    let domains = getAllDomains(component.constraints);
    domains = domains.filter(element => element.length === 1);
    if (domains.length === 0) {
      return csp;
    }

    // for each variable domain, add a solvable object to the backbone
    c.setIn(['solvable', 'backbone'], domains.map(varDomain => {
      const variable = component.variables.find(element => element.key === varDomain.key);
      return {
        col: variable.col,
        key: varDomain.key,
        row: variable.row,
        value: varDomain[0],
      };
    }));
    return c;
  });
});

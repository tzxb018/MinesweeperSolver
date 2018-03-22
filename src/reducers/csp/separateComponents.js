/**
 * Separates variables and constraints into individual components
 * @param csp csp model of the minefield
 * @returns csp with constraints and variables deleted and consolidated into components
 */
export default csp => {
  // create copy of variables and constraints
  const components = [];
  const constraints = csp.get('constraints').slice();
  // add visited property to the variables
  const variables = csp.get('variables').map(variable => {
    const newVariable = {
      ...variable,
      visited: false,
    };
    return newVariable;
  });

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
              if (!variables.find(element => element.key === key).visited && key !== stack[0]) {
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

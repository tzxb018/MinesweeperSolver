import backCheckSearch from './backCheck';
import forwardCheckSearch from './forwardCheck';
import forwardCheckSTRSearch from './forwardCheckSTR';

/**
 * Groups all the constraints by the variables they contain.
 * @param {Array<Array<Array<number>>>} constraints csp model of the minefield
 * @returns {Map<number, Set<Array<Array<boolean>>>} variables mapped to the constraints that contain them
 */
const mapVariablesToConstraints = constraints => {
  const map = new Map();

  constraints.forEach(constraint => {
    constraint[0].forEach(variable => {
      if (!map.has(variable)) {
        map.set(variable, new Set());
      }
      map.get(variable).add(constraint);
    });
  });

  return map;
};

/**
 * Performs a backtracking search on the csp until a viable solution is found or the entire search tree is traversed,
 * indicating that the problem is impossible.
 * @param {Immutable.Map} csp constraint model of the minefield
 * @returns {Immutable.Map} updated constraint model
 */
export default csp => csp.withMutations(c => {
  c.setIn(['solvable', 'BTS'], []);
  const solvable = new Map();
  const algorithms = new Map();
  algorithms.set('BC', (domains, constraints, assignmentOrder, diagnostics) =>
    backCheckSearch(domains, constraints, assignmentOrder, diagnostics));
  algorithms.set('FC', (domains, constraints, assignmentOrder, diagnostics) =>
    forwardCheckSearch(domains, constraints, assignmentOrder, diagnostics));
  algorithms.set('FCSTR', (domains, constraints, assignmentOrder, diagnostics) =>
    forwardCheckSTRSearch(domains, constraints, assignmentOrder, diagnostics));

  [...algorithms.keys()].forEach(key => solvable.set(key, []));


  c.get('components').forEach(component => {
    // sort the constraints and set the assignment order
    const constraints = mapVariablesToConstraints(component.constraints);
    const assignmentOrder = [...constraints.keys()];
    assignmentOrder.sort((a, b) => c.get('domains').get(a).size - c.get('domains').get(b).size);

    // search the tree with each active algorithm
    algorithms.forEach((search, algorithmKey) => {
      if (c.getIn(['isActive', algorithmKey])) {
        if (!c.getIn(['diagnostics', algorithmKey])) {
          const diagnostics = {
            nodesVisited: 0,
            backtracks: 0,
            timeChecking: 0,
            timeFiltering: 0,
          };
          c.setIn(['diagnostics', algorithmKey], diagnostics);
        }

        // search the tree
        let solvableCells =
          search(c.get('domains'), constraints, assignmentOrder, c.getIn(['diagnostics', algorithmKey]));

        // map the solvable cells to usable solvable cell objects
        solvableCells = solvableCells.map(cell => {
          const variable = component.variables.find(element => element.key === cell.key);
          return {
            col: variable.col,
            key: cell.key,
            row: variable.row,
            value: cell.value,
          };
        });
        solvable.set(algorithmKey, solvable.get(algorithmKey).concat(solvableCells));
      }
    });
  });

  [...solvable.values()].forEach(value => {
    c.updateIn(['solvable', 'BTS'], x => x.concat(value));
    value.forEach(cell => c.get('domains').set(cell.key, new Set([cell.value])));
  });
  if (c.getIn(['solvable', 'BTS']).length === 0) {
    c.deleteIn(['solvable', 'BTS']);
  }
});

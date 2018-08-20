import backCheckSearch, { constraintFilter as backCheckFilter } from './backCheck';
import forwardCheckSearch, { constraintFilter as forwardCheckFilter } from './forwardCheck';

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
 * Solves the csp with given search methods.
 * @param {Array<{key: number, value: boolean}>} stack variable assignments
 * @param {Map<number, Set<boolean>} currentDomains valid domains of all variables
 * @param {Function} search search method
 * @param {Function} restore restoration method
 * @param {Function} swipe swipe method
 * @param {{*}} diagnostics search metrics object
 * @returns {Array[{key: number, value: boolean}]} list of all solvable cells
 */
const findSolvable = (stack, currentDomains, search, restore, swipe, diagnostics) => {
  // set up search
  let fullySearched = false;
  const solutions = [];
  const solvable = [];

  // perform the search
  while (!fullySearched) {
    const results = search();
    const success = results.solutionFound;
    delete results.solutionFound;
    Object.keys(results).forEach(key => { diagnostics[key] += results[key]; });
    // if a solution was found, add it to the list and set up the stack for the next solution
    if (success) {
      solutions.push(stack.slice());
      // find the next variable with a domain > 1
      let next;
      while (!next && stack.length > 0) {
        const top = stack.pop();
        if (currentDomains.get(top.key).size > 1) {
          next = top;
        } else {
          restore(top.key);
        }
      }
      if (next) {
        swipe(next);
      } else {
        fullySearched = true;
      }
    // else the tree is fully searched
    } else {
      fullySearched = true;
    }
  }

  [...currentDomains.keys()].forEach((key, index) => {
    const newDomain = new Set();
    solutions.forEach(solution => newDomain.add(solution[index].value));
    if (newDomain.size === 1) {
      solvable.push({
        key,
        value: [...newDomain][0],
      });
    }
  });
  return solvable;
};

/**
 * Performs a backtracking search on the csp until a viable solution is found or the entire search tree is traversed,
 * indicating that the problem is impossible.
 * @param {Immutable.Map} csp constraint model of the minefield
 * @returns {Immutable.Map} updated constraint model
 */
export default csp => csp.withMutations(c => {
  c.setIn(['solvable', 'BTS'], []);
  const solvable = new Map([
    ['BC', []],
    ['FC', []],
  ]);

  c.get('components').forEach(component => {
    // map the variables to the constraints that contain them
    const constraintMap = mapVariablesToConstraints(component.constraints);
    // set the variable assignment order
    const assignmentOrder = [...constraintMap.keys()];
    assignmentOrder.sort((a, b) => c.get('domains').get(a).size - c.get('domains').get(b).size);

    // search the tree with BC
    if (c.getIn(['isActive', 'BC'])) {
      // set up for the search
      let diagnostics = c.getIn(['diagnostics', 'BC']);
      if (!diagnostics) {
        diagnostics = {
          nodesVisited: 0,
          backtracks: 0,
          timeChecking: 0,
          timeFiltering: 0,
        };
        c.setIn(['diagnostics', 'BC'], diagnostics);
      }
      const filterTime = performance.now();
      const filteredMap = backCheckFilter(assignmentOrder, constraintMap);
      diagnostics.timeFiltering += performance.now() - filterTime;
      const currentDomains = new Map();
      assignmentOrder.forEach(key => currentDomains.set(key, new Set([...c.get('domains').get(key)])));
      const stack = [];
      const search = () => backCheckSearch(stack, currentDomains, c.get('domains'), filteredMap, assignmentOrder);
      const restore = key => currentDomains.set(key, new Set([...c.get('domains').get(key)]));
      const swipe = next => currentDomains.get(next.key).delete(next.value);

      let solvableCells = findSolvable(stack, currentDomains, search, restore, swipe, diagnostics);
      solvableCells = solvableCells.map(cell => {
        const variable = component.variables.find(element => element.key === cell.key);
        return {
          col: variable.col,
          key: cell.key,
          row: variable.row,
          value: cell.value,
        };
      });
      solvable.set('BC', solvable.get('BC').concat(solvableCells));
    }

    // search the tree with FC
    if (c.getIn(['isActive', 'FC'])) {
      // set up for the search
      let diagnostics = c.getIn(['diagnostics', 'FC']);
      if (!diagnostics) {
        diagnostics = {
          nodesVisited: 0,
          backtracks: 0,
          timeChecking: 0,
          timeFiltering: 0,
        };
        c.setIn(['diagnostics', 'FC'], diagnostics);
      }
      const filterTime = performance.now();
      const filteredMap = forwardCheckFilter(assignmentOrder, constraintMap);
      diagnostics.timeFiltering += performance.now() - filterTime;
      const currentDomains = new Map();
      const reductions = new Map();
      assignmentOrder.forEach(key => {
        currentDomains.set(key, new Set([...c.get('domains').get(key)]));
        reductions.set(key, []);
      });
      if (assignmentOrder.length > 0) {
        reductions.get(assignmentOrder[0]).push(new Set());
      }
      const stack = [];
      const search = () => forwardCheckSearch(stack, currentDomains, reductions, filteredMap, assignmentOrder);
      const restore = startKey => {
        assignmentOrder.slice(assignmentOrder.indexOf(startKey) + 1).forEach(key => {
          const values = [...reductions.get(key).pop()];
          values.forEach(element => currentDomains.get(key).add(element));
        });
      };
      const swipe = next => {
        restore(next.key);
        reductions.get(next.key).slice(-1)[0].add(next.value);
        currentDomains.get(next.key).delete(next.value);
      };

      let solvableCells = findSolvable(stack, currentDomains, search, restore, swipe, diagnostics);
      solvableCells = solvableCells.map(cell => {
        const variable = component.variables.find(element => element.key === cell.key);
        return {
          col: variable.col,
          key: cell.key,
          row: variable.row,
          value: cell.value,
        };
      });
      solvable.set('FC', solvable.get('FC').concat(solvableCells));
    }
  });

  [...solvable.values()].forEach(value => {
    c.updateIn(['solvable', 'BTS'], x => x.concat(value));
    value.forEach(cell => c.get('domains').set(cell.key, new Set([cell.value])));
  });
  if (c.getIn(['solvable', 'BTS']).length === 0) {
    c.deleteIn(['solvable', 'BTS']);
  }
});

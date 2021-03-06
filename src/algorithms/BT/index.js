import HistoryLogItem from 'objects/HistoryLogItem';
import { numberWithCommas } from 'algorithms/utils';
import {
  Algorithms,
  HistoryLogStyles,
} from 'enums';

import backCheckSearch from './backCheck';
import forwardCheckSearch from './forwardCheck';
import forwardCheckSTRSearch from './forwardCheckSTR';

const algorithms = new Map([
  [Algorithms.BC, (domains, constraints, assignmentOrder, diagnostics) =>
  backCheckSearch(domains, constraints, assignmentOrder, diagnostics)],
  [Algorithms.FC, (domains, constraints, assignmentOrder, diagnostics) =>
  forwardCheckSearch(domains, constraints, assignmentOrder, diagnostics)],
  [Algorithms.MAC, (domains, constraints, assignmentOrder, diagnostics) =>
  forwardCheckSTRSearch(domains, constraints, assignmentOrder, diagnostics)],
]);

/**
 * Groups all the constraints by the variables they contain.
 * @param {Constraint[]} constraints csp model of the minefield
 * @returns {Map<number, Set<Constraint>>} variables mapped to the constraints that contain them
 */
const mapVariablesToConstraints = constraints => {
  const map = new Map();

  constraints.forEach(constraint => {
    constraint.scope.forEach(variable => {
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
 * @param {number} componentIndex index of component to operate on
 * @param {Immutable.Map<string, boolean> | Map<string, boolean>} isActive backtracking algorithms mapped to whether
 * they are active or not
 * @returns {Immutable.Map} updated constraint model
 */
export default (csp, componentIndex, isActive) => csp.withMutations(c => {
  const solvable = new Map();
  [...algorithms.keys()].forEach(key => solvable.set(key, []));

  // sort the constraints and set the assignment order
  const constraints = mapVariablesToConstraints(c.get('components')[componentIndex].constraints);
  const assignmentOrder = [...constraints.keys()];
  assignmentOrder.sort((a, b) => c.get('domains').get(a).size - c.get('domains').get(b).size);

  // search the tree with each active algorithm
  algorithms.forEach((search, algorithmKey) => {
    if (isActive.get(algorithmKey)) {
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
      const solvableVars =
        search(c.get('domains'), constraints, assignmentOrder, c.getIn(['diagnostics', algorithmKey]));

      solvable.set(algorithmKey, solvable.get(algorithmKey).concat(solvableVars));
    }
  });

  let solvableSet = [...solvable.values()];
  const hasSolvable = solvableSet.some(set => {
    if (set.length > 0) {
      solvableSet = set;
      return true;
    }
    return false;
  });

  if (hasSolvable) {
    if (!c.getIn(['solvable', Algorithms.BT])) {
      c.setIn(['solvable', Algorithms.BT], []);
    }
    c.updateIn(['solvable', Algorithms.BT], x => x.concat(solvableSet));
    solvableSet.forEach(cell => c.get('domains').set(cell.key, new Set([cell.value])));
  }
});

/**
 * Creates a formatted HistoryLogItem object to represent the diagnostics of the search iteration.
 * @param {Immutable.Map} csp constraint model of the board
 * @param {number} [numRuns=1] number of iterations recorded in the diagnostics
 * @returns {HistoryLogItem} new HistoryLogItem of the diagnostics
 */
export const logDiagnostics = (csp, numRuns = 1) => {
  const log = new HistoryLogItem('Search', HistoryLogStyles.DEFAULT, false);
  csp.getIn(['algorithms', Algorithms.BT, 'subSets']).forEach((isActive, algorithm) => {
    if (isActive) {
      const diagnostics = csp.getIn(['diagnostics', algorithm]);
      log.addDetail(`\n${algorithm}:`, true);
      Object.keys(diagnostics).forEach(key => {
        const average = diagnostics[key] / numRuns;
        let detail;
        switch (key) {
          case 'nodesVisisted': detail = `# nodes visited\t\t\t${numberWithCommas(Math.round(average))}`; break;
          case 'backtracks': detail = `# backtracks\t\t\t\t${numberWithCommas(Math.round(average))}`; break;
          case 'timeChecking': detail = `time spent checking\t\t${Math.round(average * 100) / 100} ms`; break;
          case 'timeFiltering': detail = `time spent filtering\t\t\t${Math.round(average * 100) / 100} ms`; break;
          case 'tuplesKilled': detail = `# tuples killed\t\t\t\t${numberWithCommas(Math.round(average))}`; break;
          default: detail = `${key}\t\t\t\t${Math.round(average)}`;
        }
        log.addDetail(detail);
      });
    }
  });
  return log;
};

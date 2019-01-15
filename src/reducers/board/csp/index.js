import BT from 'algorithms/BT/index';
import mWC from 'algorithms/mWC';
import STR2 from 'algorithms/STR2';
import { intersect } from 'algorithms/utils';
import HistoryLogItem from 'objects/HistoryLogItem';

import generateCSP from './generateCSP';
import reduceComponents from './reduceComponents';
import { parseSolvable } from './solve';

/**
 * Checks csp model for any inconsistencies. Any unsatisfied constraints are highlighted red on the board and solving is
 * disabled to avoid errors.
 * @param {Immutable.Map} state state of the board
 * @returns {Immutable.Map} updated state with any inconsistencies highlighted red and solving disabled if inconsistent
 */
const checkConsistency = state => state.withMutations(s => {
  // remove previous inconsistency
  if (!s.getIn(['csp', 'isConsistent'])) {
    s.setIn(['csp', 'isConsistent'], true);
  }

  // color any inconsistent constraints
  let inconsistentCount = 0;
  s.getIn(['csp', 'components']).forEach(component => {
    component.constraints.forEach(constraint => {
      if (constraint.isAlive) {
        s.setIn(['minefield', 'cells', constraint.row, constraint.col, 'color'], -1);
        s.setIn(['csp', 'isConsistent'], false);
        inconsistentCount++;
      } else {
        s.setIn(['minefield', 'cells', constraint.row, constraint.col, 'color'], 0);
      }
    });
  });

  // log the processing message
  let log;
  if (inconsistentCount > 0) {
    let cellOrCells = 'inconsistencies';
    if (inconsistentCount === 1) {
      cellOrCells = 'inconsistency';
    }
    const message = `Processing stopped due to ${inconsistentCount} ${cellOrCells}`;
    log = new HistoryLogItem(message, 'red', true);
  } else {
    let count = 0;
    const details = [];
    let cellOrCells = 'cells';
    s.getIn(['csp', 'solvable']).forEach((solvable, algorithm) => {
      count += solvable.length;
      cellOrCells = 'cells';
      if (solvable.length === 1) {
        cellOrCells = 'cell';
      }
      details.push(`${algorithm} finds ${solvable.length} solvable ${cellOrCells}`);
    });
    cellOrCells = 'cells';
    if (count === 1) {
      cellOrCells = 'cell';
    }
    const message = `Finds ${count} solvable ${cellOrCells}`;
    log = new HistoryLogItem(message, 'log', false);
    details.forEach(detail => log.addDetail(detail));
  }
  s.update('historyLog', h => h.push(log));
});

/**
 * Color codes all cells that are solvable.
 * @param {object[][]} cells matrix of cell objects
 * @param {Immutable.Map} csp state of the csp model
 * @returns {object[][]} updated version of cells
 */
const colorSolvable = (cells, csp) => cells.withMutations(c => {
  // defined colors
  const colors = new Map([
    ['Unary', 1],
    ['BT', 2],
    ['STR2', 3],
    ['mWC-1', 3],
    ['mWC-2', 4],
    ['mWC-3', 5],
    ['mWC-4', 6],
  ]);

  // clear previous coloring
  csp.get('components').forEach(component => {
    component.variables.forEach(variable => {
      c.setIn([variable.row, variable.col, 'color'], 0);
      c.deleteIn([variable.row, variable.col, 'solution']);
    });
  });

  // color each solvable set
  csp.get('solvable').forEach((solvable, algorithm) => {
    const color = colors.get(algorithm);
    solvable.forEach(cell => {
      c.setIn([cell.row, cell.col, 'color'], color);
      c.setIn([cell.row, cell.col, 'solution'], cell.value);
    });
  });
  return c;
});

/**
 * Gets the basic viable domains of each variable.
 * @param {Constraint[]} constraints array of Constraints
 * @returns {Map<number, Set<boolean>>} map containing the allowed domain set for each variable
 */
export const getDomains = constraints => {
  const domains = new Map();
  constraints.forEach(constraint => {
    const newDomains = constraint.supportedDomains();
    if (newDomains) {
      newDomains.forEach((values, key) => {
        if (!domains.has(key)) {
          domains.set(key, new Set([...values]));
        } else {
          domains.set(key, intersect(domains.get(key), values));
        }
      });
    } else {
      constraint.scope.forEach(key => domains.set(key, new Set()));
    }
  });
  return domains;
};

/**
 * Generates the csp model of the minefield. Enforces unary consistency and normalizes the constraints. Separates the
 * model into its distinct component problems. Enforces any further consistency algorithms specified by the state.
 * Checks that the proposed solution is consistent with all constraints.
 * @param {Immutable.Map} state state of the board
 * @param {boolean} [forceReevaluation=false] flag variable to force all components to be reevaluated whether they
 * changed or not
 * @returns {Immutable.Map} state with csp model, solvable cells colored, and any inconsistencies colored
 */
export default (state, forceReevaluation = false) => state.withMutations(s => {
  // generate the csp model of the minefield
  s.update('csp', c => generateCSP(c, s.getIn(['minefield', 'cells'])));

  // enfore unary consistency, normalize, and separate variables and constraints into individual components
  s.update('csp', c => reduceComponents(c));

  // filter out any components that did not change
  const activeComponents = [];
  if (state.get('csp').has('components') && !forceReevaluation) {
    s.getIn(['csp', 'components']).forEach((component, i) => {
      const changed = !state.getIn(['csp', 'components']).some(oldComponent => oldComponent.id === component.id);
      if (changed) {
        activeComponents.push(i);
      }
    });
  } else {
    for (let i = 0; i < s.getIn(['csp', 'components']).length; i++) {
      activeComponents.push(i);
    }
  }

  // get the variable domains
  const constraints = [];
  s.getIn(['csp', 'components']).forEach(component => constraints.push(...component.constraints));
  s.setIn(['csp', 'domains'], getDomains(constraints));

  // reduce the domains with BTS
  if (s.getIn(['csp', 'algorithms', 'BT', 'isActive'])
  && (s.getIn(['csp', 'algorithms', 'BT', 'subSets', 'BC']) || s.getIn(['csp', 'algorithms', 'BT', 'subSets', 'FC'])
  || s.getIn(['csp', 'algorithms', 'BT', 'subSets', 'FC-STR']))) {
    activeComponents.forEach(componentIndex => {
      s.update('csp', c => BT(c, componentIndex, c.getIn(['algorithms', 'BT', 'subSets'])));
    });
  } else {
    s.deleteIn(['csp', 'solvable', 'BT']);
  }

  // reduce the constraints with STR
  if (s.getIn(['csp', 'algorithms', 'STR2', 'isActive'])) {
    s.deleteIn(['csp', 'solvable', 'mWC-1']);
    activeComponents.forEach(componentIndex => {
      s.update('csp', c => STR2(c, componentIndex));
    });
  } else {
    s.deleteIn(['csp', 'solvable', 'STR2']);
  }

  // reduce the contstraints with PWC
  if (s.getIn(['csp', 'algorithms', 'mWC', 'isActive'])) {
    activeComponents.forEach(componentIndex => {
      s.update('csp', c => mWC(c, componentIndex, c.getIn(['algorithms', 'mWC', 'm'])));
    });
  } else {
    for (let i = 1; i <= 4; i++) {
      s.deleteIn(['csp', 'solvable', `mWC-${i}`]);
    }
  }

  // parse the solvable cells
  s.updateIn(['csp', 'solvable'], o => parseSolvable(o, s.getIn(['csp', 'variables'])));

  // color the solvable cells
  s.updateIn(['minefield', 'cells'], c => colorSolvable(c, s.get('csp')));

  // check for consistency
  return checkConsistency(s);
});

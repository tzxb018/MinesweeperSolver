import BTS from 'algorithms/BTS/index';
import MWC from 'algorithms/mwise';
import STR from 'algorithms/STR';
import { intersect } from 'algorithms/utils';

import generateCSP from './generateCSP';
import reduceComponents from './reduceComponents';

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
  let logString;
  let logColor;
  if (inconsistentCount > 0) {
    logString = `Processing stopped, ${inconsistentCount} inconsistencies found`;
    logColor = 'red';
  } else {
    const solvableCount = new Map();
    const solvableCells = [];
    s.getIn(['csp', 'solvable']).forEach((solvableSet, setKey) => {
      let count = 0;
      solvableSet.forEach(cell => {
        if (!solvableCells.includes(cell.key)) {
          solvableCells.push(cell.key);
          count++;
        }
      });
      solvableCount.set(setKey, count);
    });
    logString = `Found ${solvableCells.length} solvable cell(s)`;
    solvableCount.forEach((count, setKey) => {
      if (count > 0) {
        logString += `\n\t${setKey} found ${count} new solvable cell(s)`;
      }
    });
  }
  s.update('historyLog', h => h.push({
    cells: [],
    color: logColor,
    message: logString,
    undoable: true,
  }));
});

/**
 * Color codes all cells that are solvable.
 * @param {Immutable.List<Immutable.List<Immutable.Map>>} cells matrix of cell objects
 * @param {Immutable.Map} csp state of the csp model
 * @returns {Immutable.List<Immutable.List<Immutable.Map>>} updated version of cells
 */
const colorSolvable = (cells, csp) => cells.withMutations(c => {
  // clear previous coloring
  csp.get('components').forEach(component => {
    component.variables.forEach(variable => {
      c.setIn([variable.row, variable.col, 'color'], 0);
      c.deleteIn([variable.row, variable.col, 'solution']);
    });
  });

  // get the sets of solvable cells
  const solvableSets = csp.get('solvable');
  if (!solvableSets) {
    return cells;
  }

  // unary are colored blue (1)
  let set = solvableSets.get('Unary');
  if (set) {
    set.forEach(solvableCell => {
      c.setIn([solvableCell.row, solvableCell.col, 'color'], 1);
      c.setIn([solvableCell.row, solvableCell.col, 'solution'], solvableCell.value);
    });
  }

  // BTS are colored darkGreen (2)
  set = solvableSets.get('BTS');
  if (set) {
    set.forEach(solvableCell => {
      if (c.getIn([solvableCell.row, solvableCell.col, 'color']) === 0) {
        c.setIn([solvableCell.row, solvableCell.col, 'color'], 2);
        c.setIn([solvableCell.row, solvableCell.col, 'solution'], solvableCell.value);
      }
    });
  }

  // STR are colored darkBlue (4)
  set = solvableSets.get('STR');
  if (set) {
    set.forEach(solvableCell => {
      if (c.getIn([solvableCell.row, solvableCell.col, 'color']) === 0) {
        c.setIn([solvableCell.row, solvableCell.col, 'color'], 4);
        c.setIn([solvableCell.row, solvableCell.col, 'solution'], solvableCell.value);
      }
    });
  }

  // PWC are colored darkRed (5)
  set = solvableSets.get('MWC-2');
  if (set) {
    set.forEach(solvableCell => {
      if (c.getIn([solvableCell.row, solvableCell.col, 'color']) === 0) {
        c.setIn([solvableCell.row, solvableCell.col, 'color'], 5);
        c.setIn([solvableCell.row, solvableCell.col, 'solution'], solvableCell.value);
      }
    });
  }

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
    newDomains.forEach((values, key) => {
      if (!domains.has(key)) {
        domains.set(key, new Set([...values]));
      } else {
        domains.set(key, intersect(domains.get(key), values));
      }
    });
  });
  return domains;
};

/**
 * Generates the csp model of the minefield. Enforces unary consistency and normalizes the constraints. Separates the
 * model into its distinct component problems. Enforces any further consistency algorithms specified by the state.
 * Checks that the proposed solution is consistent with all constraints.
 * @param {Immutable.Map} state state of the board
 * @returns {Immutable.Map} state with csp model, solvable cells colored, and any inconsistencies colored
 */
export default state => state.withMutations(s => {
  // generate the csp model of the minefield
  s.update('csp', c => generateCSP(c, s.getIn(['minefield', 'cells'])));

  // enfore unary consistency, normalize, and separate variables and constraints into individual components
  s.update('csp', c => reduceComponents(c));

  // get the variable domains
  const constraints = [];
  s.getIn(['csp', 'components']).forEach(component => constraints.push(...component.constraints));
  s.setIn(['csp', 'domains'], getDomains(constraints));

  // reduce the domains with BTS
  if (s.getIn(['csp', 'isActive', 'BTS'])
  && (s.getIn(['csp', 'isActive', 'BC'])
  || s.getIn(['csp', 'isActive', 'FC']) || s.getIn(['csp', 'isActive', 'FCSTR']))) {
    s.update('csp', c => BTS(c));
  } else {
    s.deleteIn(['csp', 'solvable', 'BTS']);
  }

  // reduce the constraints with STR
  if (s.getIn(['csp', 'isActive', 'STR'])) {
    s.update('csp', c => STR(c));
  } else {
    s.deleteIn(['csp', 'solvable', 'STR']);
  }

  // reduce the contstraints with PWC
  if (s.getIn(['csp', 'isActive', 'MWC'])) {
    s.update('csp', c => MWC(c));
  } else {
    s.deleteIn(['csp', 'solvable', 'MWC']);
  }

  // color the solvable cells
  s.updateIn(['minefield', 'cells'], c => colorSolvable(c, s.get('csp')));

  // check for consistency
  return checkConsistency(s);
});

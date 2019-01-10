import Constraint from 'objects/Constraint';
import HistoryLogItem from 'objects/HistoryLogItem';
import {
  intersect,
  numberWithCommas,
} from 'algorithms/utils';

/**
 * Maps all variables to the list of their constraints.
 * @param {Constraint[]} constraints list of Constraints
 * @returns {Map<number, Constraint[]} variables mapped to their constraints
 */
const mapVarsToConstraints = constraints => {
  const map = new Map();
  constraints.forEach(constraint => {
    constraint.scope.forEach(variable => {
      if (!map.has(variable)) {
        map.set(variable, []);
      }
      map.get(variable).push(constraint);
    });
  });
  return map;
};


/**
 * Revises a constraint with the given domains. Supported domains are recorded and returned in a new map.
 * If reduced is provided, any killed tuples are recorded there. Otherwise they are ignored.
 * @param {Constraint} constraint a table constraint to be revised
 * @param {Map<number, Set<boolean>>} domains the set of allowed variable domains
 * @param {Object} diagnostics execution metrics object
 * @param {number} diagnostics.tuplesKilled number of tuples killed
 * @param {Map<Constraint, Set<number>>} [reduced] table constraints mapped to their killed tuples
 * @returns {Map<number, Set<boolean>>} variables mapped to their new allowed domains, undefined if the constraint is
 * dead
 */
export const revise = (constraint, domains, diagnostics, reduced = undefined) => {
  // convert the domains to specs
  const specs = Constraint.domainsToSpecs(domains);

  // revise the alive tuples with the old domain sets
  const startTuples = constraint.tuples.map(tuple => tuple.id);
  const endTuples = constraint.killIf(specs).map(tuple => tuple.id);
  if (reduced) {
    const killedTuples = startTuples.filter(id => !endTuples.includes(id));
    killedTuples.forEach(id => reduced.get(constraint).add(id));
  }
  diagnostics.tuplesKilled += startTuples.length - endTuples.length;

  return constraint.supportedDomains();
};

/**
 * Implementation of simple tabular reduction algorithm. Revises constraint tuples and variable domain sets, enforcing
 * generalized arc consistency (GAC) across all constraint tables. Any variables with a domain of only one value are
 * added to the list of solvable cells.
 * @param {Immutable.Map} csp csp model of the minefield
 * @param {number} componentIndex index of component to operate on
 * @returns {Immutable.Map} csp with GAC and any solvable cells identified
 */
export default (csp, componentIndex) => csp.withMutations(c => {
  if (!c.getIn(['diagnostics', 'STR2'])) {
    const diagnostics = {
      time: 0,
      revisions: 0,
      tuplesKilled: 0,
    };
    c.setIn(['diagnostics', 'STR2'], diagnostics);
  }
  const diagnostics = c.getIn(['diagnostics', 'STR2']);
  const STR = [];
  const domains = c.get('domains');
  const startTime = performance.now();

  const constraintMap = mapVarsToConstraints(c.get('components')[componentIndex].constraints);
  const queue = [];
  c.get('components')[componentIndex].constraints.forEach(element => queue.push(element));

  try {
    // continually check constraints until no more changes can be made
    while (queue.length > 0) {
      // revise the next constraint in the queue
      diagnostics.revisions++;
      const constraint = queue.shift();
      const newDomains = revise(constraint, domains, diagnostics);
      if (!newDomains) {
        throw constraint.scope;
      }

      newDomains.forEach((values, key) => {
        // if the new domain set is different, intersect the new and old domain sets
        if (domains.get(key).size !== values.size) {
          domains.set(key, intersect(domains.get(key), values));
          // add any constraints affected by this variable back to the queue
          constraintMap.get(key).forEach(element => {
            if (element !== constraint && !queue.includes(element)) {
              queue.push(element);
            }
          });
        }
        // if the domain is inconsistent, break
        if (domains.get(key).size === 0) {
          throw new Array(key);
        }
      });
    }
  } catch (error) {
    error.forEach(key => {
      constraintMap.get(key).forEach(constraint => constraint.killAll());
    });
  }

  // solve any variables with a domain of only one value
  domains.forEach((values, key) => {
    if (values.size === 1) {
      STR.push({
        key,
        value: [...values][0],
      });
    }
  });
  diagnostics.time += performance.now() - startTime;

  // add all STR cells to the list of solvable cells
  if (STR.length > 0) {
    if (!c.getIn(['solvable', 'STR2'])) {
      c.setIn(['solvable', 'STR2'], []);
    }
    c.updateIn(['solvable', 'STR2'], x => x.concat(STR));
  }
});

/**
 * Creates a formatted HistoryLogItem object to represent the diagnostics of the STR2 iteration.
 * @param {Immutable.Map} csp constraint model of the board
 * @param {number} [numRuns=1] number of iterations recorded in the diagnostics
 * @returns {HistoryLogItem} new HistoryLogItem of the diagnostics
 */
export const logDiagnostics = (csp, numRuns = 1) => {
  const log = new HistoryLogItem('STR2:', 'log', false);
  const diagnostics = csp.getIn(['diagnostics', 'STR2']);
  Object.keys(diagnostics).forEach(key => {
    const average = diagnostics[key] / numRuns;
    let detail;
    switch (key) {
      case 'time': detail = `CPU time\t\t\t\t${Math.round(average * 100) / 100} ms`; break;
      case 'revisions': detail = `# constraints checked\t\t${Math.round(average)}`; break;
      case 'tuplesKilled': detail = `# tuples killed\t\t\t\t${numberWithCommas(Math.round(average))}`; break;
      default: detail = `${key}\t\t\t\t${Math.round(average)}`;
    }
    log.addDetail(detail);
  });
  return log;
};

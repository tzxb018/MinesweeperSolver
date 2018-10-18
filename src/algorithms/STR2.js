import Constraint from 'Constraint';
import { intersect } from './utils';

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
 * @param {Map<Constraint, Set<number>>} [reduced] table constraints mapped to their killed tuples
 * @returns {Map<number, Set<boolean>>} variables mapped to their new allowed domains, undefined if the constraint is
 * dead
 */
export const revise = (constraint, domains, reduced = undefined) => {
  // convert the domains to specs
  const specs = Constraint.domainsToSpecs(domains);

  // revise the alive tuples with the old domain sets
  const startTuples = constraint.tuples.map(tuple => tuple.id);
  const endTuples = constraint.killIf(specs).map(tuple => tuple.id);
  if (reduced) {
    const killedTuples = startTuples.filter(id => !endTuples.includes(id));
    killedTuples.forEach(id => reduced.get(constraint).add(id));
  }

  return constraint.supportedDomains();
};

/**
 * Implementation of simple tabular reduction algorithm. Revises constraint tuples and variable domain sets, enforcing
 * generalized arc consistency (GAC) across all constraint tables. Any variables with a domain of only one value are
 * added to the list of solvable cells.
 * @param {Immutable.Map} csp csp model of the minefield
 * @returns {Immutable.Map} csp with GAC and any solvable cells identified
 */
export default csp => csp.withMutations(c => {
  const STR = [];
  const domains = c.get('domains');
  c.get('components').forEach(component => {
    const constraintMap = mapVarsToConstraints(component.constraints);
    const queue = [];
    component.constraints.forEach(element => queue.push(element));

    try {
      // continually check constraints until no more changes can be made
      while (queue.length > 0) {
        // revise the next constraint in the queue
        const constraint = queue.shift();
        const newDomains = revise(constraint, domains);
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
  });

  // add all STR cells to the list of solvable cells
  if (STR.length > 0) {
    c.setIn(['solvable', 'STR2'], STR);
  } else {
    c.deleteIn(['solvable', 'STR2']);
  }
});

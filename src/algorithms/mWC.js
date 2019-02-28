import Constraint from 'objects/Constraint';
import HistoryLogItem from 'objects/HistoryLogItem';
import {
  Algorithms,
  HistoryLogStyles,
} from 'enums';

import STR2 from './STR2';
import {
  intersect,
  numberWithCommas,
  reviseEdge,
} from './utils';

/**
 * Finds all the edges in the graph formed by the given constraints.
 * @param {Constraint[]} constraints list of Constraints
 * @returns {Constraint[][]>} list of graph edges
 */
const findEdges = constraints => {
  const edges = [];

  constraints.forEach((constraint1, index1) => {
    constraints.slice(index1 + 1).forEach(constraint2 => {
      const scope = Constraint.intersectScopes(constraint1, constraint2);
      if (scope.length > 1) {
        const edge = [constraint1, constraint2];
        edge.scope = scope;
        edges.push(edge);
      }
    });
  });

  return edges;
};

/**
 * Maps the edges to the constraints that they contain.
 * @param {Constraint[][]} edges list of graph edges
 * @return {Map<Constraint, Set<Constraint[]>>} constraints mapped to their edges
 */
const mapEdges = edges => {
  const edgeMap = new Map();

  edges.forEach(edge => edge.forEach(constraint => {
    if (!edgeMap.has(constraint)) {
      edgeMap.set(constraint, new Set());
    }
    edgeMap.get(constraint).add(edge);
  }));

  return edgeMap;
};

/**
 * Finds all the pairs of size m that can be formed from the given edges. A pair is a series of nodes that form a
 * connected graph.
 * @param {Map<Constraint, Set<Constraint[]>>} edgeMap constraints mapped to their edges
 * @param {Constraint[][]} edges list of graph edges
 * @param {number} m the number of constraints to pair up
 * @returns {object[]} every valid pair of edges of size m
 */
const findPairs = (edgeMap, edges, m) => {
  // map each constraint to its graph neighbors
  const constraintMap = new Map();
  edges.forEach(edge => {
    if (!constraintMap.has(edge[0])) {
      constraintMap.set(edge[0], []);
    }
    constraintMap.get(edge[0]).push(edge[1]);
  });

  const edgePairs = [];
  [...constraintMap.keys()].forEach(constraint1 => {
    let pairs = [];
    pairs.push([constraint1]);
    for (let i = 2; i <= m; i++) {
      const temp = [];
      pairs.forEach(pair => pair.forEach(constraint => {
        let neighbors = constraintMap.get(constraint);
        if (neighbors) {
          neighbors = neighbors.filter(n => !pair.includes(n));
          neighbors.forEach(n => temp.push([...pair, n]));
        }
      }));
      pairs = temp;
    }
    edgePairs.push(...pairs);
  });

  return edgePairs.map(constraints => {
    const pair = [];
    constraints.forEach((constraint1, index1) => {
      constraints.slice(index1 + 1).forEach(constraint2 => {
        const edge = [...intersect(edgeMap.get(constraint1), edgeMap.get(constraint2))][0];
        if (edge) {
          pair.push(edge);
        }
      });
    });
    return pair;
  });
};

/**
 * Revises the constraints of the given pair by enforcing pairwise consistency. Pairwise consistency means every tuple
 * has a supporting tuple in the other constraints of the pair.
 * @param {object[]} pair list of edges that form the pair
 * @param {Constraint[]} pair[].edge edge of the pair
 * @param {number[]} pair[].edge.scope list of variables common to the pair
 * @param {number} pair[].edge.id unique identifier of the edge
 * @param {Object} [diagnostics] execution metrics object
 * @param {number} diagnostics.tuplesKilled number of tuples killed
 * @returns {Constraint[]} list of Constraints that were revised, undefined if one of the constraints of the pair is
 * dead
 */
const revise = (pair, diagnostics) => {
  let isConsistent = true;
  const revisedSet = new Set();
  const queue = pair;

  // revise each edge of the pair until they reach equilibrium
  while (isConsistent && queue.length > 0) {
    const edge = queue.shift();
    const revised = reviseEdge(edge, diagnostics);
    if (revised) {
      revised.forEach(constraint => {
        revisedSet.add(constraint);
        queue.push(...pair.filter(element =>
          element !== edge && element.includes(constraint) && !queue.includes(element)));
      });
    } else {
      isConsistent = false;
    }
  }

  return isConsistent ? [...revisedSet] : undefined;
};

/**
 * Pair-wise consistency algorithm. Enforces tuple consistency between pairs of constraints that have scope that
 * intersect over at least 2 variables. Tuple consistency means every alive tuple of each constraint in the pair has an
 * alive supporting tuple in all other constraints of the pair.
 * @param {Immutable.Map} csp constraint representation of the minesweeper board
 * @param {number} componentIndex index of component to operate on
 * @param {number} [size=2] the maximum number of constraints to form pairs with
 */
export default (csp, componentIndex, size = 2) => {
  let newCSP = csp;

  // run GAC as mWC-1 if it has not already been done
  if (!csp.getIn(['algorithms', Algorithms.STR2, 'isActive'])) {
    newCSP = STR2(csp, componentIndex).withMutations(c => {
      if (!c.getIn(['diagnostics', Algorithms.mWC1])) {
        const diagnostics = {
          time: 0,
          revisions: 0,
          tuplesKilled: 0,
        };
        c.setIn(['diagnostics', Algorithms.mWC1], diagnostics);
      }
      Object.entries(c.getIn(['diagnostics', Algorithms.STR2])).forEach(([key, value]) => {
        c.getIn(['diagnostics', Algorithms.mWC1])[key] += value;
      });
      c.deleteIn(['diagnostics', Algorithms.STR2]);
      if (c.getIn(['solvable', Algorithms.STR2])) {
        c.setIn(['solvable', Algorithms.mWC1], c.getIn(['solvable', Algorithms.STR2]));
        c.deleteIn(['solvable', Algorithms.STR2]);
      }
    });
  }

  // run PWC for each additional level of m
  const names = [Algorithms.mWC2, Algorithms.mWC3, Algorithms.mWC4];
  return newCSP.withMutations(c => {
    const mWC = [[], [], []];
    // get all the edges
    const edges = findEdges(c.get('components')[componentIndex].constraints);
    for (let m = 2; m <= size; m++) {
      const name = names[m - 2];
      if (!c.getIn(['diagnostics', name])) {
        const diagnostics = {
          time: 0,
          revisions: 0,
          tuplesKilled: 0,
        };
        c.setIn(['diagnostics', name], diagnostics);
      }
      const diagnostics = c.getIn(['diagnostics', name]);
      const PWC = [];
      const startTime = performance.now();

      // build the pairs and map each constraint to its pairs
      const pairs = findPairs(mapEdges(edges), edges, m);
      const constraintsToPairs = new Map();
      pairs.forEach(pair => {
        const constraints = new Set();
        pair.forEach(edge => edge.forEach(constraint => constraints.add(constraint)));
        constraints.forEach(constraint => {
          if (!constraintsToPairs.has(constraint)) {
            constraintsToPairs.set(constraint, []);
          }
          constraintsToPairs.get(constraint).push(pair);
        });
      });

      // revise the pairs until they reach a steady state
      const queue = [...pairs];
      try {
        while (queue.length > 0) {
          diagnostics.revisions++;
          const pair = queue.shift();
          const revisedConstraints = revise(pair, diagnostics);
          if (!revisedConstraints) {
            throw pair;
          }
          revisedConstraints.forEach(constraint =>
            queue.push(...constraintsToPairs.get(constraint).filter(p => p !== pair && !queue.includes(p))));
        }
      } catch (error) {
        error.forEach(constraint => constraint.killAll());
      }

      // solve any variables with a domain of only one value
      c.get('components')[componentIndex].constraints.forEach(constraint => {
        const specs = constraint.supportedSpecs();
        if (specs) {
          PWC.push(...specs);
        }
      });
      diagnostics.time += performance.now() - startTime;

      // add all PWC cells to the list of solvable cells
      mWC[m - 2].push(...PWC);
    }
    mWC.forEach((cells, index) => {
      const m = index + 2;
      const name = names[m - 2];
      if (cells.length > 0) {
        if (!c.getIn(['solvable', name])) {
          c.setIn(['solvable', name], []);
        }
        c.updateIn(['solvable', name], x => x.concat(cells));
      }
    });
  });
};

/**
 * Creates a formatted HistoryLogItem object to represent the diagnostics of the mWC iteration.
 * @param {Immutable.Map} csp constraint model of the board
 * @param {number} [numRuns=1] number of iterations recorded in the diagnostics
 * @returns {HistoryLogItem} new HistoryLogItem of the diagnostics
 */
export const logDiagnostics = (csp, numRuns = 1) => {
  const names = [Algorithms.mWC1, Algorithms.mWC2, Algorithms.mWC3, Algorithms.mWC4];
  const log = new HistoryLogItem('m-Wise Consistency:', HistoryLogStyles.DEFAULT, false);
  for (let m = 1; m <= csp.getIn(['algorithms', Algorithms.mWC, 'm']); m++) {
    const name = names[m - 1];
    if (csp.getIn(['diagnostics', name])) {
      log.addDetail(`\n${name}:`, true);
      const diagnostics = csp.getIn(['diagnostics', name]);
      Object.keys(diagnostics).forEach(key => {
        const average = diagnostics[key] / numRuns;
        let detail;
        switch (key) {
          case 'time': detail = `CPU time\t\t\t\t${Math.round(average * 100) / 100} ms`; break;
          case 'revisions': detail = `# pairs checked\t\t\t${Math.round(average)}`; break;
          case 'tuplesKilled': detail = `# tuples killed\t\t\t\t${numberWithCommas(Math.round(average))}`; break;
          default: detail = `${key}\t\t\t\t${Math.round(average)}`;
        }
        log.addDetail(detail);
      });
    }
  }
  return log;
};

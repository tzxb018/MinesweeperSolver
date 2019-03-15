import Immutable from 'immutable';
import HistoryLogItem from 'objects/HistoryLogItem';
import { loadXMLString } from 'objects/XMLParser';
import { logDiagnostics as logBT } from 'algorithms/BT';
import { logDiagnostics as logmWC } from 'algorithms/mWC';
import { logDiagnostics as logSTR2 } from 'algorithms/STR2';
import { checkWinCondition } from 'reducers/board/cellUtils';
import {
  cheat,
  loop,
  reset,
} from 'reducers/board/reducerFunctions';
import {
  HistoryLogStyles,
  HistoryLogSymbols,
} from 'enums';

/**
 * Handles the test action by running the game multiple times and recording how efficiently the active algorithms solved
 * each problem.
 * @param {object} event object passed as the message
 * @param {array} event.data array containing the data of the message
 * @param {object} event.data[0] board state to run the tests with
 * @param {number} event.data[1] number of times to run the game
 * @param {boolean} event.data[2] true if cheats are allowed, false if processing should be stopped when cheats are
 * needed to continue
 * @param {array} event.data[3] list of premade test instances in xml format, if undefined then randomly generated
 * instances will be used
 */
const onmessage = event => {
  // set up the test environment
  let state = Immutable.fromJS(event.data[0]);
  const numIterations = event.data[1];
  const allowCheats = event.data[2];
  const instances = event.data[3];
  const useRandomInstances = instances === undefined;

  const logs = [];
  const startTime = performance.now();
  let numRuns = 0;
  let numFails = 0;
  let totalCheats = 0;

  for (let i = 0; i < numIterations; i++) {
    numRuns++;
    try {
      // attempt to solve the puzzle
      if (useRandomInstances) {
        state = cheat(state);
      } else {
        state = loadXMLString(state, instances[i % instances.length]);
      }
      state = loop(state, false);
      let numCheats = 0;
      if (allowCheats) {
        while (state.get('isGameRunning') && state.getIn(['csp', 'isConsistent'])) {
          state = cheat(state, false);
          numCheats++;
          state = loop(state, false);
        }
        totalCheats += numCheats;
      }

      // determine the results
      let log;
      let isRed = false;
      if (state.get('isGameRunning')) {
        isRed = true;
        numFails++;
        // stopped due to inconsistencies
        if (!state.getIn(['csp', 'isConsistent'])) {
          const message = state.get('historyLog').last().message;
          log = new HistoryLogItem(message, HistoryLogStyles.RED, false);
        // could not solve without cheats
        } else {
          const numFlagged = state.getIn(['minefield', 'numFlagged']);
          const numRevealed = state.getIn(['minefield', 'numRevealed']);
          let cellOrCells = 'cells';
          if (numFlagged + numRevealed === 1) {
            cellOrCells = 'cell';
          }
          const message = `Solved ${numFlagged + numRevealed} ${cellOrCells}, ${numFlagged}`
            + `[${HistoryLogSymbols.FLAG}]`;
          log = new HistoryLogItem(message, HistoryLogStyles.RED, false);
          log.addDetail('Cheats needed to advance further');
        }
      } else {
        // solved the puzzle
        if (checkWinCondition(state.get('minefield'))) {
          const message = 'Successfully solved the puzzle';
          log = new HistoryLogItem(message, HistoryLogStyles.GREEN, false);
        // made an error while solving
        } else {
          const message = 'Error made during solving';
          log = new HistoryLogItem(message, HistoryLogStyles.RED, false);
          numFails++;
          isRed = true;
        }
      }
      state = state.update('historyLog', h => h.pop());
      if (isRed || numIterations <= 100) {
        state.getIn(['csp', 'count']).forEach((counter, setKey) => {
          let cellOrCells = 'cells';
          if (counter.numFlagged + counter.numRevealed === 1) {
            cellOrCells = 'cell';
          }
          log.addDetail(
            `${setKey} solved ${counter.numFlagged + counter.numRevealed} ${cellOrCells}, ${counter.numFlagged}`
            + `[${HistoryLogSymbols.FLAG}]`
          );
        });
        if (numCheats > 0) {
          let cellOrCells = 'times';
          if (numCheats === 1) {
            cellOrCells = 'time';
          }
          log.addDetail(`Cheat used ${numCheats} ${cellOrCells}`);
        }
        logs.push(log);
      }
    } catch (e) {
      const message = 'Error thrown during solving';
      const log = new HistoryLogItem(message, HistoryLogStyles.RED, false);
      log.addDetail(`${e.toString()}`);
      console.log(e);
      numFails++;
      logs.push(log);
      postMessage(state.update('historyLog', h => h.push(...logs)).toJS());
    }
    state = state.deleteIn(['csp', 'count']);
    state = reset(state);
  }

  // log the results
  const accuracy = (numRuns - numFails) / numRuns * 100;
  const message = `Testing was ${Math.round(accuracy)}% successful`;
  const log = new HistoryLogItem(message, HistoryLogStyles.DEFAULT, false);
  const executionTime = Math.round((performance.now() - startTime) / 10) / 100;
  log.addDetail(`\nExecution Time: ${executionTime} seconds`, true);
  if (allowCheats) {
    const averageCheats = Math.round(totalCheats / numRuns * 100) / 100;
    log.addDetail(`\nAverage cheats used: ${averageCheats}`, true);
  }
  logs.push(log);

  // search logging
  if (state.getIn(['csp', 'algorithms', 'BT', 'isActive'])) {
    const search = logBT(state.get('csp'), numRuns);
    logs.push(search);
  }

  // STR2 logging
  if (state.getIn(['csp', 'algorithms', 'STR2', 'isActive'])) {
    const str2 = logSTR2(state.get('csp'), numRuns);
    logs.push(str2);
  }

  // mWC logging
  if (state.getIn(['csp', 'algorithms', 'mWC', 'isActive'])) {
    const mWC = logmWC(state.get('csp'), numRuns);
    logs.push(mWC);
  }

  state = state.updateIn(['csp', 'diagnostics'], d => d.clear());
  postMessage(state.update('historyLog', h => h.push(...logs)).toJS());
};


self.addEventListener(
  'message',
  onmessage,
);

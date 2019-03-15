import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import { initTestState } from 'reducers/board/testFunctions';
import TestWorker from 'web_workers/test.worker.js';

import styles from './style';

const worker = new TestWorker();

export default class TestPanel extends Component {
  static propTypes = {
    // state props
    algorithms: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      PropTypes.instanceOf(Map),
    ]).isRequired,
    isTesting: PropTypes.bool.isRequired,
    numCols: PropTypes.number.isRequired,
    numMines: PropTypes.number.isRequired,
    numRows: PropTypes.number.isRequired,
    // dispatch props
    testEnd: PropTypes.func.isRequired,
    testStart: PropTypes.func.isRequired,
  }


  /* local state */

  state = {
    allowCheats: true,
    numIterations: 50,
    useRandomInstances: false,
  }


  /* event handlers */

  clickHandler = () => {
    this.props.testStart();
    const boardSettings = {
      numRows: this.props.numRows,
      numCols: this.props.numCols,
      numMines: this.props.numMines,
      algorithms: this.props.algorithms,
    };

    // set up and serialize the test environment
    const state = initTestState(boardSettings).toJS();

    if (this.state.useRandomInstances) {
      worker.postMessage(
        [state, this.state.numIterations, this.state.allowCheats]);
    } else {
      const url = `http://localhost:8000/test-instances${this.state.numIterations}`;
      fetch(url, {
        method: 'GET',
      })
      .then(res => res.text())
      .then(response => {
        worker.postMessage(
          [state, this.state.numIterations, this.state.allowCheats, JSON.parse(response)]);
      });
    }

    worker.onmessage = event => {
      // deserialize the results
      const results = Immutable.fromJS(event.data);
      this.props.testEnd(results);
    };
  }


  render() {
    return (
      <div>
        <h1>Tests</h1>
        <div className={styles['container']}>
          <button className={styles['button']} onClick={this.clickHandler} disabled={this.props.isTesting}>
            Run
          </button>
          <NumericInput id="numIterations"
            className={styles['selector']}
            onChange={valueAsNumber => this.setState({ numIterations: valueAsNumber })}
            min={10}
            max={1000}
            value={this.state.numIterations}
            step={10}
            snap
          />
          <div>
            <input type="checkbox"
              id="allowCheats"
              checked={this.state.allowCheats}
              onChange={() => this.setState({ allowCheats: !this.state.allowCheats })}
            />
            <label htmlFor="allowCheats">allow cheats</label>
          </div>
        </div>
      </div>
    );
  }
}

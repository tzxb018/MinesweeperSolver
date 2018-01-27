import React from 'react';

import CSPButtonContainer from 'containers/CSPButtonContainer';
import Board from './Board/index.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Board />
        <CSPButtonContainer />
      </div>
    );
  }
}

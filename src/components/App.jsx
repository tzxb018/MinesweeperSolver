import React from 'react';

import CSPButtonContainer from 'containers/CSPButtonContainer';
import SizeSelectorContainer from 'containers/SizeSelectorContainer';
import BoardContainer from 'containers/BoardContainer';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <BoardContainer />
        <SizeSelectorContainer />
        <CSPButtonContainer />
      </div>
    );
  }
}

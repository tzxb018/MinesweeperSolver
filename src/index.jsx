import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from 'components/App';
import reducer from 'reducers';

const store = createStore(
  reducer
);

ReactDOM.render(
  <Provider store={store} style={{ height: '100%' }}>
    <App />
  </Provider>,
  document.getElementById('app'),
);

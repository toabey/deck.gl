import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/app';
import document from 'global/document';
import AppState from './reducers';

ReactDOM.render(
  <Provider store={AppState}>
    <App />
  </Provider>,
  document.getElementById('app-content')
);

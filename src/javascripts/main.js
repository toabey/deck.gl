import 'babel-polyfill';

import React from 'react';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import { createHashHistory } from 'history';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/app';
import document from 'global/document';
import AppState from './reducers';

import pages from './constants/pages';

function renderRoute(page, i) {
  return <Route key={i} path={page.path} component={page.demo} page={page} />
}

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

ReactDOM.render(
  <Provider store={AppState}>
    <Router history={appHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={pages[0].demo}  />
        { pages.map(renderRoute) }
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app-content')
);

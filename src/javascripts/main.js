import 'babel-polyfill';

import React from 'react';
import {Router, Route, IndexRedirect, useRouterHistory} from 'react-router'
import { createHashHistory } from 'history';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Home from './components/home';
import Gallery from './components/gallery';
import Page from './components/page';
import document from 'global/document';
import AppState from './reducers';

import {examplePages, docPages} from './constants/pages';

function renderRoute(page, i) {
  return <Route key={i} path={page.path} component={Page} tabs={page.tabs} />
}

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

ReactDOM.render(
  <Provider store={AppState}>
    <Router history={appHistory}>
      <Route path="examples" component={Gallery} pages={examplePages}>
        <IndexRedirect to={examplePages[0].path} />
        { examplePages.map(renderRoute) }
      </Route>
      <Route path="documentation" component={Gallery} pages={docPages}>
        <IndexRedirect to={docPages[0].path} />
        { docPages.map(renderRoute) }
      </Route>
      <Route path="*" component={Home} />
    </Router>
  </Provider>,
  document.getElementById('app-content')
);

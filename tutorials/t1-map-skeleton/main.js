// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// ---- Tasks ---- //
// 1. create a map centering your home town with a proper zoom level
// 2. enable the perspective mode, test with different pitch and bearing values
// 3*. add a scatterplot overlay using the sf.bike.parking.csv data
//    (https://uber.github.io/react-map-gl/#/scatterplot)

/* eslint-disable func-style */
/* eslint-disable no-console */
import 'babel-polyfill';
import autobind from 'autobind-decorator';
import {document, window} from 'global';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import {loadCsvFile} from '../utils';

// ---- Default Settings ---- //
/* eslint-disable no-process-env */
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN ||
  'Set MAPBOX_ACCESS_TOKEN environment variable or put your token here.';

const INITIAL_STATE = {
  mapProps: {
    latitude: 37.75,
    longitude: -122.43,
    zoom: 11.5
  },
  points: null
};

// ---- Action ---- //
const updateMapProps = mapProps => ({type: 'UPDATE_MAP_PROPS', mapProps});
const loadPoints = points => ({type: 'LOAD_POINTS', points});

// ---- Reducer ---- //
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case 'UPDATE_MAP_PROPS':
    return {...state, mapProps: action.mapProps};
  case 'LOAD_POINTS':
    // ---- TODO ---- //
    const points = action.points;
    return {...state, points};
  default:
    return state;
  }
}

// ---- redux states -> react props ---- //
const mapStateToProps = state => {
  return {
    mapProps: state.mapProps,
    points: state.points
  };
}

// ---- View ---- //
class MapApp extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    window.addEventListener('resize', this._handleResize);
    this._handleResize();
    // use the following line if you are working on task 3
    // loadCsvFile(POINTS_FILE, this._handlePointsLoaded);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  @autobind _handleResize() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  @autobind _handlePointsLoaded(data) {
    this.props.dispatch(loadPoints(data));
  }

  _renderMap() {
    // ---- TODO ---- //
  }

  render() {
    return <div>{this._renderMap()}</div>;
  }
}

// ---- Main ---- //
const store = createStore(reducer);
const App = connect(mapStateToProps)(MapApp);

const appContainer = document.createElement('div');
document.body.appendChild(appContainer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  appContainer
);

/* eslint-enable func-style */
/* eslint-enable no-console */

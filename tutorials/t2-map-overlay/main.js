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
// 1. add a deck.gl scatterplot layer using the sf.bike.parking.csv data
// 2. add a deck.gl hexagon layer using the hexagons.csv file
// 3*. using the scatterplot data in 1 to color the hexagons in 2

/* eslint-disable func-style */
/* eslint-disable no-console */
import 'babel-polyfill';
import autobind from 'autobind-decorator';
import {document, window} from 'global';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {createSelector} from 'reselect';

import {loadCsvFile} from '../utils';
import MapGL from 'react-map-gl';

// ---- Default Settings ---- //
/* eslint-disable no-process-env */
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN ||
  'Set MAPBOX_ACCESS_TOKEN environment variable or put your token here.';

const HEXAGONS_FILE = './tutorials/data/hexagons.csv';
const POINTS_FILE = './tutorials/data/sf.bike.parking.csv';

const INITIAL_STATE = {
  mapProps: {
    latitude: 37.75,
    longitude: -122.43,
    zoom: 11.5
  },
  hexagons: null,
  points: null
};

// ---- Action ---- //
const updateMapProps = mapProps => ({type: 'UPDATE_MAP_PROPS', mapProps});
const loadHexagons = hexagons => ({type: 'LOAD_HEXAGONS', hexagons});
const loadPoints = points => ({type: 'LOAD_POINTS', points});

// ---- Reducer ---- //
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case 'UPDATE_MAP_PROPS':
    return {...state, mapProps: action.mapProps};
  case 'LOAD_HEXAGONS':
    return {...state, hexagons: action.hexagons};
  case 'LOAD_POINTS':
    const points = action.points;
    return {...state, points: action.points};
  default:
    return state;
  }
}

// ---- Selector ---- //
const getPoints = createSelector([state => state.points], points => {
  // ---- TODO ---- //
  return points;
});

const getMapProps = createSelector([state => state.mapProps], mapProps => {
  // ---- TODO ---- //
  return mapProps;
});

const getHexagons = createSelector([state => state.hexagons], hexagons => {
  // ---- TODO ---- //
  return hexagons;
});

// use the following function if you are working on task 3
// const getHexagons = createSelector([
//   state => state.hexagons,
//   state => state.points
// ], (hexagons, points) => {
//   // ---- TODO ---- //
//   return hexagons;
// });

// ---- redux states -> react props ---- //
const mapStateToProps = state => {
  return {
    hexagons: getHexagons(state),
    mapProps: getMapProps(state),
    points: getPoints(state)
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

    loadCsvFile(HEXAGONS_FILE, this._handleHexagonsLoaded);
    loadCsvFile(POINTS_FILE, this._handlePointsLoaded);
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

  @autobind _handleHexagonsLoaded(data) {
    this.props.dispatch(loadHexagons(data));
  }

  @autobind _handleChangeViewport(mapProps) {
    if (mapProps.pitch > 60) {
      mapProps.pitch = 60;
    }
    this.props.dispatch(updateMapProps(mapProps));
  }

  _renderMap() {
    const {mapProps} = this.props;
    const {width, height} = this.state;

    return (
      <MapGL
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        width={width}
        height={height}
        perspectiveEnabled
        {...mapProps}
        onChangeViewport={this._handleChangeViewport}>
        {this._renderDeckGLOverlay()}
      </MapGL>
    );
  }

  _renderDeckGLOverlay() {
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

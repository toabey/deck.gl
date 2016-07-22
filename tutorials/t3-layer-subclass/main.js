/* eslint-disable func-style, no-console */
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
import {DeckGLOverlay} from '../../src';
import {EnhancedScatterplotLayer} from './layers';

// ---- Default Settings ---- //
/* eslint-disable no-process-env */
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN ||
  'Set MAPBOX_ACCESS_TOKEN environment variable or put your token here.';

const POINTS_FILE = './tutorials/data/sf.bike.parking.csv';

const INITIAL_STATE = {
  mapProps: {
    latitude: 37.75,
    longitude: -122.43,
    zoom: 11.5
  },
  points: []
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
    const points = action.points.map(point => {
      const coordString = point.COORDINATES;
      const p0 = coordString.indexOf('(') + 1;
      const p1 = coordString.indexOf(')');
      const coords = coordString.slice(p0, p1).split(',');
      return {
        position: {
          x: Number(coords[1]),
          y: Number(coords[0]),
          z: 0
        },
        color: [88, 9, Math.random() * 124]
      };
    });
    return {...state, points};
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


// ---- redux states -> react props ---- //
const mapStateToProps = state => {
  return {
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

  @autobind _handleChangeViewport(mapProps) {
    if (mapProps.pitch > 60) {
      mapProps.pitch = 60;
    }
    this.props.dispatch(updateMapProps(mapProps));
  }

  @autobind _onHover(info) {
    console.log('hover', info)
  }

  @autobind _onClick(info) {
    console.log('click', info)
  }

  render() {
    const {mapProps, points} = this.props;
    const {width, height} = this.state;

    return (
      <div>
        <MapGL
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width={width}
          height={height}
          perspectiveEnabled
          {...mapProps}
          onChangeViewport={this._handleChangeViewport}>
        <DeckGLOverlay
          width={width}
          height={height}
          {...mapProps}
          layers={[
            new EnhancedScatterplotLayer({
              id: 'scatterplotLayer',
              ...mapProps,
              width,
              height,
              data: points,
              isPickable: true,
              onHover: this._onHover,
              onClick: this._onClick
            })
          ]}/>
        </MapGL>
      </div>
    );
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

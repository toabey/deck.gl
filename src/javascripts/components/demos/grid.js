import 'babel-polyfill';
import React, {Component} from 'react';
import {DeckGLOverlay, GridLayer} from 'deck.gl';

import {MAPBOX_STYLES} from '../../constants/defaults';

class GridDemo extends Component {

  static get data() {
    return {
      type: 'text',
      url: 'static/grid-data.txt',
      worker: 'static/grid-data-decoder.js'
    };
  }

  static get parameters() {
    return {
      cellSize: {displayName: 'Cell Size', type: 'number', value: 10, step: 5, min: 10}
    };
  }

  static get viewport() {
    return {
      mapStyle: MAPBOX_STYLES.DARK,
      longitude: -122.4,
      latitude: 37.8,
      zoom: 11,
      pitch: 0,
      bearing: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    if (data && data !== this.props.data) {
      console.log('Sample count: ' + data.length);
    }
  }

  render() {
    const {viewport, params, data} = this.props;

    if (!data) {
      return null;
    }

    const layer = new GridLayer({
      id: 'grid',
      ...viewport,
      data: data,
      unitWidth: params.cellSize.value,
      unitHeight: params.cellSize.value,
      isPickable: false
    });

    return (
      <DeckGLOverlay {...viewport} layers={ [layer] } />
    );
  }
}

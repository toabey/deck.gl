import 'babel-polyfill';
import React, {Component} from 'react';
import {DeckGLOverlay, GridLayer} from 'deck.gl';

import {MAPBOX_STYLES} from '../../constants/defaults';

export default class GridDemo extends Component {

  static get data() {
    return {
      url: 'data/grid-data.txt',
      worker: 'workers/grid-data-decoder.js'
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

  static renderInfo(meta) {
    return (
      <div>
        <h3>California Public Transit Distribution</h3>
        <p>Accessibility to public transportation</p>
        <div className="stat">Samples<b>{ meta.count || 0 }</b></div>
      </div>
    );
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

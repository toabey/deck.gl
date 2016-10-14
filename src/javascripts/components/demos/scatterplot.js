import 'babel-polyfill';
import React, {Component} from 'react';
import {DeckGLOverlay, ScatterplotLayer} from 'deck.gl';

import {MAPBOX_STYLES} from '../../constants/defaults';

export default class ScatterPlotDemo extends Component {

  static get info() {
    return {
      title: 'Every Person in New York City',
      desc: 'Each dot accounts for 10 people. Density per tract from 2015 census data.'
    };
  }

  static get data() {
    return {
      type: 'text',
      url: 'static/scatterplot-data.txt',
      worker: 'static/scatterplot-data-decoder.js'
    };
  }

  static get parameters() {
    return {
      colorM: {displayName: 'Male', type: 'color', value: '#08f'},
      colorF: {displayName: 'Female', type: 'color', value: '#f08'},
      radius: {displayName: 'Radius', type: 'number', value: 0.2, step: 0.1, min: 0.1}
    };
  }

  static get viewport() {
    return {
      mapStyle: MAPBOX_STYLES.LIGHT,
      longitude: -74,
      latitude: 40.7,
      zoom: 11,
      pitch: 0,
      bearing: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    if (data && data !== this.props.data) {
      console.log('Point count: ' + data.length);
    }
  }

  render() {
    const {viewport, params, data} = this.props;

    if (!data) {
      return null;
    }

    const layer = new ScatterplotLayer({
      id: 'scatter-plot',
      ...viewport,
      data: data,
      getPosition: d => [d[0], d[1], 0],
      getColor: d => d[2] === 1 ? params.colorM.value : params.colorF.value,
      getRadius: d => params.radius.value,
      updateTriggers: {
        instanceColors: {c1: params.colorM.value, c2: params.colorF.value},
        instancePositions: {radius: params.radius.value}
      },
      isPickable: true
    });

    return (
      <DeckGLOverlay {...viewport} layers={ [layer] } />
    );
  }
}

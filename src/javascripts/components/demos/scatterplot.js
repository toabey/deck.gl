import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DeckGLOverlay, ScatterplotLayer} from 'deck.gl';

import {MAPBOX_STYLES} from '../../constants/defaults';
import {loadData, useParams, updateMap} from '../../actions/app-actions';

class ScatterPlotDemo extends Component {

  componentDidMount() {
    this.props.loadData(this, {
      type: 'text',
      url: 'static/scatterplot-data.txt',
      worker: 'static/scatterplot-data-decoder.js'
    });
    this.props.useParams({
      colorM: {displayName: 'Male', type: 'color', value: '#08f'},
      colorF: {displayName: 'Female', type: 'color', value: '#f08'},
      radius: {displayName: 'Radius', type: 'number', value: 0.2, step: 0.1, min: 0.1}
    });
    this.props.updateMap({
      mapStyle: MAPBOX_STYLES.LIGHT,
      longitude: -74, latitude: 40.7,
      zoom: 11, pitch: 0, bearing: 0
    });
  }

  componentWillReceiveProps(nextProps) {
    const {data} = nextProps;
    if (data && data !== this.props.data) {
      console.log('Point count: ' + data.length);
    }
  }

  render() {
    const {viewport, params, data, owner} = this.props;

    if (!data || owner !== this.constructor.name) {
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

function mapStateToProps(state) {
  return {
    ...state.app,
    viewport: state.viewport,
  };
}

const mapDispatchToProps = {
  updateMap,
  loadData,
  useParams
};

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlotDemo);

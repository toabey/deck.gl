import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DeckGLOverlay, ScatterplotLayer} from 'deck.gl';

import {loadData, useParams, updateMap} from '../../actions/app-actions';

class ScatterPlotDemo extends Component {

  componentDidMount() {
    this.props.loadData(this, {
      type: 'text',
      url: 'static/scatterplot-data',
      worker: 'static/scatterplot-data-decoder.js'
    });
    this.props.useParams({
      colorM: {name: 'Male', type: 'color', value: '#08f'},
      colorF: {name: 'Female', type: 'color', value: '#f08'},
      radius: {name: 'Radius', type: 'number', value: 0.2, step: 0.1}
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.props.updateMap({longitude: -74, latitude: 40.7, zoom: 11});
      console.log('Point count: ' + nextProps.data.length);
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

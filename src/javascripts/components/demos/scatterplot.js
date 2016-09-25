import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DeckGLOverlay, ScatterplotLayer} from 'deck.gl';

import {loadData, useParams} from '../../actions/app-actions';

class ScatterPlotDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount() {

    this.props.loadData(this, 'csv', 'static/sf-traffic-accidents-2016-09.csv');
    this.props.useParams({
      color: {type: 'color', value: '#f00'},
      radius: {type: 'number', value: 2}
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data ||
        nextProps.params !== this.props.params) {
      this._updateData(nextProps);
    }
  }

  _updateData(props) {
    const {data, params} = props;
    let scatterPlotData = [];
    if (data) {
      scatterPlotData = data.map(d => ({
        position: {x: Number(d.X), y: Number(d.Y), z: 0},
        color: params.color.value,
        radius: params.radius.value
      }));
    }
    this.setState({data: scatterPlotData});
  }

  render() {
    const {viewport} = this.props;

    const layer = new ScatterplotLayer({
      id: 'scatter-plot',
      ...this.props.viewport,
      data: this.state.data,
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
  loadData,
  useParams
};

export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlotDemo);

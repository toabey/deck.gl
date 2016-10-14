import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import MapGL from 'react-map-gl';

import MarkdownPage from '../components/markdown-page';
import GenericInput from './input';
import * as Demos from './demos';

import {
  updateMap,
  updateParam, useParams,
  loadData, loadContent
} from '../actions/app-actions';
import {MAPBOX_ACCESS_TOKEN, MAPBOX_STYLES} from '../constants/defaults';

const DEMO_TAB = 0;
const CONTENT_TAB = 1;

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: DEMO_TAB,
      ...this._loadTabs(props.route.tabs)
    };
  }

  componentDidMount() {
    window.onresize = this._resizeMap.bind(this);
    this._resizeMap();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routes !== nextProps.routes) {
      this.setState({
        tab: DEMO_TAB,
        ...this._loadTabs(nextProps.route.tabs)
      });
    }
  }

  _loadTabs(tabs) {
    const {demo, content} = tabs;
    const {loadData, useParams, updateMap, loadContent} = this.props;
    const DemoComponent = Demos[demo];

    if (DemoComponent) {
      loadData(demo, DemoComponent.data);
      useParams(DemoComponent.parameters);
      updateMap(DemoComponent.viewport);
    }
    loadContent(content);

    return {
      ...tabs,
      demo: DemoComponent ? demo : null
    };
  }

  _resizeMap() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.props.updateMap({
      width: w <= 768 ? w : w - 240,
      height: h - 64
    });
  }

  _renderMap() {
    const {children, params, viewport, owner, data} = this.props;
    const {demo} = this.state;
    const DemoComponent = Demos[demo];

    return (
      <MapGL
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        perspectiveEnabled={true}
        { ...viewport }
        onChangeViewport={ this.props.updateMap }>

        <DemoComponent viewport={viewport} params={params}
          data={owner === demo ? data : null} />

      </MapGL>
    )
  }

  _renderOptions() {
    const {params} = this.props;

    if (Object.keys(params).length === 0) {
      return null;
    }

    return (
      <div className="options-panel">
        {
          Object.keys(params).map((name, i) => (
            <GenericInput key={i} name={name} {...params[name]}
              onChange={this.props.updateParam} />
          ))
        }
      </div>
    );
  }

  _renderTabContent() {
    const {tab, content, demo} = this.state;
    const {contents} = this.props;
    const markdown = <MarkdownPage content={contents[content]} />

    if (!demo) {
      return markdown;
    }

    return (
      <div>
        <div className={`tab ${tab === DEMO_TAB ? 'active' : ''}`}>
          { this._renderMap() }
          { this._renderOptions() }
        </div>
        <div className={`tab ${tab === CONTENT_TAB ? 'active' : ''}`}>
          { markdown }
        </div>
      </div>
    );
  }

  _renderTabs() {
    const {tab} = this.state;
    return (
      <ul className="tabs">
        <li className={`${tab === DEMO_TAB ? 'active' : ''}`}>
          <button onClick={ () => this.setState({tab: DEMO_TAB}) }>Demo</button>
        </li>
        <li className={`${tab === CONTENT_TAB ? 'active' : ''}`}>
          <button onClick={ () => this.setState({tab: CONTENT_TAB}) }>Code</button>
        </li>
      </ul>
    );
  }

  render() {
    const {routes: [parentRoute]} = this.props;
    const {demo} = this.state;

    return (
      <div>
        { demo && this._renderTabs() }
        { this._renderTabContent() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.app,
    viewport: state.viewport,
    contents: state.contents
  };
}

const mapDispatchToProps = {
  updateMap,
  useParams,
  updateParam,
  loadData,
  loadContent
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);

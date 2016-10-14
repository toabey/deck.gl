import 'babel-polyfill';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import MapGL from 'react-map-gl';
import TWEEN from 'tween.js';

import MarkdownPage from '../components/markdown-page';
import GenericInput from './input';
import * as Demos from './demos';
import * as appActions from '../actions/app-actions';
import {MAPBOX_ACCESS_TOKEN, MAPBOX_STYLES} from '../constants/defaults';

const DEMO_TAB = 0;
const CONTENT_TAB = 1;

function animate() {
  TWEEN.update();
  requestAnimationFrame(animate);
}
animate();

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
    const {route} = nextProps;
    if (this.props.route !== route) {
      this.setState({
        tab: DEMO_TAB,
        ...this._loadTabs(route.tabs)
      });
    }
  }

  _loadTabs(tabs) {
    const {demo, content} = tabs;
    const {viewport, loadData, useParams, updateMap, loadContent} = this.props;
    const DemoComponent = Demos[demo];

    if (DemoComponent) {
      loadData(demo, DemoComponent.data);
      useParams(DemoComponent.parameters);

      // fly to new viewport
      const fromViewport = {};
      const nanViewport = {};
      const toViewport = DemoComponent.viewport;
      Object.keys(toViewport).forEach(key => {
        const v = viewport[key];
        if (isNaN(v)) {
          nanViewport[key] = toViewport[key];
        } else {
          fromViewport[key] = v;
        }
      });

      TWEEN.removeAll();
      new TWEEN.Tween(fromViewport)
        .to(toViewport, 1000)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate(function() {
          updateMap({...this, ...nanViewport});
        })
        .start();
    }
    loadContent(content);

    return {
      ...tabs,
      demoInfo: DemoComponent && DemoComponent.info,
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
    const {viewport, app: {params, owner, data}} = this.props;
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
    const {app: {params}} = this.props;
    const {demoInfo} = this.state;

    return (
      <div className="options-panel">
        <h3>{ demoInfo.title }</h3>
        <p>{ demoInfo.desc }</p>
        { Object.keys(params).length > 0 && <hr /> }
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
      <div className="page">
        { demo && this._renderTabs() }
        { this._renderTabContent() }
      </div>
    );
  }
}

export default connect(state => state, appActions)(Page);

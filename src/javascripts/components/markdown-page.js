import 'babel-polyfill';
import marked from 'marked';
import {highlight} from 'highlight.js';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {loadContent} from '../actions/app-actions';

class MarkdownPage extends Component {

  componentWillMount() {
    this._loadContent(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    const {url} = nextProps;
    if (url !== this.props.url) {
      this._loadContent(url);
    }
  }

  _loadContent(url) {
    this.props.loadContent(url);
  }

  render() {
    const {contents, url} = this.props;
    const content = contents[url];

    if (content) {
      marked.setOptions({
        highlight: function (code) {
          return require('highlight.js').highlightAuto(code).value;
        }
      });

      return (
        <div className="markdown">
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: marked(content)}} />
        </div>
      );
    }
    return <div />;
  }
}

MarkdownPage.propTypes = {
  url: PropTypes.string
};

function mapStateToProps(state) {
  return {
    contents: state.contents
  };
}

const mapDispatchToProps = {
  loadContent
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownPage);

import 'babel-polyfill';
import React, {Component} from 'react';

import pages from '../constants/pages';

export default class TableOfContents extends Component {

  _renderLink(page, i) {
    return (
      <li key={i}>
        <a href={ `#${page.path}` }>{ page.displayName }</a>
      </li>
    );
  }

  render() {
    return (
      <ul className="toc">
        { pages.map(this._renderLink) }
      </ul>
    )
  }
}

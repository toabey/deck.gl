import 'babel-polyfill';
import React, {Component} from 'react';
import {Link} from 'react-router'

import pages from '../constants/pages';

export default class TableOfContents extends Component {

  _renderLink(page, i) {
    return (
      <li key={i}>
        <Link to={ page.path } activeClassName="active">
          { page.displayName }
        </Link>
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

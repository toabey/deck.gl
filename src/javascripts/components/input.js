import 'babel-polyfill';
import React, {Component} from 'react';

export default class GenericInput extends Component {

  render() {
    const {displayName, name, displayValue, onChange} = this.props;
    return (
      <div className="input">
        <label>{displayName}</label>
        <input 
          {...this.props}
          value={displayValue}
          onChange={ e => onChange(name, e.target.value) }/>
      </div>
    );
  }
}

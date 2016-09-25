import 'babel-polyfill';
import React, {Component} from 'react';

export default class GenericInput extends Component {

  render() {
    const {name, type, displayValue, onChange} = this.props;
    return (
      <div className="input">
        <label>{name}</label>
        <input type={type} value={displayValue}
          onChange={ e => onChange(name, e.target.value) }/>
      </div>
    );
  }
}

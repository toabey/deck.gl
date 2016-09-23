import {createStore, combineReducers} from 'redux';
import appReducer from './app';

const APP_STATE = combineReducers({
  appReducer
});

export default createStore(
  APP_STATE
);

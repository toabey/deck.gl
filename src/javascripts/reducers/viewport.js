import {DEFAULT_VIEWPORT_STATE} from '../constants/defaults';

export default function viewportReducer(state = DEFAULT_VIEWPORT_STATE, action) {
  switch(action.type) {
  case 'UPDATE_MAP':
    return {...state, ...action.viewport}
  }
  return state;
}

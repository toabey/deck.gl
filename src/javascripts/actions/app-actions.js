import * as request from 'd3-request';

export function loadStaticContent(filename) {
  return (dispatch, getState) => {
    const {contents} = getState();
    if (filename in contents) {
      // already loaded
      return;
    }
    dispatch(loadStaticContentStart(filename));
    request.text(`static/${filename}`, (error, response) => {
      dispatch(loadStaticContentSuccess(filename, error ? error : response));
    });
  }
}

function loadStaticContentStart(name) {
  return loadStaticContentSuccess(name, '');
}

function loadStaticContentSuccess(name, content) {
  const payload = {};
  payload[name] = content;
  return {type: 'LOAD_CONTENT', payload};
}

export function updateMap(viewport) {
  return {type: 'UPDATE_MAP', viewport};
}

export function loadData(source, type, url) {
  const owner = source.constructor.name;

  return dispatch => {
    dispatch(loadDataStart(owner));
    if (request[type]) {
      request[type](url, (error, response) => {
        if (!error) {
          dispatch(loadDataSuccess(owner, response));
        }
      });
    }
  };
}

function loadDataStart(owner) {
  return {type: 'LOAD_DATA_START', owner};
}

function loadDataSuccess(owner, data) {
  return {
    type: 'LOAD_DATA_SUCCESS',
    payload: {owner, data}
  };
}

export function updateParam(name, value) {
  return {type: 'UPDATE_PARAM', payload: {name, value}};
}

export function useParams(params) {
  return {type: 'USE_PARAMS', params};
}

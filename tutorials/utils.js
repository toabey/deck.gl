import request from 'd3-request';

/* eslint-disable func-style */
export const loadCsvFile = (path, onDataLoaded) => {
  request.csv(path, (error, data) => {
    if (error) {
      console.error(error);
    }
    onDataLoaded(data);
  });
};
/* eslint-enable func-style */

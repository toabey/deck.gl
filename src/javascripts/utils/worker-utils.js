const workers = {};

export function parseDataWithWorker(workerUrl, rawData, callback) {
  if (workers[workerUrl]) {
    workers[workerUrl].terminate();
  }

  const workerInstance = new Worker(workerUrl);
  workers[workerUrl] = workerInstance;
  let streamedData = [];

  workerInstance.onmessage = e => {
    const {action, data, meta} = e.data;
    switch(action) {
    case 'add':
      if (data && data.length) {
        streamedData = streamedData.concat(data);
        callback(streamedData, meta);
      }
      break;
    case 'end':
      workerInstance.terminate();
      break;
    }
  };

  workerInstance.postMessage(rawData);
}

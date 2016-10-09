var COORDINATE_PRECISION = 5;

onmessage = function(e) {

  if (e.data) {
    var result = [];
    var count = 0;
    var lines = e.data.split('\n');

    lines.forEach(function(l, i) {
      var p = l.split(',').map(parseFloat);
      result.push({
        position: {x: p[0], y: p[1]}
      });
    });

    postMessage({action: 'add', data: result});
    postMessage({action: 'end'});
  }
};

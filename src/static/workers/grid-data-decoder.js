var COORDINATE_PRECISION = 5;

onmessage = function(e) {

  if (e.data) {
    var result = [];
    var count = 0;
    var lines = e.data.split('\n');

    lines.forEach(function(line) {
      var coords = decodeCoords(line);
      for (var i = 0; i < coords.length; i += 2) {
        result.push({
          position: {x: coords[i], y: coords[i + 1]}
        });
      }
      postMessage({action: 'add', data: result});
    });

    postMessage({action: 'end'});
  }
};

function decodeCoords(str) {
  var multiplyer = Math.pow(10, COORDINATE_PRECISION);
  return decodeBase(str, 90, 32, 4).map(function(x) {
    return x / multiplyer - 180;
  });
}

function decodeBase(str, b, shift, length) {
  var result = [];
  for (var j = 0; j < str.length; j += length) {
    var token = str.slice(j, j + length);
    var x = 0;
    var p = 1;
    for (var i = token.length; i--; ) {
      x += (token.charCodeAt(i) - shift) * p;
      p *= b;
    }
    result.push(x);
  }
  return result;
}

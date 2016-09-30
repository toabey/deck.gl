var FLUSH_LIMIT = 100000;
var COORDINATE_PRECISION = 7;

onmessage = function(e) {
  var sequence;
  var result = [];
  var count = 0;

  if (e.data) {
    var lines = e.data.split('\n');

    lines.forEach(function(l, i) {
      if (!l.length) {
        return;
      }

      if (i === 0) {
        sequence = decodeSequence(l);
        return;
      }

      var bbox = decodeBbox(l.slice(0, 20));
      var bitmap = decodeBitmap(l.slice(20));

      for (var i = 0; i < bitmap.length; i++) {
        if (bitmap[i] > 0) {
          var point = [
            bbox[0] + (bbox[2] - bbox[0]) * sequence[i * 2],
            bbox[1] + (bbox[3] - bbox[1]) * sequence[i * 2 + 1],
            bitmap[i] * 1
          ];
          result[count++] = point;
        }
      }

      if (count >= FLUSH_LIMIT) {
        postMessage({action: 'add', data: result});
        result = [];
        count = 0;
      }
    });

    postMessage({action: 'add', data: result});
    postMessage({action: 'end'});
  }
};

function decodeSequence(str) {
  var seq = [];
  var tokens = str.split(/([A-Z])/).map(function(v) { return parseInt(v, 36) });
  for (var i = 0; i < tokens.length - 1; i += 2) {
    seq.push(tokens[i] / Math.pow(2, tokens[i + 1] - 10));
  }
  return seq;
}

function decodeBbox(str) {
  var multiplyer = Math.pow(10, COORDINATE_PRECISION);
  return decodeBase(str, 90, 32, 5).map(function(x) {
    return x / multiplyer - 180;
  });
}

function decodeBitmap(str) {
  var chunkSize = 4;
  var match = '';
  for (var i = 0; i < str.length; i++) {
    var seg = (str.charCodeAt(i) - 32).toString(3);
    while (seg.length < chunkSize) {
      seg = '0' + seg;
    }
    match += seg;
  }
  return match;
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

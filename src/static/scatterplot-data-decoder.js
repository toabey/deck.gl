var FLUSH_LIMIT = 100000;
var COORDINATE_PRECISION = 7;

onmessage = function(e) {
  var sequence;
  var result = [];
  var count = 0;

  if (e.data) {
    var lines = e.data.split('\n');

    lines.forEach(l => {
      if (!l.length) {
        return;
      }
      var parts = l.split('\x01');
      if (parts.length === 1) {
        sequence = decodeSequence(l);
        return;
      }

      var bbox = decodeBbox(parts[0]);
      var bitmap = decodeBitmap(parts[1]);

      for (var i = 0; i < bitmap.length; i++) {
        if (bitmap[i] > 0) {
          var point = [
            bbox[0] + bbox[2] * sequence[i * 2],
            bbox[1] + bbox[3] * sequence[i * 2 + 1],
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
  var bbox = str.split(',').map(function(x) {
    return parseInt(x, 36) / multiplyer;
  });
  bbox[0] = bbox[0] - 180;
  bbox[1] = bbox[1] - 90;
  return bbox;
}

function decodeBitmap(str) {
  var match = '';
  for (var i = 0; i < str.length; i++) {
    var seg = (str.charCodeAt(i) - 41).toString(3);
    while (seg.length < 4) {
      seg = '0' + seg;
    }
    match += seg;
  }
  return match;
}

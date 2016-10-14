var FLUSH_LIMIT = 100000;
var COORDINATE_PRECISION = 5;

onmessage = function(e) {
  var nodes = [];
  var result = [];
  var count = 0;

  if (e.data) {
    var lines = e.data.split('\n');

    lines.forEach(function(l, i) {
      if (!l.length) {
        return;
      }
      var lng = decodeCoords(l.slice(0, 4));
      var lat = decodeCoords(l.slice(4, 8));
      var links = decodeLinks(l.slice(8));

      nodes.push({
        coords: [lng, lat],
        links: links
      });
    });

    nodes.forEach(function(n) {

      for (var index in n.links) {
        if (n.links[index] > 400) {
          result[count++] = {
            source: nodes[index * 1].coords,
            target: n.coords,
            weight: n.links[index]
          };
        }

        if (count >= FLUSH_LIMIT) {
          postMessage({action: 'add', data: result});
          result = [];
          count = 0;
        }
      }

    });

    postMessage({action: 'add', data: result});
    postMessage({action: 'end'});
  }
};

function decodeCoords(str) {
  var multiplyer = Math.pow(10, COORDINATE_PRECISION);
  return decodeBase(str, 90, 32) / multiplyer - 180;
}

function decodeLinks(str) {
  var links = {};
  var tokens = str.split(/([\x5c-\x7f]+)/);
  for (var i = 0; i < tokens.length - 1; i += 2) {
    var index = decodeBase(tokens[i], 60, 32);
    var flow = decodeBase(tokens[i + 1], 36, 92);
    links[index] = flow;
  }
  return links;
}

function decodeBase(str, b, shift) {
  var x = 0;
  var p = 1;
  for (var i = str.length; i--; ) {
    x += (str.charCodeAt(i) - shift) * p;
    p *= b;
  }
  return x;
}

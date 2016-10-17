var FLUSH_LIMIT = 5000;

onmessage = function(e) {
  var segments;
  var result = [];
  var count = 0;
  var loopLength = 3600;
  var trailLength = 180;

  if (e.data) {
    var lines = e.data.split('\n');

    lines.forEach(function(l, i) {
      if (!l) {
        return;
      }
      if (i === 0) {
        segments = decodeSegments(l);
      } else {
        var trip = decodeTrip(l, segments);
        result.push(trip);
        count++;

        while (trip.endTime > loopLength - trailLength) {
          trip = shiftTrip(trip, -loopLength);
          result.push(trip);
          count++;
        }

        if (result.length >= FLUSH_LIMIT && result.length === count) {
          postMessage({action: 'add', data: result});
          result = [];
        }
      }
    });

    postMessage({action: 'add', data: result});
    postMessage({action: 'end'});
  }
};

function shiftTrip(trip, offset) {
  return {
    startTime: trip.startTime + offset,
    endTime: trip.endTime + offset,
    segments: trip.segments.map(function(p) {
      return [p[0], p[1], p[2] + offset];
    })
  };
}

function decodeTrip(str, segments) {
  var startTime = decodeBase(str.slice(0, 2), 90, 32);
  var endTime = decodeBase(str.slice(2, 4), 90, 32);
  var indices = str.slice(4).match(/([\x20-\x4c][\x4d-\xff]*)/g);
  var segs = indices.map(function(i) {
    var head = String.fromCharCode(i.charCodeAt(0) + 45);
    var index = decodeBase(head + i.slice(1), 45, 77);
    return segments[index];
  });
  var projectedTimes = segs.reduce(function(acc, seg, i) {
    var t = 0;
    if (i > 0) {
      t = acc[i - 1] + seg[seg.length - 1][2];
    }
    return acc.concat(t);
  }, []);
  var rT = (endTime - startTime) / projectedTimes[projectedTimes.length - 1];

  return {
    startTime: startTime,
    endTime: endTime,
    segments: segs.reduce(function(acc, seg, i) {
      var t0 = projectedTimes[i];
      return acc.concat(seg.map(function(s) {
        return [s[0], s[1], (s[2] + t0) * rT + startTime];
      }));
    }, [])
  };
}

function decodeSegments(str) {
  var tokens = str.split(/([\x3e-\xff]+)/);
  var result = [];
  for (var i = 0; i < tokens.length - 1; i += 2) {
    var T = decodeBase(tokens[i], 30, 32);
    var coords = decodePolyline(tokens[i + 1]);

    var distances = coords.reduce(function(acc, c, j) {
      var d = 0;
      if (j > 0) {
        d = acc[j - 1] + distance(coords[j], coords[j - 1]);
      }
      return acc.concat(d);
    }, []);
    var D = distances[distances.length - 1];

    result[i / 2] = coords.map(function(c, j) {
      return [c[0], c[1], distances[j] / D * T];
    });
  }
  return result;
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

/**
 * https://github.com/mapbox/polyline
 *
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
function decodePolyline(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lng / factor, lat / factor]);
    }

    return coordinates;
};

/*
* adapted from turf-distance http://turfjs.org
*/
function distance(from, to) {
  var degrees2radians = Math.PI / 180;
  var dLat = degrees2radians * (to[1] - from[1]);
  var dLon = degrees2radians * (to[0] - from[0]);
  var lat1 = degrees2radians * from[1];
  var lat2 = degrees2radians * to[1];

  var a = Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  return Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

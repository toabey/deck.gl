importScripts('http://d3js.org/topojson.v1.min.js');

onmessage = function(e) {
  if (e.data) {
    var data = JSON.parse(e.data);
    var choropleths = topojson.feature(data, data.objects.flows);
    var features = choropleths.features;

    features.forEach(function(f, i) {
      f.properties.flows = decodeLinks(f.properties.flows);
    });
    features.forEach(function(f, i) {
      var flows = f.properties.flows;
      for (var toId in flows) {
        features[toId].properties.flows[i] = -flows[toId];
      }
    });
    features.forEach(function(f, i) {
      var flows = f.properties.flows;
      var netFlow = 0;
      for (var toId in flows) {
        netFlow += flows[toId];
      }
      f.properties.netFlow = netFlow;
    });

    postMessage({action: 'add', data: [choropleths]});
    postMessage({action: 'end'});
  }
};

function decodeLinks(str) {
  var links = {};
  var tokens = str.split(/([\x28-\x5b]+)/);
  for (var i = 0; i < tokens.length - 1; i += 2) {
    var index = decodeBase(tokens[i], 32, 93);
    var flow = decodeBase(tokens[i + 1], 52, 40);
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

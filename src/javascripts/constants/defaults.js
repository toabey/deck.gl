export const MAPBOX_STYLES = 'mapbox://styles/mapbox/light-v9';

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidWJlcnZpc3B1YmxpYyIsImEiOiJjaXRrY3QxNnMwYWk4MnRtazYwODAxMXp5In0.tfzIQkC6mKPR7meww3nquw';

export const DEFAULT_VIEWPORT_STATE = {
  width: 600,
  height: 600,
  latitude: 37.7749295,
  longitude: -122.4194155,
  zoom: 11,
  isDragging: false,
  startDragLngLat: null,
  startBearing: null,
  startPitch: null,
  bearing: 0,
  pitch: 0
};

export const DEFAULT_APP_STATE = {
  owner: null,
  data: null,
  params: {}
};

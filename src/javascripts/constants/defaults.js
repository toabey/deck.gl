export const MAPBOX_STYLES = 'mapbox://styles/mapbox/light-v9';

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidWJlcm1hcHNmb3J0aGV3ZWIiLCJhIjoiY2l0Z2N6OGRnMDBjbTJ0bWszM2c5amU3dCJ9.eP_60RE6PibMPHyzxrdmaw';

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

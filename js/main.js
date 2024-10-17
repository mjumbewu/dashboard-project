import { downloadStationData } from './station_data.js';
import { initMap } from './station_map.js';

// Create an event bus to allow components to communicate with each other.
// Custom events on the event bus include:
// - stationsloaded: Fired when the station data is done downloading.
//     Detail is an array of GeoJSON features representing stations.
// - positionfound: Fired when the user's location is found.
//     Detail is a GeolocationPosition object.
const events = new EventTarget();

// Download stations data and fire a stationsloaded event to notify other
// components that the data is ready. This is effectively equivalent to
// saying:
//
//   const stations = await downloadStationData();
//   const evt = new CustomEvent('stationsloaded', { detail: stations });
//   events.dispatchEvent(evt);
//
// The difference is that the code below won't hold up the rest of the
// code in this module from running while the data is downloading.
downloadStationData().then((stations) => {
  const evt = new CustomEvent('stationsloaded', { detail: stations });
  events.dispatchEvent(evt);
});

// Initialize the map and list components.
const mapEl = document.querySelector('.map');
initMap(mapEl, events);

// const listEl = document.querySelector('.stations-list');
// initList(listEl, events);

function handlePositionSuccess(pos) {
  console.log('Successfully got position!', pos);
  const evt = new CustomEvent('positionfound', { detail: pos });
  events.dispatchEvent(evt);
}
function handlePositionError(err) {
  console.error('Failed to get position!', err);
}
navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, {enableHighAccuracy: true});

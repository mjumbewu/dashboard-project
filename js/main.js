import { downloadStationData, updateStationStatuses } from './station_data.js';
import { startGeolocation } from './geolocation.js';
import { initMap } from './station_map.js';
import { initList } from './station_list.js';
import { initAddressSearch } from './address_search.js';
import { initBikeSearchFilters } from './bike_search_filters.js';
import { initLocationBar } from './location_bar.js';

// Create an event bus to allow components to communicate with each other.
// Custom events on the event bus include:
//
// - stationsloaded: Fired when the station data is done downloading.
//     Detail is an array of GeoJSON features representing stations.
//
// - statusesupdated: Fired when the station statuses are updated.
//     Detail is an object of station statuses. Keys are station IDs and
//     values are objects from https://gbfs.bcycle.com/bcycle_indego/station_status.json.
//
// - positionfound: Fired when the user's location is found.
//     Detail is a GeolocationPosition object.
//     (See geolocation.js)
//
// - updatecenter: Fired when the map centerpoint is updated.
//     Detail is an array of [longitude, latitude].
//     (See station_map.js)
//
// - autocompleteselected: Fired when the user selects an autocompleted
//   address option.
//     Detail is a GeoJSON feature representing the selected address,
//     with a name and address property.
//     (See address_search.js)
//
// - manualadjust: Fired when the map center changes because of some user
//   interaction.
//     Detail is an array of [longitude, latitude].
//     (See station_map.js)
//     (See address_search.js)
//
// - bikefilterchange: Fired when the bike search filters change.
//     Detail is an object with the following properties:
//       - electric: Whether electric bikes are allowed.
//       - classic: Whether classic bikes are allowed.
//       - minBattery: Minimum battery level for electric bikes.
//     (See bike_search_filters.js)
//
// - stationselected: Fired when a station is selected in the list or on the map.
//     Detail is a GeoJSON feature representing the selected station.
//     (See station_list.js)
//
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

  // Update the station statuses every 30 seconds.
  setInterval(async () => {
    const [, statuses] = await updateStationStatuses(stations);
    const evt = new CustomEvent('statusesupdated', { detail: statuses });
    events.dispatchEvent(evt);
  }, 30000);
});

const mapboxKey = 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA';

// Initialize the map and list components.
const mapEl = document.querySelector('.map');
initMap(mapEl, events, mapboxKey);

const listEl = document.querySelector('.stations-list');
initList(listEl, events);

// Initialize the address search component.
const searchEl = document.querySelector('[name="address-search"]');
initAddressSearch(searchEl, events, mapboxKey);

// Initialize the bike filters component.
const filtersEl = document.querySelector('.bike-search-controls');
initBikeSearchFilters(filtersEl, events);

// Start watching the user's location.
startGeolocation(events);

// Initialize the location bar.
initLocationBar(events);

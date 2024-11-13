import * as turf from 'https://esm.run/@turf/turf';

const STATION_ICON_SVG = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   version="1.1"
   viewBox="-5 -10 104.244 84.565002"
   id="svg182"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs186">
    <mask
       maskUnits="userSpaceOnUse"
       id="mask1132">
      <path
         id="path1134"
         style="display:inline;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:2.75528;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1"
         d="m 18.495675,-7.6222072 h 57.252659 c 11.699491,0 21.118206,9.4187242 21.118206,21.1182162 v 23.364292 c 0,11.699491 -9.418715,21.118215 -21.118206,21.118215 H 61.43517 L 47.122005,72.187266 32.80884,57.978516 H 18.495675 c -11.699491,0 -21.1182155,-9.418724 -21.1182155,-21.118215 V 13.496009 c 0,-11.699492 9.4187245,-21.1182162 21.1182155,-21.1182162 z" />
    </mask>
  </defs>
  <g
     id="g1154"
     style="display:inline">
    <path
       id="path1146"
       style="display:inline;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:2.75528;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1"
       d="m 18.495672,-7.6222071 h 57.252659 c 11.699491,0 21.118215,9.418724 21.118215,21.1182161 v 23.364292 c 0,11.699491 -9.418724,21.118215 -21.118215,21.118215 H 61.435167 L 47.122002,72.187266 32.808837,57.978516 H 18.495672 c -11.6994907,0 -21.1182149,-9.418724 -21.1182149,-21.118215 V 13.496009 c 0,-11.6994921 9.4187242,-21.1182161 21.1182149,-21.1182161 z" />
    <rect
       style="display:inline;fill:#000000;fill-opacity:1;stroke:none;stroke-width:9.99999;stroke-linecap:round;stroke-linejoin:round"
       id="stationCapacity"
       width="105.185"
       height="50.248684"
       x="-5.5627813"
       y="24.461281"
       mask="url(#mask1132)" />
    <path
       id="path1150"
       style="fill:none;stroke:#000000;stroke-width:2.75528;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1"
       d="m 18.495672,-7.6222071 h 57.252659 c 11.699491,0 21.118215,9.418724 21.118215,21.1182161 v 23.364292 c 0,11.699491 -9.418724,21.118215 -21.118215,21.118215 H 61.435167 L 47.122002,72.187266 32.808837,57.978516 H 18.495672 c -11.6994907,0 -21.1182149,-9.418724 -21.1182149,-21.118215 V 13.496009 c 0,-11.6994921 9.4187242,-21.1182161 21.1182149,-21.1182161 z" />
    <path
       d="m 73.675864,18.943795 c -2.6406,0 -5.1406,0.67188 -7.3125,1.8281 l -6.375,-9.5781 2.6406,-5.5469001 h 2.4688 c 0.85938,0 1.5625,-0.70312 1.5625,-1.5625 0,-0.85938 -0.70312,-1.5625 -1.5625,-1.5625 h -7.8125 c -0.85938,0 -1.5625,0.70312 -1.5625,1.5625 0,0.85938 0.70312,1.5625 1.5625,1.5625 h 1.8906 l -1.8594,3.9062 h -23.109 l 2.9688,-6.25 h 5.2656 c 0.85938,0 1.5625,-0.70312 1.5625,-1.5625 0,-0.85938 -0.70312,-1.5625 -1.5625,-1.5625 h -6.25 c -0.60938,0 -1.1562,0.34375 -1.4062,0.89062 l -8.9531,18.7970001 c -1.6406,-0.59375 -3.4219,-0.9375 -5.2656,-0.9375 -8.6094,0 -15.6249994,7.0156 -15.6249994,15.625 0,8.6094 7.0155994,15.625 15.6249994,15.625 8.6094,0 15.625,-7.0156 15.625,-15.625 0,-5.6562 -3.0312,-10.609 -7.5469,-13.344 l 3.2031,-6.7344 13.969,20.938 c 0,0 0.0625,0.07813 0.09375,0.10938 0.03125,0.03125 0.04687,0.0625 0.07813,0.09375 0.125,0.125 0.26562,0.25 0.4375,0.32812 l 0.01563,0.01563 h 0.04687 c 0.1875,0.07813 0.40625,0.14062 0.625,0.14062 h 11.016 c 0.78125,7.8906 7.4531,14.062 15.547,14.062 8.6094,0 15.625,-7.0156 15.625,-15.625 0,-8.6094 -7.0156,-15.625 -15.625,-15.625 z m -40.625,15.625 c 0,6.8906 -5.6094,12.5 -12.5,12.5 -6.8906,0 -12.4999994,-5.6094 -12.4999994,-12.5 0,-6.8906 5.6093994,-12.5 12.4999994,-12.5 1.375,0 2.6875,0.23438 3.9219,0.64062 l -5.3281,11.188 c -0.375,0.78125 -0.04687,1.7188 0.73438,2.0781 0.21875,0.10938 0.4375,0.15625 0.67188,0.15625 0.57812,0 1.1406,-0.32812 1.4062,-0.89062 l 5.3281,-11.188 c 3.4531,2.2188 5.7656,6.1094 5.7656,10.516 z m 30.703,-12.062 c -3.1094,2.5625 -5.2031,6.2812 -5.625,10.5 h -8.5469 l 8.8281,-18.516 z m 1.75,2.625 5.25,7.875 h -9.4688 c 0.39062,-3.1406 1.9531,-5.9062 4.2188,-7.875 z m -9.7031,-12.438 -8.9219,18.719 -12.484,-18.719 z m 17.875,34.375 c -6.3594,0 -11.625,-4.7812 -12.391,-10.938 h 12.391 c 0.57812,0 1.1094,-0.3125 1.375,-0.82812 0.2656,-0.51562 0.23438,-1.125 -0.07813,-1.6094 l -6.875,-10.312 c 1.6875,-0.84375 3.5625,-1.3281 5.5781,-1.3281 6.8906,0 12.5,5.6094 12.5,12.5 0,6.8906 -5.6094,12.5 -12.5,12.5 z"
       id="path1152"
       style="mix-blend-mode:difference;fill:#ffffff;fill-opacity:1" />
  </g>
</svg>
`;

function initMap(el, events, mapboxKey) {
  const map = L.map(el, { maxZoom: 18, zoomSnap: 0 }).setView([39.95, -75.16], 12);

  const mapboxStyle = 'mapbox/streets-v12';

  L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/512/{z}/{x}/{y}{r}?access_token=${mapboxKey}`, {
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const stationsLayer = L.layerGroup();
  stationsLayer.addTo(map);

  // Create an animated icon for the geolocation marker.
  // Pulsating circle adapted from https://codepen.io/shaneparsons/pen/MpgEma
  const geolocationIconHtml = `
    <svg width="20" height="20" viewbox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle class="pulsing-circle" cx="20" cy="20" r="10" fill="none">
        <animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
      </circle>
      <circle class="inner-circle" cx="20" cy="20" r="10"/>
    </svg>
  `;
  const geolocationIcon = L.divIcon({
    className: 'geolocation-icon',
    html: geolocationIconHtml,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
  const geolocationMarker = L.marker([0, 0], { icon: geolocationIcon });

  // Create an icon for the station markers.
  const stationIcon = L.divIcon({
    className: 'station-icon',
    html: STATION_ICON_SVG,
    iconSize: [50, 43],
    iconAnchor: [25, 43],
  });

  let showClassicBikes = true;
  let showElectricBikes = true;
  let minBatteryLevel = 0;

  /**
   * Update the station markers to reflect the current station statuses.
   * This function is called every time the statusesupdated event is fired.
   */
  function updateStationMarkers() {
    stationsLayer.eachLayer((marker) => {
      const station = marker.feature;
      const status = station.properties.status;
      const bikes =
        (showClassicBikes ? status.num_bikes_available_types['classic'] : 0) +
        (showElectricBikes ? status.bikes.filter((b) => b.isElectric && (minBatteryLevel == 0 || b.battery >= minBatteryLevel)).length : 0);
      const docks = status.reported_docks_available;

      // Calculate the total capacity of the station as the sum of the number
      // of bikes and the number of docks available. Convert the values to
      // decimal numbers instead of integers by multiplying by 1.0.
      const capacity = 1.0 * bikes + docks;

      // Update the position and height of the rect with id stationCapacity.
      const rect = marker.getElement().querySelector('#stationCapacity');
      const svg = marker.getElement().querySelector('svg');
      const padding = 3;
      const svgTop = svg.viewBox.baseVal.y;
      const svgHeight = svg.viewBox.baseVal.height - padding * 2;
      const newRectHeight = capacity > 0 ? (bikes / capacity) * svgHeight : 0;
      const newRectY = svgTop + svgHeight - newRectHeight + padding;
      rect.setAttribute('height', newRectHeight);
      rect.setAttribute('y', newRectY);
    });
  }

  /**
   * Update the distance property of each station to reflect the distance from
   * the current map centerpoint. This function is called every time the map
   * moves.
   */
  function updateMapCenterpoint() {
    const center = map.getCenter();

    stationsLayer.eachLayer((marker) => {
      const station = marker.feature;
      const distance = turf.distance([center.lng, center.lat], station.geometry, { units: 'miles' });
      station.properties.distance = distance;
    });

    const evt = new CustomEvent('updatecenter', { detail: [center.lng, center.lat] });
    events.dispatchEvent(evt);
  }

  // Listen for the stationsloaded event, which is fired when the station data
  // is done downloading.
  events.addEventListener('stationsloaded', (evt) => {
    const stations = evt.detail;
    for (const station of stations) {
      // Flip around the coordinates to be [lat, lng].
      const latlng = [station.geometry.coordinates[1], station.geometry.coordinates[0]];
      // Create a marker for the station and add it to the stations layer.
      const marker = L.marker(latlng, { icon: stationIcon });
      marker.feature = station;
      marker.bindTooltip(station.properties.name);
      marker.addTo(stationsLayer);
    }

    updateStationMarkers();
  });

  // Listen for the statusesupdated event, which is fired when the station
  // statuses are updated.
  events.addEventListener('statusesupdated', (evt) => {
    updateStationMarkers();
  });

  // Listen for the positionfound event, which is fired when the user's
  // location is found.
  events.addEventListener('positionfound', (evt) => {
    const pos = evt.detail;
    geolocationMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
    geolocationMarker.addTo(map);
    map.setView([pos.coords.latitude, pos.coords.longitude], 16);
  });

  // Listen for when the map moves and update the centerpoint
  map.on('moveend', (evt) => {
    updateMapCenterpoint();
  });

  // Listen for when the user manually moves the map center by dragging or
  // zooming and let off a manual center event.
  map.on('dragend', () => {
    const center = map.getCenter();
    const evt = new CustomEvent('manualadjust', { detail: [center.lng, center.lat] });
    console.log('manualcenter event fired');
    events.dispatchEvent(evt);
  });


  // Listen for when an autocompleted address option is selected and update the
  // map centerpoint.
  events.addEventListener('autocompleteselected', (evt) => {
    const feature = evt.detail;
    const [lng, lat] = feature.geometry.coordinates;
    map.setView([lat, lng], 16);
  });

  // Listen for when the bikes the user wants to see changes and update the
  // station markers.
  events.addEventListener('bikefilterchange', (evt) => {
    showClassicBikes = evt.detail.classic;
    showElectricBikes = evt.detail.electric;
    minBatteryLevel = evt.detail.minBattery;
    updateStationMarkers();
  });
}

export { initMap };

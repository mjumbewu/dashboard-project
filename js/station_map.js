function initMap(el, events) {
  const map = L.map(el, { maxZoom: 18, zoomSnap: 0 }).setView([39.95, -75.16], 12);

  const mapboxKey = 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA';
  const mapboxStyle = 'mapbox/streets-v12';

  L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/512/{z}/{x}/{y}{r}?access_token=${mapboxKey}`, {
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const dataLayer = L.layerGroup();
  dataLayer.addTo(map);

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

  // Listen for the stationsloaded event, which is fired when the station data
  // is done downloading.
  events.addEventListener('stationsloaded', (evt) => {
    const stations = evt.detail;
    const layer = L.geoJSON(stations);
    layer.addTo(dataLayer);
  });

  // Listen for the positionfound event, which is fired when the user's
  // location is found.
  events.addEventListener('positionfound', (evt) => {
    const pos = evt.detail;
    geolocationMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
    geolocationMarker.addTo(map);
    map.setView([pos.coords.latitude, pos.coords.longitude], 16);
  });
}

export { initMap };

function initMap(el, events) {
  const map = L.map(el, { maxZoom: 18, zoomSnap: 0 }).setView([39.95, -75.16], 12);

  const mapboxKey = 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA';
  const mapboxStyle = 'mapbox/streets-v12';

  L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/512/{z}/{x}/{y}{r}?access_token=${mapboxKey}`, {
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const dataLayer = L.layerGroup();
  dataLayer.addTo(map);

  const positionMarker = L.circleMarker([0, 0], { radius: 5 });

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
    positionMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
    positionMarker.addTo(map);
    map.setView([pos.coords.latitude, pos.coords.longitude], 16);
  });
}

export { initMap };

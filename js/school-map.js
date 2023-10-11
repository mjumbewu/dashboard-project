let dataLayer = null;

function initializeMap(schools) {
  const map = L.map('map').setView([39.96, -75.15], 11);
  const baseTileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mjumbe-test/clmgifvwj03ps01qr02uk6kr2/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2wwb3BudmZ3MWdyMjNkbzM1c2NrMGQwbSJ9.2ATDPobUwpa7Ou5jsJOGYA');
  baseTileLayer.addTo(map);

  dataLayer = L.layerGroup();
  dataLayer.addTo(map);

  addSchoolsToMap(schools);

  return map;
}

function addSchoolsToMap(schools) {
  for (const school of schools) {
    const [lon, lat] = school.geom.coordinates;
    const name = school.name;

    const marker = L.circleMarker([lat, lon], {
      radius: 3,
      title: name,
      alt: name,
    });
    dataLayer.addLayer(marker);
  }
}

export {
  initializeMap,
};

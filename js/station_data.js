async function downloadStationData() {
  function gbfsStationToFeature(station) {
    return {
      type: 'Feature',
      properties: station,
      geometry: {
        type: 'Point',
        coordinates: [station.lon, station.lat],
      },
    };
  }

  const gbfsStationsResponse = await fetch(
    'https://gbfs.bcycle.com/bcycle_indego/station_information.json'
  );
  const gbfsStationsData = await gbfsStationsResponse.json();
  const gbfsStations = gbfsStationsData.data.stations;
  const stations = gbfsStations.map(gbfsStationToFeature);

  await updateStationStatuses(stations);
  return stations;
}

async function downloadStationStatuses() {
  const gbfsStatusResponse = await fetch(
    'https://gbfs.bcycle.com/bcycle_indego/station_status.json'
  );
  const gbfsStatusData = await gbfsStatusResponse.json();
  const gbfsStatuses = gbfsStatusData.data.stations;

  const statuses = {};
  for (const status of gbfsStatuses) {
    statuses[status.station_id] = status;
  }

  return statuses;
}

async function downloadStationBikes() {
  const geojsonStatusResponse = await fetch(
    'https://bts-status.bicycletransit.workers.dev/phl',
  );
  const geojsonStatusData = await geojsonStatusResponse.json();
  const geojsonStatuses = geojsonStatusData.features;

  const bikes = {};
  for (const status of geojsonStatuses) {
    bikes[`bcycle_indego_${status.properties.id}`] = status.properties.bikes;
  }

  return bikes;
}

async function updateStationStatuses(stations) {
  const statuses = await downloadStationStatuses();
  const bikes = await downloadStationBikes();

  for (const [stationId, status] of Object.entries(statuses)) {
    const stationBikes = bikes[stationId];
    status.bikes = stationBikes;
  }

  for (const station of stations) {
    const stationStatus = statuses[station.properties.station_id];
    station.properties.status = stationStatus;
  }

  return [stations, statuses];
}

export { downloadStationData, downloadStationStatuses, updateStationStatuses };

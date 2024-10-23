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

async function updateStationStatuses(stations) {
  const statuses = await downloadStationStatuses();
  for (const station of stations) {
    const status = statuses[station.properties.station_id];
    station.properties.status = status;
  }

  return [stations, statuses];
}

export { downloadStationData, downloadStationStatuses, updateStationStatuses };

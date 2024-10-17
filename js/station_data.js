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

  return stations;
}

export { downloadStationData };

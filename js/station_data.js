import { getStationReports, addStationReport } from './firebase.js';
import _debounce from 'https://esm.run/lodash/debounce';

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
  const reports = await getStationReports();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Attach the reports to the station statuses.
  reports.forEach((report) => {
    const stationId = report.data().station_id;
    const status = statuses[stationId];
    status.reports ||= [];

    // TODO: This filtering should be done when we query
    // for the reports in Firestore. To filter it here,
    // we're downloading ALL the reports every time. Over
    // time, that could become a lot of data to download.
    if (report.data().timestamp.toDate() > oneHourAgo) {
      status.reports.push(report.data());
    }

    console.log(status);
  });

  // Attach the detailed bike information to the station statuses.
  for (const [stationId, status] of Object.entries(statuses)) {
    const stationBikes = bikes[stationId];
    status.bikes = stationBikes;
  }

  // Attach the statuses to the station features.
  for (const station of stations) {
    const stationStatus = statuses[station.properties.station_id];
    station.properties.status = stationStatus;

    // Add a calculated docks available based on the reported deltas.
    stationStatus.reported_docks_available = stationStatus.num_docks_available;
    for (const report of (stationStatus.reports || [])) {
      console.log(`Adjusting docks for ${station.properties.name} by ${report.delta}`);
      stationStatus.reported_docks_available += report.delta;
    }
  }

  return [stations, statuses];
}

let deltasToSend = {};
function createStationReport(stationId, delta) {
  if (deltasToSend[stationId] === undefined) {
    deltasToSend[stationId] = 0;
  }

  deltasToSend[stationId] += delta;

  if (deltasToSend[stationId] === 0) {
    delete deltasToSend[stationId];
  }

  sendStationDeltas();
}

const sendStationDeltas = _debounce(async () => {
  for (const [stationId, delta] of Object.entries(deltasToSend)) {
    console.log(`Sending delta for station ${stationId}: ${delta}`);
    await addStationReport(stationId, delta);
  }
  deltasToSend = {};
}, 2000);

export { downloadStationData, downloadStationStatuses, updateStationStatuses, createStationReport };

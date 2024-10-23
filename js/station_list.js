import { htmlToElement } from './dom_utils.js';

function initList(el, events) {
  el.innerHTML = '';
  let showClassicBikes = true;
  let showElectricBikes = true;
  let minBatteryLevel = 0;

  const stationListItems = {};
  events.addEventListener('stationsloaded', (evt) => {
    const stations = evt.detail;
    for (const station of stations) {
      const listItem = htmlToElement(`
        <li class="station" aria-expanded="false">
          <header class="name">${station.properties.name}</header>
          <span class="distance" title="Station distance from map center">${station.properties.distance || '&hellip;'}</span>
          <span class="available-bikes" title="Number of suitable bikes available at the station">${station.properties.status.num_bikes_available} bikes</span>
          <span class="available-docks" title="Number of open docks available at the station">${station.properties.status.num_docks_available} docks</span>
          <!--
          <span class="next-drop-off-est" title="Approximate time between drop offs of suitable bikes">(~10 min)</span>
          <span class="next-pick-up-est" title="Approximate time between docks opening up">(~15 min)</span>
          -->
        </li>
      `);
      stationListItems[station.properties.station_id] = {listItem, station};
      el.appendChild(listItem);
    }
    updateStationStatusInfo();
  });

  function sortListItemsByDistance() {
    el.innerHTML = '';
    const items = Object.values(stationListItems);
    items.sort((a, b) => {
      const aDistance = a.station.properties.distance || Infinity;
      const bDistance = b.station.properties.distance || Infinity;
      return aDistance - bDistance;
    });
    for (const {station, listItem} of items) {
      el.appendChild(listItem);
      listItem.querySelector('.distance').textContent = `${station.properties.distance.toFixed(2)} mi`;
    }
  }

  function updateStationStatusInfo() {
    for (const {listItem, station} of Object.values(stationListItems)) {
      const bikes =
        (showClassicBikes ? station.properties.status.num_bikes_available_types['classic'] : 0) +
        (showElectricBikes ? station.properties.status.bikes.filter((b) => b.isElectric && (minBatteryLevel == 0 || b.battery >= minBatteryLevel)).length : 0);
      listItem.querySelector('.available-bikes').textContent = `${bikes} bike${bikes !== 1 ? 's' : ''}`;

      const docks = station.properties.status.num_docks_available;
      listItem.querySelector('.available-docks').textContent = `${docks} dock${docks !== 1 ? 's' : ''}`;
    }
  }

  events.addEventListener('statusesupdated', (evt) => {
    updateStationStatusInfo();
  });

  events.addEventListener('updatecenter', (evt) => {
    sortListItemsByDistance();
  });

  events.addEventListener('bikefilterchange', (evt) => {
    showClassicBikes = evt.detail.classic;
    showElectricBikes = evt.detail.electric;
    minBatteryLevel = evt.detail.minBattery;
    updateStationStatusInfo();
  });
}

export { initList };

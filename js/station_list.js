import { htmlToElement } from './dom_utils.js';
import { createStationReport } from './station_data.js';

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
        <li class="station" aria-expanded="false" id="station_list_item_${station.properties.station_id}">
          <header class="name">${station.properties.name}</header>
          <span class="distance" title="Station distance from map center">${station.properties.distance || '&hellip;'}</span>
          <span class="available-bikes" title="Number of suitable bikes available at the station">${station.properties.status.num_bikes_available} bikes</span>
          <span class="available-docks" title="Number of open docks available at the station">${station.properties.status.reported_docks_available} docks</span>
          <!--
          <span class="next-drop-off-est" title="Approximate time between drop offs of suitable bikes">(~10 min)</span>
          <span class="next-pick-up-est" title="Approximate time between docks opening up">(~15 min)</span>
          -->

          <div class="details">
            <div class="report-dock-count">
              <p>Are we showing the wrong number of docks available? Adjust the number so that other riders know:</p>
              <button class="report-dock-count-button increment" title="Add 1 to the number of docks available">+</button>
              <button class="report-dock-count-button decrement" title="Subtract 1 from the number of docks available">-</button>
            </div>
          </div>
        </li>
      `);
      stationListItems[station.properties.station_id] = {listItem, station};

      listItem.addEventListener('click', () => {
        if (listItem.classList.contains('selected')) {
          events.dispatchEvent(new CustomEvent('stationdeselected', { detail: station }));
        } else {
          events.dispatchEvent(new CustomEvent('stationselected', { detail: station }));
        }
      });

      const incrementButton = listItem.querySelector('.report-dock-count-button.increment');
      incrementButton.addEventListener('click', (evt) => {
        evt.stopPropagation(); // Do not emit a click for the list item.
        createStationReport(station.properties.station_id, 1);
        events.dispatchEvent(new CustomEvent('dockcountincrement', { detail: station }));
      });

      const decrementButton = listItem.querySelector('.report-dock-count-button.decrement');
      decrementButton.addEventListener('click', (evt) => {
        evt.stopPropagation(); // Do not emit a click for the list item.
        createStationReport(station.properties.station_id, -1);
        events.dispatchEvent(new CustomEvent('dockcountdecrement', { detail: station }));
      });

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

      const docks = station.properties.status.reported_docks_available;
      listItem.querySelector('.available-docks').textContent = `${docks} dock${docks !== 1 ? 's' : ''}`;
    }
  }

  function deselectListItem(stationId) {
    stationListItems[stationId].listItem.classList.remove('selected');
    stationListItems[stationId].listItem.setAttribute('aria-expanded', 'false');
  }

  function deselectAllListItems() {
    for (const {listItem} of Object.values(stationListItems)) {
      listItem.classList.remove('selected');
      listItem.setAttribute('aria-expanded', 'false');
    }
  }

  function selectListItem(stationId) {
    stationListItems[stationId].listItem.classList.add('selected');
    stationListItems[stationId].listItem.setAttribute('aria-expanded', 'true');
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

  events.addEventListener('stationselected', (evt) => {
    const stationId = evt.detail.properties.station_id;
    deselectAllListItems();
    selectListItem(stationId);
  });

  events.addEventListener('stationdeselected', (evt) => {
    const stationId = evt.detail.properties.station_id;
    deselectListItem(stationId);
  });

  events.addEventListener('dockcountincrement', (evt) => {
    const station = evt.detail;
    station.properties.status.reported_docks_available += 1;
    updateStationStatusInfo();
  });

  events.addEventListener('dockcountdecrement', (evt) => {
    const station = evt.detail;
    station.properties.status.reported_docks_available -= 1;
    updateStationStatusInfo();
  });
}

export { initList };

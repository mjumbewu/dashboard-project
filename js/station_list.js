import { createStationReport } from './station_data.js';
import { htmlToElement } from './dom_utils.js';

function initList(el, events) {
  el.innerHTML = '';
  let showClassicBikes = true;
  let showElectricBikes = true;
  let minBatteryLevel = 0;
  let favoritedStations = new Set();

  const stationListItems = {};
  events.addEventListener('stationsloaded', (evt) => {
    const stations = evt.detail;
    for (const station of stations) {
      const isFavorited = favoritedStations.has(station.properties.station_id);
      const listItem = htmlToElement(`
        <li class="station" data-favorite="${isFavorited}">
          <details>
            <summary>
              <header class="name">
                <span class="station-name">${station.properties.name}</span>
                <button class="favorite-toggle" aria-label="${isFavorited ? 'Remove this station from favorites' : 'Add this station to favorites'}"></button>
              </header>
              <span class="distance" title="Station distance from map center">
                <span class="visually-hidden">${station.properties.distance || 'Unknown distance'} from map center</span>
                <span aria-hidden="true">${station.properties.distance || '&hellip;'}</span>
              </span>
              <span class="available-bikes" title="Number of suitable bikes available at the station">${station.properties.status.num_bikes_available} bikes</span>
              <span class="available-docks" title="Number of open docks available at the station">${station.properties.status.num_docks_available} docks</span>
            </summary>

            <div class="report-dock-count">
              <p>Are we showing the wrong number of docks available? Adjust the number so that other riders know:</p>
              <button class="report-dock-count-button increment" title="Add 1 to the number of docks available">+</button>
              <button class="report-dock-count-button decrement" title="Subtract 1 from the number of docks available">-</button>
            </div>

            <!--
            <span class="next-drop-off-est" title="Approximate time between drop offs of suitable bikes">(~10 min)</span>
            <span class="next-pick-up-est" title="Approximate time between docks opening up">(~15 min)</span>
            -->
          </details>
        </li>
      `);

      listItem.querySelector('.favorite-toggle').addEventListener('click', () => {
        const stationId = station.properties.station_id;

        let isFavorited = favoritedStations.has(stationId);
        if (isFavorited) {
          favoritedStations.delete(stationId);
        } else {
          favoritedStations.add(stationId);
        }
        isFavorited = !isFavorited;
        listItem.dataset.favorite = isFavorited;

        const favoriteBtn = listItem.querySelector('.favorite-toggle');
        favoriteBtn.setAttribute('aria-label', isFavorited ? 'Remove this station from favorites' : 'Add this station to favorites');

        localStorage.setItem('favorited_stations', JSON.stringify(Array.from(favoritedStations)));
        sortListItemsByDistance();
      });

      listItem.querySelector('.report-dock-count .increment').addEventListener('click', async (evt) => {
        const availableDocksDisplay = listItem.querySelector('.available-docks');
        createStationReport(station.properties.station_id, 'docks', 1);
        availableDocksDisplay.textContent = `${parseInt(availableDocksDisplay.textContent) + 1} docks`;
      });

      listItem.querySelector('.report-dock-count .decrement').addEventListener('click', async (evt) => {
        const availableDocksDisplay = listItem.querySelector('.available-docks');
        createStationReport(station.properties.station_id, 'docks', -1);
        availableDocksDisplay.textContent = `${parseInt(availableDocksDisplay.textContent) - 1} docks`;
      });

      stationListItems[station.properties.station_id] = {listItem, station};
      if (!isFavorited) {
        el.appendChild(listItem);
      } else {
        el.insertBefore(listItem, el.querySelector('.station[data-favorite="false"]'));
      }
    }
    updateStationStatusInfo();
  });

  function loadFavoritedStationsFromStorage() {
    const stored = localStorage.getItem('favorited_stations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          favoritedStations = new Set(parsed);
        }
      } catch (e) {
        console.error('Failed to load favorited stations from storage', e);
      }
    }
  }

  function sortListItemsByDistance() {
    el.innerHTML = '';
    const items = Object.values(stationListItems);
    items.sort((a, b) => {
      const aIsFavorited = favoritedStations.has(a.station.properties.station_id);
      const bIsFavorited = favoritedStations.has(b.station.properties.station_id);
      if (aIsFavorited && !bIsFavorited) return -1;
      if (!aIsFavorited && bIsFavorited) return 1;

      // If both are favorited or both are not favorited, sort by distance
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

  loadFavoritedStationsFromStorage();
}

export { initList };

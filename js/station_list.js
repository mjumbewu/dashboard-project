function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstElementChild;
}

function initList(el, events) {
  el.innerHTML = '';

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
      const bikes = station.properties.status.num_bikes_available;
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
}

export { initList };

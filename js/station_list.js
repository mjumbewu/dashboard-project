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
      stationListItems[station.properties.station_id] = listItem;
      initListItem(listItem, station, events);
      el.appendChild(listItem);
    }
  });

  function updateStationStatusInfo() {

  }

  events.addEventListener('statusesupdated', (evt) => {
    const statuses = evt.detail;
    for (const [stationId, status] of Object.entries(statuses)) {
      const listItem = stationListItems[stationId];
      if (!listItem) {
        continue;
      }

      listItem.querySelector('.available-bikes').textContent = `${status.num_bikes_available} bikes`;
      listItem.querySelector('.available-docks').textContent = `${status.num_docks_available} docks`;
    }
  });
}

function initListItem(el, station, events) {

}

export { initList };

function initLocationBar(events) {
  events.addEventListener('autocompleteselected', (evt) => {
    const feature = evt.detail;
    const address = feature.properties.address;
    const name = feature.properties.name;

    saveToHash('address', address);
    saveToHash('coords', feature.geometry.coordinates);
    saveToHash('name', name);
  });

  function saveToHash(key, value) {
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash);
    params.set(key, value);
    window.location.hash = params.toString();
  }

  function syncFromHash() {
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash);

    const address = params.get('address');
    const coords = params.get('coords');
    const name = params.get('name');

    if (address) {
      // Fire off an autocomplete event so that the map knows to adjust position.
      const autocompleteEvt = new CustomEvent('autocompleteselected', {
        detail: {
          type: 'Feature',
          geometry: { coordinates: coords.split(',').map(parseFloat) },
          properties: { name, address },
        },
      });
      events.dispatchEvent(autocompleteEvt);

      // Fire off a manual adjust event so that the geolocation watcher is cancelled.
      const manualAdjustEvt = new CustomEvent('manualadjust', {
        detail: coords.split(',').map(parseFloat),
      });
      events.dispatchEvent(manualAdjustEvt);
    }
  }
  syncFromHash();
}

export { initLocationBar };

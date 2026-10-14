function initAppState(events) {
  // Listen for the autocomplete selection event and update the URL
  events.addEventListener('autocompleteselected', (evt) => {
    const feature = evt.detail;
    const params = new URLSearchParams(location.search);
    params.set('address', feature.properties.address);
    params.set('coordinates', feature.geometry.coordinates.join(','));
    history.pushState({}, '', `${location.pathname}?${params}`);
  });

  // Listen for the bikefilterchange event and store the user preferences in localStorage
  events.addEventListener('bikefilterchange', (evt) => {
    const filters = evt.detail;
    localStorage.setItem('bike_filters', JSON.stringify(filters));
  });
}

export { initAppState };
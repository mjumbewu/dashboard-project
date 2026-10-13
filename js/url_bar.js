function initUrlBar(events) {
  // Listen for the autocomplete selection event and update the URL
  events.addEventListener('autocompleteselected', (evt) => {
    const feature = evt.detail;
    console.log(feature);
    const params = new URLSearchParams(location.search);
    params.set('address', feature.properties.address);
    params.set('coordinates', feature.geometry.coordinates.join(','));
    history.pushState({}, '', `${location.pathname}?${params}`);
  });
}

export { initUrlBar };
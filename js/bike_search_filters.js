function initBikeSearchFilters(el, events) {
  const bikeTypeSelect = el.querySelector('[name="bike-type"]');
  const batterySlider = el.querySelector('[name="min-battery-level"]');

  function isElectricBikesAllowed() {
    return bikeTypeSelect.value === 'electric' || bikeTypeSelect.value === 'all';
  }

  function isClassicBikesAllowed() {
    return bikeTypeSelect.value === 'classic' || bikeTypeSelect.value === 'all';
  }

  function minBatteryLevel() {
    return parseInt(batterySlider.value);
  }

  function bikeFilterDetails() {
    return {
      electric: isElectricBikesAllowed(),
      classic: isClassicBikesAllowed(),
      minBattery: minBatteryLevel(),
    };
  }

  function toggleBatterySlider(force) {
    if (force === undefined) {
      force = isElectricBikesAllowed();
    }
    batterySlider.disabled = !force;
  }

  function loadBikeFiltersFromStorage() {
    const storedBikeFilters = localStorage.getItem('bike_filters');
    if (storedBikeFilters) {
      const filters = JSON.parse(storedBikeFilters);

      if (filters.electric && filters.classic) {
        bikeTypeSelect.value = 'all';
      } else if (filters.electric) {
        bikeTypeSelect.value = 'electric';
      } else if (filters.classic) {
        bikeTypeSelect.value = 'classic';
      } else {  // If, somehow, neither electric nor classic is allowed, default to 'all'
        bikeTypeSelect.value = 'all';
      }

      if (filters.minBattery !== undefined && filters.minBattery !== null) {
        batterySlider.value = filters.minBattery;
      }

      events.dispatchEvent(new CustomEvent('bikefilterchange', { detail: filters }));
    }
  }

  bikeTypeSelect.addEventListener('change', (e) => {
    toggleBatterySlider();

    const evt = new CustomEvent('bikefilterchange', { detail: bikeFilterDetails() });
    events.dispatchEvent(evt);
  });

  batterySlider.addEventListener('input', (e) => {
    const evt = new CustomEvent('bikefilterchange', { detail: bikeFilterDetails() });
    events.dispatchEvent(evt);
  });

  loadBikeFiltersFromStorage();
  toggleBatterySlider();
}

export { initBikeSearchFilters };

function initBikeSearchFilters(el, events) {
  const bikeTypeSelect = el.querySelector('[name="bike-type"]');
  const batterySlider = el.querySelector('[name="min-battery-level"]');

  function syncFromLocalStorage() {
    const bikeType = localStorage.getItem('bikeType');
    if (bikeType) {
      bikeTypeSelect.value = bikeType;
    }

    const minBattery = localStorage.getItem('minBattery');
    if (minBattery) {
      batterySlider.value = parseInt(minBattery);
    }

    emitBikeFilterChange();
  }
  syncFromLocalStorage();

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

  function emitBikeFilterChange() {
    const evt = new CustomEvent('bikefilterchange', { detail: bikeFilterDetails() });
    events.dispatchEvent(evt);
  }

  bikeTypeSelect.addEventListener('change', (e) => {
    localStorage.setItem('bikeType', bikeTypeSelect.value);
    toggleBatterySlider();
    emitBikeFilterChange();
  });

  batterySlider.addEventListener('input', (e) => {
    localStorage.setItem('minBattery', batterySlider.value);
    emitBikeFilterChange();
  });

  toggleBatterySlider();
}

export { initBikeSearchFilters };

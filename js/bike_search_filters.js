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

  bikeTypeSelect.addEventListener('change', (e) => {
    toggleBatterySlider();

    const evt = new CustomEvent('bikefilterchange', { detail: bikeFilterDetails() });
    events.dispatchEvent(evt);
  });

  batterySlider.addEventListener('input', (e) => {
    const evt = new CustomEvent('bikefilterchange', { detail: bikeFilterDetails() });
    events.dispatchEvent(evt);
  });

  toggleBatterySlider();
}

export { initBikeSearchFilters };

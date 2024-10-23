function startGeolocation(events) {
  function handlePositionSuccess(pos) {
    const evt = new CustomEvent('positionfound', { detail: pos });
    events.dispatchEvent(evt);
  }

  function handlePositionError(err) {
    console.error('Failed to get position!', err);
  }

  const geolocationId = navigator.geolocation.watchPosition(handlePositionSuccess, handlePositionError, {enableHighAccuracy: true});
  return geolocationId;
}

export { startGeolocation };

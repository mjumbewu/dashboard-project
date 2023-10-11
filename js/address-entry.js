const addressEntry = document.querySelector('#address-entry');
const addressChoiceList = document.querySelector('#address-choices');

function initializeAddressEntry() {
  addressEntry.addEventListener('input', handleAddressEntryChange);
}

async function handleAddressEntryChange() {
  const partialAddress = addressEntry.value;
  const apiKey = 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA';
  const bbox = [-75.3002, 39.8544, -74.9995, 40.0649].join(',');
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${partialAddress}.json?` +
    `bbox=${bbox}&access_token=${apiKey}`;

  const resp = await fetch(url);
  const data = await resp.json();

  let html = '';
  for (const feature of data.features) {
    const lihtml = `
    <li data-lat="${feature.center[1]}" data-lon="${feature.center[0]}">
      ${feature.place_name}
    </li>
    `;
    html += lihtml;
  }
  addressChoiceList.innerHTML = html;

  const choices = addressChoiceList.querySelectorAll('li');
  for (const choice of choices) {
    choice.addEventListener(handleAddressChoice);
  }
  console.log(data);
}

function handleAddressChoice(evt) {

}

export {
  initializeAddressEntry,
};

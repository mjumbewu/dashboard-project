import { initializeMap } from "./school-map.js";
import { initializeList } from "./school-list.js";
import { initializeAddressEntry } from "./address-entry.js";

const schoolsResp = await fetch('data/schools.json');
const schools = await schoolsResp.json();

window.map = initializeMap(schools);
initializeList(schools);
initializeAddressEntry();

// The above code is basically the same as this code below,
// except prettier.
//
// const promise1 = fetch('data/schools.json');
// promise1.then((schoolsResp) => {
//   const promise2 = schoolsResp.json();
//   promise2.then((schools) => {
//     initializeMap(schools);
//     initializeList(schools);
//   });
// });

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js';
// See other SDKs for Firebase products that you want to use:
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDxI2mtCXFY8YsDEljkVtfTdjRpPt-ef_c',
  authDomain: 'bikeshare-dashboard.firebaseapp.com',
  projectId: 'bikeshare-dashboard',
  storageBucket: 'bikeshare-dashboard.firebasestorage.app',
  messagingSenderId: '74776108161',
  appId: '1:74776108161:web:4d21eb6abe2ff8e0eec180',
  measurementId: 'G-PXKWV5T4ZF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;

// The structure of each station report is:
// {
//   station_id: string,    // Starts with "bcycle_indego_"
//   timestamp: timestamp,  // When the report was made
//   type: string,          // "bikes" or "docks"
//   delta: number          // With respect to the GBFS
// }
async function getStationReports() {
  const reportsColl = collection(db, 'station_reports');
  const reports = await getDocs(reportsColl);
  return reports;
}

async function addStationReport(stationId, delta) {
  const reportsColl = collection(db, 'station_reports');
  await addDoc(reportsColl, {
    station_id: stationId,
    timestamp: new Date(),
    type: 'docks',
    delta,
  });
}

export { app, analytics, db, getStationReports, addStationReport };

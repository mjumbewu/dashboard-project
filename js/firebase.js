// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5VaD4MaYRrIyj93LlPqmnEOW7pRVNY5g",
  authDomain: "bikeshare-dashboard-8e7e3.firebaseapp.com",
  projectId: "bikeshare-dashboard-8e7e3",
  storageBucket: "bikeshare-dashboard-8e7e3.firebasestorage.app",
  messagingSenderId: "421212951560",
  appId: "1:421212951560:web:6fdf2b6437ea2f56c92dbd",
  measurementId: "G-HR30Z1JJEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

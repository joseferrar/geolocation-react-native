// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5R-ajr7JfuwD4KY_c7Yu3dYHTX3K6ZMg",
  authDomain: "userapp-d8c88.firebaseapp.com",
  databaseURL: "https://userapp-d8c88.firebaseio.com",
  projectId: "userapp-d8c88",
  storageBucket: "userapp-d8c88.appspot.com",
  messagingSenderId: "358934350170",
  appId: "1:358934350170:web:89977dd757df3970c08b63",
  measurementId: "G-BKRT9LNLWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
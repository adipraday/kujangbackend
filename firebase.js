// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKGHZijCJhjXdNOqLlDh-3p0fEIJh_OVk",
  authDomain: "kujangapi-de5a8.firebaseapp.com",
  projectId: "kujangapi-de5a8",
  storageBucket: "kujangapi-de5a8.appspot.com",
  messagingSenderId: "491688376898",
  appId: "1:491688376898:web:0fef21a482bbb53b758bdb",
  measurementId: "G-YNYMCHNDFL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

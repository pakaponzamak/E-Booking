// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
function startFireBase(){
const firebaseConfig = {
  apiKey: "AIzaSyDn7arKyKfVrFLxbe1KG8OJA6ySErHX180",
  authDomain: "web-database-40de1.firebaseapp.com",
  databaseURL: "https://web-database-40de1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-database-40de1",
  storageBucket: "web-database-40de1.appspot.com",
  messagingSenderId: "454960730822",
  appId: "1:454960730822:web:2c1e84a8b0e33d36a7bdc7",
  measurementId: "G-213MFNLF8N"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
      
//const analytics = getAnalytics(app);
return getDatabase(app);
}
export default startFireBase


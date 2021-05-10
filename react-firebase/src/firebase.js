import firebase from 'firebase'

// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyBgkIkDTWvZL9HStzrCeXrJgHcNHOzmcas",
  authDomain: "cs573-finalproject.firebaseapp.com",
  databaseURL: "https://cs573-finalproject-default-rtdb.firebaseio.com",
  projectId: "cs573-finalproject",
  storageBucket: "cs573-finalproject.appspot.com",
  messagingSenderId: "907330527079",
  appId: "1:907330527079:web:bd8c86db2228836135d9c2"
};
// Initialize Firebase
let fire = firebase.initializeApp(firebaseConfig);
  export default fire;
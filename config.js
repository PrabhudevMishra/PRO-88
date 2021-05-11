import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB_tNdi9oHyvsPkgJuPv4F3ds8zXDD50K4",
  authDomain: "bartersystemapp-9cd9c.firebaseapp.com",
  projectId: "bartersystemapp-9cd9c",
  storageBucket: "bartersystemapp-9cd9c.appspot.com",
  messagingSenderId: "930298515736",
  appId: "1:930298515736:web:399de842a00d4c87b40e6d",
};

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();

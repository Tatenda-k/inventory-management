// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEDQ-9MkHYfwpMHC-scAv95h-oXYvtf0w",
  authDomain: "inventorymanagement-b0184.firebaseapp.com",
  projectId: "inventorymanagement-b0184",
  storageBucket: "inventorymanagement-b0184.appspot.com",
  messagingSenderId: "796441142076",
  appId: "1:796441142076:web:89f4cdec6300fb5c66f439"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export {firestore}
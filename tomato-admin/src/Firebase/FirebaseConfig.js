import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"



const firebaseConfig = {
    apiKey: "AIzaSyB53BMYwg_iNdEY7Mpm7sSpwYa8p-fxcsU",
    authDomain: "tomato-996be.firebaseapp.com",
    projectId: "tomato-996be",
    storageBucket: "tomato-996be.appspot.com",
    messagingSenderId: "434768406230",
    appId: "1:434768406230:web:fa129335e851014478cb77"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { storage, db };
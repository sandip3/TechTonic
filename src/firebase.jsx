// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcxAmQTP4TP0vIzZLa-YshBN6OafcO1u0",
  authDomain: "event-management-dbcde.firebaseapp.com",
  projectId: "event-management-dbcde",
  storageBucket: "event-management-dbcde.firebasestorage.app",
  messagingSenderId: "505762132064",
  appId: "1:505762132064:web:faa14e451cd617fe8b9305"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

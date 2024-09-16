// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsANL6Uc-xZwE4HhNEH8AzMizjupRwF9M",
  authDomain: "drone-project-dddfd.firebaseapp.com",
  projectId: "drone-project-dddfd",
  storageBucket: "drone-project-dddfd.appspot.com",
  messagingSenderId: "503627863983",
  appId: "1:503627863983:web:6cae883d2c576ee158c15a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

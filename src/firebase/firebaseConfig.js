// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxBOOCRMPTVuvsRV-MoSAn5-LFa6uaKPY",
  authDomain: "react-app-curso-85b71.firebaseapp.com",
  projectId: "react-app-curso-85b71",
  storageBucket: "react-app-curso-85b71.firebasestorage.app",
  messagingSenderId: "272853812860",
  appId: "1:272853812860:web:f8e257e7126333f1412bf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();


export { db, auth, googleAuthProvider };
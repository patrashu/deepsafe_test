import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNO1BMewHtAZtErnGMJ0pGYU1oiQw_8UI",
  authDomain: "deepsafe-9a384.firebaseapp.com",
  projectId: "deepsafe-9a384",
  storageBucket: "deepsafe-9a384.appspot.com",
  messagingSenderId: "776843826597",
  appId: "1:776843826597:web:470fb0c2702d5b7310444c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

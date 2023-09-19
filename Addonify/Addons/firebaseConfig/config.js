import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6xVFsAmBOPTQ2NrCyIB-l6fJz9kLqZRQ",
  authDomain: "addonify-2.firebaseapp.com",
  databaseURL:
    "https://addonify-2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "addonify-2",
  storageBucket: "addonify-2.appspot.com",
  messagingSenderId: "952057186879",
  appId: "1:952057186879:web:1d96fb04ddc520d308c68a",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage();

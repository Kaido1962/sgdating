import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDpXxYc5UoZjia7LbtGxetOtGuBP_XfoN4",
    authDomain: "sg-dating-app-1d8f6.firebaseapp.com",
    projectId: "sg-dating-app-1d8f6",
    storageBucket: "sg-dating-app-1d8f6.firebasestorage.app",
    messagingSenderId: "451219004976",
    appId: "1:451219004976:web:8ac8b70ca239e88cca57f5",
    measurementId: "G-0KJW6J3JHE"
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
// Use initializeFirestore to force long-polling (fixes QUIC network errors)
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
export const storage = getStorage(app);

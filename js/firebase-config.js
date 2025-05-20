import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3-UILdIXK6I_G1odCkOhn2ZCpIyQgi_4",
  authDomain: "aurafit-f3c36.firebaseapp.com",
  projectId: "aurafit-f3c36",
  storageBucket: "aurafit-f3c36.firebasestorage.app",
  messagingSenderId: "1017552218994",
  appId: "1:1017552218994:web:cbb9869b55bf509396cbeb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
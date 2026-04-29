import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlPY6z3jTzb0X2u-BF5q-xlI-grgY4bpQ",
    authDomain: "supriyo-portfolio-88d1c.firebaseapp.com",
    projectId: "supriyo-portfolio-88d1c",
    storageBucket: "supriyo-portfolio-88d1c.firebasestorage.app",
    messagingSenderId: "108446230807",
    appId: "1:108446230807:web:435a83b0c0dcff687baf52",
    measurementId: "G-520NZ1CWB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app instance if we need to initialize services like Firestore or Auth later
export default app;

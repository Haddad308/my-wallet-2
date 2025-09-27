// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZZfZfiuBNUN5_cBnZcij71CEfntToQn8",
  authDomain: "gold-prices-551f1.firebaseapp.com",
  projectId: "gold-prices-551f1",
  storageBucket: "gold-prices-551f1.firebasestorage.app",
  messagingSenderId: "285980552855",
  appId: "1:285980552855:web:3243a0a0b0c227fdd103d2",
  measurementId: "G-PC7Q41L6MT",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Analytics will be initialized separately if needed in client components

export default app

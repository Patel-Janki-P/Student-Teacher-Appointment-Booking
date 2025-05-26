import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7WhEtZ2Xj5lq4uQU50Y_kP8FQrsf-aaA",
  authDomain: "student-teacher-appointbooking.firebaseapp.com",
  projectId: "student-teacher-appointbooking",
  storageBucket: "student-teacher-appointbooking.firebasestorage.app",
  messagingSenderId: "96093211644",
  appId: "1:96093211644:web:67652dbe2618f494c40079",
  measurementId: "G-6SYEC895XN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

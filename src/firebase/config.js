import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQnQ-L5kqzVX1KyK35XOoEFuaEeLwBhKY",
  authDomain: "food-3dc6b.firebaseapp.com",
  databaseURL: "https://food-3dc6b-default-rtdb.firebaseio.com",
  projectId: "food-3dc6b",
  storageBucket: "food-3dc6b.appspot.com",
  messagingSenderId: "968433352816",
  appId: "1:968433352816:web:fc10d1219a369d1f5334b5",
  measurementId: "G-P6SJNZ25ZE",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các service
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;

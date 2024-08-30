import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBe_T67rBKJ2T5xudNlhS118TcvoncG3SU",
    authDomain: "cryptoconverter-ca245.firebaseapp.com",
    projectId: "cryptoconverter-ca245",
    storageBucket: "cryptoconverter-ca245.appspot.com",
    messagingSenderId: "296583261473",
    appId: "1:296583261473:web:4da98cdc821a21e62a6260"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };

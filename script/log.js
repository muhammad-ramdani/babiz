// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { getDatabase } from "firebase/database";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmluS-m1jHTbBnO1zRl2qmfIRRgMl3tHo",
  authDomain: "babizfinder-app.firebaseapp.com",
  databaseURL: "https://babizfinder-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "babizfinder-app",
  storageBucket: "babizfinder-app.appspot.com",
  messagingSenderId: "873975088597",
  appId: "1:873975088597:web:dba11f7f88cb43674e695c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let loginButton = document.getElementById("loginBtn");

loginButton.addEventListener("click", (e) => {
  let emailSignin = document.getElementById("email-log").value;
  let passwordSignin = document.getElementById("pass-log").value;
  signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      let lgDate = new Date();
      update(ref(database, "users/" + user.uid), {
        last_login: lgDate,
      })
        .then(() => {
          // Data saved successfully!
          alert("user telah sukses login");
          location.href = "http://127.0.0.1:5500//index.html";
        })
        .catch((error) => {
          //the write failed
          alert(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  signOut(auth)
    .then(() => {})
    .catch((error) => {});
});

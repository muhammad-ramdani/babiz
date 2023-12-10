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
let registerButton = document.getElementById("registerBtn");

registerButton.addEventListener("click", (e) => {
  let nameumkm = document.getElementById("nameumkm").value;
  let emailReg = document.getElementById("email-reg").value;
  let passwordReg = document.getElementById("password-reg").value;

  createUserWithEmailAndPassword(auth, emailReg, passwordReg)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      set(ref(database, "users/" + user.uid), {
        name: nameumkm,
        email: emailReg,
        password: passwordReg,
      })
        .then(() => {
          // Data saved successfully!
          alert("user telah sukses dibuat");
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
});

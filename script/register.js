// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "/script/config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
let registerButton = document.getElementById("registerBtn");

registerButton.addEventListener("click", (e) => {
  e.preventDefault();

  let emailReg = document.getElementById("email-reg").value;
  let passwordReg = document.getElementById("password-reg").value;

  createUserWithEmailAndPassword(auth, emailReg, passwordReg)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // You can perform any necessary actions after successful registration here
      alert("Selamat Akun Sudah Dibuat");
      location.href = "login.html";
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

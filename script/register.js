// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { getDatabase } from "firebase/database";
import { getDatabase, set, ref} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// import { firebaseConfig } from '/script/config.js';
import { firebaseConfig } from '/script/config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let registerButton = document.getElementById("registerBtn");

registerButton.addEventListener("click", (e) => {
  
  let namaUsahaReg = document.getElementById("namausaha-reg").value;
  let emailReg = document.getElementById("email-reg").value;
  let noWhatsAppReg = document.getElementById("noWhatsApp-reg").value;
  let instagramReg = document.getElementById("instagram-reg").value;
  let googleMapsReg = document.getElementById("maps-reg").value;
  let passwordReg = document.getElementById("password-reg").value;

  createUserWithEmailAndPassword(auth, emailReg, passwordReg)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      set(ref(database, "users/" + user.uid), {
        namaUsaha: namaUsahaReg,
        email: emailReg,
        noWhatsApp: noWhatsAppReg,
        instagram: instagramReg,
        googleMaps: googleMapsReg,
      })
        .then(() => {
          // Data saved successfully!
          alert("Selamat Akun Sudah Di Buat");
          location.href = "http://127.0.0.1:5500//login.html";
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

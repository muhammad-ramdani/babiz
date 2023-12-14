// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from '/script/config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
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

      // Store data in Firestore
      addDoc(collection(firestore, "users"), {
        uid: user.uid,
        namaUsaha: namaUsahaReg,
        email: emailReg,
        noWhatsApp: noWhatsAppReg,
        instagram: instagramReg,
        googleMaps: googleMapsReg,
      })
        .then(() => {
          // Data saved successfully in Firestore, now save to Realtime Database
          set(ref(database, "users/" + user.uid), {
            namaUsaha: namaUsahaReg,
            email: emailReg,
            noWhatsApp: noWhatsAppReg,
            instagram: instagramReg,
            googleMaps: googleMapsReg,
          }).then(() => {
            // Data saved successfully in Realtime Database
            alert("Selamat Akun Sudah Di Buat");
            location.href = "login.html";
          }).catch((error) => {
            // The write to Realtime Database failed
            alert(error);
          });
        })
        .catch((error) => {
          // The write to Firestore failed
          alert(error);
        });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

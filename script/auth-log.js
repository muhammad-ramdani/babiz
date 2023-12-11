// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { getDatabase } from "firebase/database";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
let loginButton = document.getElementById("loginButton");

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
          alert("Selamat Datang!!!");
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

// Pengecekan status login saat halaman dimuat
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Jika user sudah login, tampilkan tombol logout
    document.getElementById("loginBtn").classList.add("d-none");
    document.getElementById("logoutBtn").classList.remove("d-none");
  } else {
    // Jika user belum login, tampilkan tombol login
    document.getElementById("loginBtn").classList.remove("d-none");
    document.getElementById("logoutBtn").classList.add("d-none");
  }
});

// Event listener untuk tombol logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      // Redirect atau lakukan operasi lain setelah logout
      alert("Anda Sudah Logout");
      location.href = "http://127.0.0.1:5500//index.html";
    })
    .catch((error) => {
      alert(error);
    });
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Pengguna sudah login
    const logoutButton = document.getElementById("logoutBtn");
    const editProfileButton = document.createElement("a");
    editProfileButton.className = "nav-link";
    editProfileButton.innerText = "Detail UMKM";
    editProfileButton.href = "detail-umkm.html"; // Ganti dengan URL halaman edit profile
    const navbar = document.querySelector(".navbar-nav");
    navbar.insertBefore(editProfileButton, logoutButton);
  } else {
    // Pengguna belum login
    // Tidak perlu menampilkan menu Edit Profile
  }
});
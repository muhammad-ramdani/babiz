import { getAuth, signOut  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from '/script/config.js';

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let logoutButton = document.querySelector("#logoutBtn");

logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
  
    signOut(auth).then(() => {
      // Sign-out successful.
      alert("Berhasil keluar!");
      location.href = "http://127.0.0.1:5500//../index.html";
      // Redirect or perform other actions after logout
      // Example: window.location.href = "path/to/redirect";
    }).catch((error) => {
      // An error happened.
      console.error("Error while signing out: ", error);
      alert("Terjadi kesalahan saat keluar!");
    });
  });

let editProfileForm = document.querySelector("#simpanumkm");

editProfileForm.addEventListener("click", (e) => {
  e.preventDefault();

  const namaUsaha = document.querySelector("#namaUsaha").value;
  const noWhatsApp = document.querySelector("#noWhatsApp").value;
  const instagram = document.querySelector("#instagram").value;
  const googleMaps = document.querySelector("#googleMaps").value;
  const deskripsi = document.querySelector("#deskripsi").value;

  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;

    // Update data in Firebase Realtime Database
    update(ref(database, `users/${uid}`), {
      namaUsaha: namaUsaha,
      noWhatsApp: noWhatsApp,
      instagram: instagram,
      googleMaps: googleMaps,
      deskripsi: deskripsi,
    })
      .then(() => {
        // Update successful
        alert("Profil berhasil diperbarui!");
        // You can add further actions after successful update if needed
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error updating profile: ", error);
        alert("Terjadi kesalahan, profil gagal diperbarui!");
      });
  } else {
    // No user signed in
    alert("Tidak ada pengguna yang masuk!");
  }
});




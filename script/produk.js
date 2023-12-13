// Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "/script/config.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let logoutButton = document.querySelector("#logoutBtn");

logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        alert("Berhasil keluar!");
        location.href = "http://127.0.0.1:5500//../index.html";
    }).catch((error) => {
        console.error("Error while signing out: ", error);
        alert("Terjadi kesalahan saat keluar!");
    });
});

function saveUserDataToLocalStorage(userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
}

function getUserDataFromLocalStorage() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
}

function displayUserData(userData) {
    // Display user data in HTML elements
    document.getElementById("displayNamaUsaha").textContent = userData.namaUsaha || "";
    document.getElementById("displayProfemail").href = `mailto:${userData.email || ""}`;
    document.getElementById("displayProfemailText").textContent = userData.email || "";
    document.getElementById("displayProfwa").href = `https://wa.me/${userData.noWhatsApp || ""}`;
    document.getElementById("displayProfwaText").textContent = userData.noWhatsApp || "";
    document.getElementById("displayProfig").href = `https://www.instagram.com/${userData.instagram || ""}`;
    document.getElementById("displayProfigText").textContent = userData.instagram || "";
    document.getElementById("displayProflokasi").href = userData.googleMaps || "#";
    document.getElementById("displayProflokasiText").textContent = userData.googleMaps || "";
    document.getElementById("displayProdesc").textContent = userData.deskripsi || "";
}

document.addEventListener("DOMContentLoaded", () => {
    const userData = getUserDataFromLocalStorage();
    if (userData) {
        displayUserData(userData);
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        const userRef = collection(db, `users/${uid}`);

        onSnapshot(userRef, (snapshot) => {
            const userData = snapshot.val();
            displayUserData(userData);
            saveUserDataToLocalStorage(userData);
        });
    }
});

// ...

const tambahButton = document.querySelector("#simpangambar");

async function tambahProduk(nama, harga, deskripsi, gambar) {
  try {
    const produkRef = collection(db, "produk");
    await addDoc(produkRef, {
      nama: nama,
      harga: harga,
      deskripsi: deskripsi,
      gambar: gambar,
    });
    console.log("Produk berhasil ditambahkan!");
  } catch (error) {
    console.error("Error menambah produk:", error);
  }
}

tambahButton.addEventListener("click", async () => {
    const inputGambar = document.querySelector("#inputGambar");
    const namaProduk = document.querySelector("#namaProduk").value;
    const hargaProduk = document.querySelector("#hargaProduk").value;
  
    const file = inputGambar.files[0];
    const storageRef = ref(storage, 'images/' + file.name);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
  
      const deskripsiProduk = `${namaProduk} - Rp${hargaProduk}`;
  
      // Tambahkan kode untuk menampilkan deskripsi gambar di sini
      document.getElementById("deskripsiGambar").textContent = deskripsiProduk;
  
      await tambahProduk(namaProduk, hargaProduk, deskripsiProduk, url);
    } catch (error) {
      console.error("Error mengunggah gambar:", error);
    }
  });
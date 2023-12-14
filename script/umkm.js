// Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "/script/config.js";

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Referensi ke koleksi Firestore
const firestore = firebase.firestore();
const umkmContainer = document.getElementById("umkmContainer");

async function searchUMKM(keyword) {
  try {
    const querySnapshot = await firestore.collection("users").where("namaUsaha", ">=", keyword).get();
    umkmContainer.innerHTML = ""; // Menghapus konten sebelumnya sebelum menampilkan hasil pencarian baru
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const userCard = document.createElement("div");
      userCard.classList.add("col", "mb-4"); // Tambahkan class Bootstrap untuk grid dan margin

      // Buat tampilan data user dalam bentuk card atau elemen HTML yang diinginkan
      userCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title mb-4 text-center">${userData.namaUsaha}</h2>
            <img src="${userData.imageUrl}" class="card-img-top img-fluid mb-3" alt="User Image" style="object-fit: cover; height: 200px;" />
            <div class="mb-3">
              <a id="displayProfwa" href="https://wa.me/+62${userData.noWhatsApp}" class="text-decoration-none text-black">
                <i class="bi bi-whatsapp fs-5 me-3"></i>
                <span>${userData.noWhatsApp}</span>
              </a>
            </div>
            <div class="mb-3">
              <a id="displayProfig" href="https://www.instagram.com/${userData.instagram}" class="text-decoration-none text-black">
                <i class="bi bi-instagram fs-5 me-3"></i>
                <span>${userData.instagram}</span>
              </a>
            </div>
            <div class="mb-5">
              <a id="displayProflokasi" href="${userData.googleMaps}" class="text-decoration-none text-black">
                <i class="bi bi-geo-alt fs-5 me-3"></i>
                <span>${userData.googleMaps}</span>
              </a>
            </div>
            <p class="card-text">${userData.deskripsi}</p>
          </div>
        </div>
      `;

      // Tambahkan card user ke dalam kontainer
      umkmContainer.appendChild(userCard);
    });
  } catch (error) {
    console.error("Error searching documents: ", error);
  }
}

// Fungsi untuk menampilkan data UMKM dari Firestore
async function displayUMKM() {
  try {
    const querySnapshot = await firestore.collection("users").get();
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const userCard = document.createElement("div");
      userCard.classList.add("col", "mb-4"); // Tambahkan class Bootstrap untuk grid dan margin

      // Buat tampilan data user dalam bentuk card atau elemen HTML yang diinginkan
      userCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title mb-4 text-center">${userData.namaUsaha}</h2>
            <img src="${userData.imageUrl}" class="card-img-top img-fluid mb-3" alt="User Image" style="object-fit: cover; height: 200px;" />
            <div class="mb-3">
            <a id="displayProfwa" href="https://wa.me/+62${userData.noWhatsApp}" class="text-decoration-none text-black">
                <i class="bi bi-whatsapp fs-5 me-3"></i>
                <span>${userData.noWhatsApp}</span>
              </a>
            </div>
            <div class="mb-3">
              <a id="displayProfig" href="https://www.instagram.com/${userData.instagram}" class="text-decoration-none text-black">
                <i class="bi bi-instagram fs-5 me-3"></i>
                <span>${userData.instagram}</span>
              </a>
            </div>
            <div class="mb-5">
              <a id="displayProflokasi" href="${userData.googleMaps}" class="text-decoration-none text-black">
                <i class="bi bi-geo-alt fs-5 me-3"></i>
                <span>${userData.googleMaps}</span>
              </a>
            </div>
            <p class="card-text">${userData.deskripsi}</p>
          </div>
        </div>
      `;

      // Tambahkan card user ke dalam kontainer
      umkmContainer.appendChild(userCard);
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

// Panggil fungsi untuk menampilkan data UMKM saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  displayUMKM();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase().trim();
    searchUMKM(searchText);
  });
});




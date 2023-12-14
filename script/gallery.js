// Import firebase modules dan inisialisasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { firebaseConfig } from "/script/config.js";

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
let logoutButton = document.querySelector("#logoutBtn");

let currentUser = null; // Variabel untuk menyimpan informasi pengguna yang sedang login

logoutButton.addEventListener("click", (e) => {
  e.preventDefault();

  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Berhasil keluar!");
      location.href = "https://babizfinder-app.web.app/index.html";
      // Redirect or perform other actions after logout
      // Example: window.location.href = "path/to/redirect";
    })
    .catch((error) => {
      // An error happened.
      console.error("Error while signing out: ", error);
      alert("Terjadi kesalahan saat keluar!");
    });
});

// Ambil informasi pengguna yang sedang login
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    displayUploadedImages(user.uid);
  }
});

// Fungsi untuk menampilkan gambar yang diunggah oleh pengguna
async function displayUploadedImages(userId) {
  try {
    const imagesRef = ref(storage, "images/" + userId);
    const listResult = await listAll(imagesRef);
    const gallery = document.querySelector("#galleryItem");

    gallery.innerHTML = "";

    listResult.items.forEach(async (item) => {
      const imgUrl = await getDownloadURL(item);

      const col = document.createElement("div");
      col.classList.add("col-12", "col-md-4", "mb-4");

      const anchor = document.createElement("a");
      anchor.href = imgUrl;
      anchor.setAttribute("data-lightbox", "gallery");
      anchor.setAttribute("data-title", "Deskripsi Gambar");

      const img = document.createElement("img");
      img.classList.add("w-100", "rounded-4", "gallery-image");
      img.src = imgUrl;

      anchor.appendChild(img);
      col.appendChild(anchor);

      const deleteButton = document.createElement("button"); // Mengubah elemen menjadi 'button'
      deleteButton.classList.add("btn", "btn-danger", "text-white", "rounded-4", "mt-2", "btn-trash");
      deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';

      deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
          await deleteObject(item);
          col.remove();
          alert("Gambar berhasil dihapus!");
        } catch (error) {
          alert("Terjadi kesalahan saat menghapus gambar.");
          console.error(error);
        }
      });

      col.appendChild(deleteButton); // Tambahkan tombol delete ke dalam col
      gallery.appendChild(col);
    });
  } catch (error) {
    alert("Terjadi kesalahan saat mendapatkan gambar.");
    console.error(error);
  }
}

// Fungsi untuk mengunggah gambar dengan menyimpan ke subdirektori pengguna yang sedang login
async function uploadImage(file) {
  try {
    if (file && currentUser) {
      const storageRef = ref(storage, `images/${currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      alert("Gambar berhasil diunggah!");
      displayUploadedImages(currentUser.uid);
    }
  } catch (error) {
    alert("Terjadi kesalahan saat mengunggah gambar.");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.querySelector('input[type="file"]');
  const saveButton = document.querySelector("#simpangambar");

  saveButton.addEventListener("click", () => {
    uploadImage(fileInput.files[0]);
  });
});

// Import firebase modules dan inisialisasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { firebaseConfig } from "/script/config.js";

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

let currentUser = null; // Variabel untuk menyimpan informasi pengguna yang sedang login

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

      const card = document.createElement("div");
      card.classList.add("card", "rounded-4", "border-0");

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger", "text-white", "rounded-4", "position-absolute", "top-0", "start-0", "m-2");
      deleteButton.type = "button";
      deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
      deleteButton.style.backgroundColor = "#dc3545"; // Warna merah tanpa transparansi
      deleteButton.style.border = "1px solid #dc3545"; // Sesuaikan warna border dengan latar belakang

      deleteButton.addEventListener("mouseenter", () => {
        deleteButton.style.backgroundColor = "#c82333"; // Warna merah yang sedikit lebih gelap saat di-hover
        deleteButton.style.border = "1px solid #c82333"; // Sesuaikan warna border dengan latar belakang saat di-hover
      });

      deleteButton.addEventListener("mouseleave", () => {
        deleteButton.style.backgroundColor = "#dc3545"; // Kembali ke warna merah saat tidak di-hover
        deleteButton.style.border = "1px solid #dc3545"; // Kembali ke warna border saat tidak di-hover
      });

      const img = document.createElement("img");
      img.classList.add("w-100", "rounded-4");
      img.src = imgUrl;

      deleteButton.addEventListener("click", async () => {
        try {
          await deleteObject(item);
          col.remove();
          alert("Gambar berhasil dihapus!");
        } catch (error) {
          alert("Terjadi kesalahan saat menghapus gambar.");
          console.error(error);
        }
      });

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body", "px-0");
      cardBody.appendChild(deleteButton);

      card.appendChild(img);
      card.appendChild(cardBody);
      col.appendChild(card);
      document.querySelector("main .row").appendChild(col); // Sesuaikan dengan struktur HTML yang diinginkan
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

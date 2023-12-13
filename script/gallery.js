import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref as sref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { firebaseConfig } from "/script/config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
let logoutButton = document.querySelector("#logoutBtn");

logoutButton.addEventListener("click", (e) => {
  e.preventDefault();

  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Berhasil keluar!");
      location.href = "http://127.0.0.1:5500//../index.html";
      // Redirect or perform other actions after logout
      // Example: window.location.href = "path/to/redirect";
    })
    .catch((error) => {
      // An error happened.
      console.error("Error while signing out: ", error);
      alert("Terjadi kesalahan saat keluar!");
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.querySelector('input[type="file"]');
  const saveButton = document.querySelector("#simpangambar");
  const gallery = document.querySelector(".row");

  saveButton.addEventListener("click", () => {
    uploadImage(fileInput.files[0]);
  });

  async function uploadImage(file) {
    try {
      if (file) {
        const storageRef = sref(storage, "images/" + file.name);
        await uploadBytes(storageRef, file);
        alert("Gambar berhasil diunggah!");
        displayUploadedImages();
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengunggah gambar.");
      console.error(error);
    }
  }

  async function displayUploadedImages() {
    try {
      const imagesRef = sref(storage, "images");
      const listResult = await imagesRef.list(); // Ubah dari listAll() menjadi list()

      gallery.innerHTML = "";

      listResult.items.forEach(async (item) => {
        const imgUrl = await getDownloadURL(item);
        const col = document.createElement("div");
        col.classList.add("col-12", "col-md-4", "mb-4");

        const card = document.createElement("div");
        card.classList.add("card", "rounded-4", "border-0");

        const img = document.createElement("img");
        img.classList.add("w-100", "rounded-4");
        img.src = imgUrl;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "px-0");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-outline-danger", "rounded-4");
        deleteButton.type = "button";
        deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';

        deleteButton.addEventListener("click", async () => {
          try {
            await item.delete();
            col.remove();
            alert("Gambar berhasil dihapus!");
          } catch (error) {
            alert("Terjadi kesalahan saat menghapus gambar.");
            console.error(error);
          }
        });

        cardBody.appendChild(deleteButton);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        gallery.appendChild(col);
      });
    } catch (error) {
      alert("Terjadi kesalahan saat mendapatkan gambar.");
      console.error(error);
    }
  }
});

// Import firebase modules dan inisialisasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { firebaseConfig } from "/script/config.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
let logoutButton = document.querySelector("#logoutBtn");

let currentUser = null;

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

// Periksa jika pengguna sudah login
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  }
});

// Ambil elemen yang dibutuhkan dari HTML
const inputGambar = document.getElementById("inputGambar");
const simpanProdukBtn = document.getElementById("simpanProduk");
const namaProdukInput = document.getElementById("namaProduk");
const hargaProdukInput = document.getElementById("hargaProduk");
const listProdukContainer = document.querySelector("#listProduk");

// Tambahkan event listener untuk tombol simpan produk
simpanProdukBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const namaProduk = namaProdukInput.value;
  const hargaProduk = hargaProdukInput.value;

  // Ambil file yang diunggah
  const file = inputGambar.files[0];

  try {
    // Upload file ke Firebase Storage
    const storageRef = ref(storage, "images/" + file.name);
    await uploadBytes(storageRef, file);

    // Dapatkan URL download dari file yang diunggah
    const downloadURL = await getDownloadURL(storageRef);

    // Dapatkan ID pengguna yang sedang login
    const userId = currentUser.uid;

    // Simpan data produk bersama dengan URL gambar di Firestore
    await addDoc(collection(db, "produk"), {
      nama: namaProduk,
      harga: hargaProduk,
      imageURL: downloadURL,
      userId: userId,
    });

    alert("Data berhasil ditambahkan!");
    namaProdukInput.value = ""; // Kosongkan input nama produk setelah disimpan
    hargaProdukInput.value = ""; // Kosongkan input harga produk setelah disimpan
  } catch (error) {
    alert("Terjadi kesalahan saat menambahkan data.");
    console.error(error);
  }
});

// Menampilkan produk yang diunggah oleh pengguna
function displayUploadedImages(userId) {
  const imagesRef = ref(storage, "images/" + userId);
  listAll(imagesRef)
    .then((listResult) => {
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

        const deleteButton = document.createElement("button");
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

        col.appendChild(deleteButton);
        listProdukContainer.appendChild(col);
      });
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
      alert("Terjadi kesalahan saat mendapatkan gambar.");
    });
}

// Menjalankan fungsi displayUploadedImages saat pengguna login
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    displayUploadedImages(user.uid);
  }
});

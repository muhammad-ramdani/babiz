// Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { firebaseConfig } from "/script/config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
let logoutButton = document.querySelector("#logoutBtn");

const userDataContainer = document.getElementById("userDataContainer");

// Function to display user data immediately upon login
function displayUserDataOnLogin(user) {
  if (user) {
    const uid = user.uid;
    const userDoc = doc(firestore, "users", uid);

    try {
      onSnapshot(userDoc, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          displayUserData(userData);
          fillEditProfileForm(userData);
        }
      });
    } catch (error) {
      console.error("Error fetching user data: ", error);
      // Handle error
    }
  }
}
// Check if user is logged in on initial load
onAuthStateChanged(auth, (user) => {
  if (user) {
    displayUserDataOnLogin(user);
  } else {
    // User is not logged in
    // Handle this case if needed
  }
});


logoutButton.addEventListener("click", (e) => {
  e.preventDefault();

  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Berhasil keluar!");
      location.href = "../index.html";
      // Redirect or perform other actions after logout
      // Example: window.location.href = "path/to/redirect";
    })
    .catch((error) => {
      // An error happened.
      console.error("Error while signing out: ", error);
      alert("Terjadi kesalahan saat keluar!");
    });
});

const editProfileForm = document.querySelector("#simpanumkm");

editProfileForm.addEventListener("click", async (e) => {
  e.preventDefault();

  const namaUsaha = document.querySelector("#namaUsaha").value;
  const noWhatsApp = document.querySelector("#noWhatsApp").value;
  const instagram = document.querySelector("#instagram").value;
  const googleMaps = document.querySelector("#googleMaps").value;
  const deskripsi = document.querySelector("#deskripsi").value;

  const userData = {
    namaUsaha: namaUsaha,
    noWhatsApp: noWhatsApp,
    instagram: instagram,
    googleMaps: googleMaps,
    deskripsi: deskripsi,
  };

  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    const userDoc = doc(firestore, "users", uid);

    try {
      const fileInput = document.querySelector('input[type="file"]');
      const files = fileInput.files;

      const promises = [];
      for (const file of files) {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytes(storageRef, file);
        promises.push(uploadTask);
      }

      Promise.all(promises)
        .then(async (snapshots) => {
          const downloadURLs = await Promise.all(snapshots.map((snapshot) => getDownloadURL(snapshot.ref)));
          userData.imageUrls = downloadURLs;

          try {
            await setDoc(userDoc, userData);
            alert("Profil dan gambar berhasil diperbarui!");
          } catch (error) {
            console.error("Error updating profile: ", error);
            alert("Terjadi kesalahan, profil dan gambar gagal diperbarui!");
          }
        })
        .catch((error) => {
          console.error("Error uploading image: ", error);
          alert("Terjadi kesalahan saat mengunggah gambar!");
        });
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Terjadi kesalahan, profil dan gambar gagal diperbarui!");
    }
  } else {
    alert("Tidak ada pengguna yang masuk!");
  }
});

// Function to display user data
function displayUserData(userData) {
  // Menghapus semua gambar sebelum menambahkan yang baru
  const galleryItem = document.getElementById("galleryItem");
  galleryItem.innerHTML = "";
  // Display user data in HTML elements
  document.getElementById("displayNamaUsaha").textContent = userData.namaUsaha || "";
  document.getElementById("displayProfwa").href = `https://wa.me/${userData.noWhatsApp || ""}`;
  document.getElementById("displayProfwaText").textContent = userData.noWhatsApp || "";
  document.getElementById("displayProfig").href = `https://www.instagram.com/${userData.instagram || ""}`;
  document.getElementById("displayProfigText").textContent = userData.instagram || "";
  document.getElementById("displayProflokasi").href = userData.googleMaps || "#";
  document.getElementById("displayProflokasiText").textContent = userData.googleMaps || "";
  document.getElementById("displayProdesc").textContent = userData.deskripsi || "";
  // Display uploaded image, if available
  if (userData.imageUrls && userData.imageUrls.length > 0) {
    const gallery = document.createElement("div");
    gallery.classList.add("gallery"); // Tambahkan class gallery (sesuaikan dengan kebutuhan styling Anda)

    userData.imageUrls.forEach((imageUrl) => {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = "Uploaded Image";
      image.classList.add("img-thumbnail", "m-2", "col-md-3", "mx-auto");
      image.style.width = "20%"; // Menambahkan style untuk memperbesar ukuran gambar

      gallery.appendChild(image);
    });

    galleryItem.appendChild(gallery);
  }
}
// Function to fill edit profile form with user data
function fillEditProfileForm(userData) {
  document.querySelector("#namaUsaha").value = userData.namaUsaha || "";
  document.querySelector("#noWhatsApp").value = userData.noWhatsApp || "";
  document.querySelector("#instagram").value = userData.instagram || "";
  document.querySelector("#googleMaps").value = userData.googleMaps || "";
  document.querySelector("#deskripsi").value = userData.deskripsi || "";
}

// Add event listener for edit profile modal opening
document.querySelector("#editumkm").addEventListener("show.bs.modal", async () => {
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    const userDoc = doc(firestore, "users", uid);

    try {
      const docSnapshot = await onSnapshot(userDoc, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          displayUserData(userData);
          fillEditProfileForm(userData);
        }
      });
    } catch (error) {
      console.error("Error fetching user data: ", error);
      // Handle error
    }
  }
});



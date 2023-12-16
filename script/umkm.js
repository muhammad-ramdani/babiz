import { firebaseConfig } from "/script/config.js";

// Inisialisasi Firebase (pastikan konfigurasi firebaseConfig sudah dimasukkan)

// Masukkan konfigurasi Firebase Anda di sini

firebase.initializeApp(firebaseConfig);

// Referensi ke koleksi Firestore
const firestore = firebase.firestore();
const umkmContainer = document.getElementById("umkmContainer");

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
          <h2 class="card-title mb-4 text-center custom-font" style="font-weight: bold;">${userData.namaUsaha}</h2>
            <div id="carousel-${doc.id}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner"></div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${doc.id}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel-${doc.id}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
            <div class="mb-3">
          <a id="displayProfwa" href="https://wa.me/+62${userData.noWhatsApp}" class="text-decoration-none text-black" style="font-family: 'Nunito', sans-serif;">
          <i class="bi bi-whatsapp fs-5 me-3"></i>
          <span>${userData.noWhatsApp}</span>
        </a>
      </div>
      <div class="mb-3">
        <a id="displayProfig" href="https://www.instagram.com/${userData.instagram}" class="text-decoration-none text-black" style="font-family: 'Nunito', sans-serif;">
          <i class="bi bi-instagram fs-5 me-3"></i>
          <span>${userData.instagram}</span>
        </a>
      </div>
      <div class="mb-5">
        <a id="displayProflokasi" href="${userData.googleMaps}" class="text-decoration-none text-black" style="font-family: 'Nunito', sans-serif;">
          <i class="bi bi-geo-alt fs-5 me-3"></i>
          <span>Lokasi : ${userData.googleMaps}</span>
        </a>
      </div>
      <p class="card-text" style="font-family: 'Nunito', sans-serif; display: none;">${userData.deskripsi}</p>
      <button class="btn btn-primary toggle-description" style="font-family: 'Nunito', sans-serif;">Baca Deskripsi</button>
    </div>
  </div>
`;

      umkmContainer.appendChild(userCard);

      const toggleButton = userCard.querySelector(".toggle-description");
      toggleButton.addEventListener("click", () => {
        const description = userCard.querySelector(".card-text");
        if (description.style.display === "none") {
          description.style.display = "block";
          toggleButton.textContent = "Sembunyikan Deskripsi";
        } else {
          description.style.display = "none";
          toggleButton.textContent = "Baca Deskripsi";
        }
      });

      // Tampilkan gambar di dalam carousel
      if (userData.imageUrls && userData.imageUrls.length > 0) {
        const carouselInner = userCard.querySelector(".carousel-inner");
        userData.imageUrls.forEach((imageUrl, index) => {
          const carouselItem = document.createElement("div");
          carouselItem.classList.add("carousel-item");
          if (index === 0) {
            carouselItem.classList.add("active");
          }

          const image = document.createElement("img");
          image.src = imageUrl;
          image.alt = "Uploaded Image";
          image.classList.add("w-100", "rounded-4", "mb-4");

          carouselItem.appendChild(image);
          carouselInner.appendChild(carouselItem);
        });
      }
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayUMKM();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const cards = umkmContainer.querySelectorAll(".card");

    cards.forEach((card) => {
      const cardTitle = card.querySelector(".card-title").textContent.toLowerCase();
      if (cardTitle.includes(query)) {
        card.classList.remove("d-none"); // Tampilkan elemen
        card.classList.add("d-block"); // Pastikan elemen ditampilkan dalam grid
      } else {
        card.classList.remove("d-block"); // Sembunyikan elemen dari grid
        card.classList.add("d-none"); // Sembunyikan elemen secara keseluruhan
      }
    });
  });
});

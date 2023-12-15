// Referensi ke koleksi Firestore
const firestore = firebase.firestore();
const detailContainer = document.getElementById("detailContainer");

// Nama dokumen yang ingin diambil datanya
const namaDokumen = 'Test123';

// Fungsi untuk menampilkan detail UMKM dari Firestore berdasarkan nama dokumen
async function displayDetailUMKM() {
  try {
    // Ambil dokumen dengan nama yang spesifik (Test123 dalam contoh ini)
    const docRef = firestore.collection("users").doc(namaDokumen);
    const doc = await docRef.get();

    if (doc.exists) {
      const userData = doc.data();
      // Tampilkan detail UMKM di halaman
      // Misalnya:
      detailContainer.innerHTML = `
        <h1>${userData.namaUsaha}</h1>
        <p>WhatsApp: ${userData.whatsapp}</p>
        <p>Instagram: ${userData.instagram}</p>
        <p>Lokasi: ${userData.lokasi}</p>
        <p>Deskripsi: ${userData.deskripsi}</p>
      `;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
}

// Panggil fungsi untuk menampilkan detail UMKM saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  displayDetailUMKM();
});
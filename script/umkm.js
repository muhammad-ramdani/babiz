import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, update, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "/script/config.js";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

function saveUserDataToLocalStorage(userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
}

function getUserDataFromLocalStorage(){
    const umkmData = localStorage.getItem('umkmData')
    return umkmData ? JSON.parse(umkmData):null
}

function displayUmkm(umkmData){
    document.getElementById('descUmkm').textContent = umkmData.desc || ""
}

document.addEventListener('DOMContentLoaded',()=>{
    const umkmData = getUserDataFromLocalStorage()
    if(umkmData){
        displayUmkm(umkmData)
    }
})

onAuthStateChanged(auth, (user)=>{
    if(user){
        const uid = user.id
        const userRef = ref(database, `users/${uid}`)

        onValue(userRef, (snapshot)=>{
            const umkmData = snapshot.val()
            displayUmkm(umkmData)
            saveUserDataToLocalStorage(umkmData)
        })
    }
})
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc, getDocs,
  query, where,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAubUqFEXL0J6WLw8noIzNjHtUaqzlTVAg",
    authDomain: "eserfc-cd786.firebaseapp.com",
    databaseURL: "https://eserfc-cd786-default-rtdb.firebaseio.com",
    projectId: "eserfc-cd786",
    storageBucket: "eserfc-cd786.appspot.com",
    messagingSenderId: "793005029842",
    appId: "1:793005029842:web:57f5e5504c5c508938300b"
  }

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'Rake')

 // deleting docs
 const deleteRakeInfo = document.querySelector('.delete');
 deleteRakeInfo.addEventListener('submit', async (e) => {
     e.preventDefault();

     const searchedRakeno = deleteRakeInfo.rakeno.value;

     // Query the collection to find the document with the searchedRakeno
     const q = query(colRef, where('rakeno', '==', searchedRakeno));
     const querySnapshot = await getDocs(q);

     if (querySnapshot.empty) {
         alert('No rake found');
         return;
     }

     // Loop through the results (there should be only one if `rakeno` is unique)
     querySnapshot.forEach(async (doc) => {
         await deleteDoc(doc.ref);
         alert("Rake Deleted Successfully");
     });

     deleteRakeInfo.reset();
 });

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

// Updating a document
const editRakeInfo = document.querySelector('.info');
editRakeInfo.addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchRakeNo = editRakeInfo.rakeno.value;
    const newTrs = editRakeInfo.editTrs.value;
    const newCombination = editRakeInfo.editCombination.value;
    const newInfo = editRakeInfo.editInfo.value;
    const newStatus = editRakeInfo.editStatus.value;

    // Query the collection to find the document with the searchedRakeNo
    const q = query(colRef, where('rakeno', '==', searchRakeNo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert('No rake found');
        return;
    }

    // Loop through the results (there should be only one if `rakeno` is unique)
    querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, 'Rake', docSnapshot.id);

        await updateDoc(docRef, {
            trs: newTrs,
            combination: newCombination,
            info: newInfo,
            status: newStatus
        });

        alert("Rake Info Updated Successfully");
    });

    editRakeInfo.reset();
});

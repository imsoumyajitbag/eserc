import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore, collection, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAubUqFEXL0J6WLw8noIzNjHtUaqzlTVAg",
  authDomain: "eserfc-cd786.firebaseapp.com",
  databaseURL: "https://eserfc-cd786-default-rtdb.firebaseio.com",
  projectId: "eserfc-cd786",
  storageBucket: "eserfc-cd786.appspot.com",
  messagingSenderId: "793005029842",
  appId: "1:793005029842:web:57f5e5504c5c508938300b"
};

// Init Firebase
initializeApp(firebaseConfig);

// Init Firestore and Storage services
const db = getFirestore();
const storage = getStorage();

// Collection ref
const colRef = collection(db, 'Rake');

// Adding docs
const addRakeInfo = document.querySelector('.add');
addRakeInfo.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get image file
  const file = addRakeInfo.image.files[0];
  const storageRef = ref(storage, `rakes/${file.name}`);
  
  try {
    // Upload image file to Firebase Storage
    await uploadBytes(storageRef, file);
    
    // Get the image URL
    const imageURL = await getDownloadURL(storageRef);
    
    // Add document to Firestore
    await addDoc(colRef, {
      rakeno: addRakeInfo.rakeno.value,
      trs: addRakeInfo.trs.value,
      combination: addRakeInfo.combination.value,
      info: addRakeInfo.info.value,
      status: addRakeInfo.status.value,
      remarks: addRakeInfo.remarks.value,
      imageUrl: imageURL
    });

    // Reset form and alert user
    addRakeInfo.reset();
    alert("Rake Added Successfully");
  } catch (error) {
    console.error("Error adding rake: ", error);
    alert("Error adding rake. Please try again.");
  }
});

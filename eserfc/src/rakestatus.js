import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore, collection, query, where, getDocs, doc, updateDoc
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

// Updating a document
const editRakeStatus = document.querySelector('.status');
editRakeStatus.addEventListener('submit', async (e) => {
  e.preventDefault();

  const searchRakeNo = editRakeStatus.rakeno.value;
  const newStatus = editRakeStatus.editRakeStatusSelect.value;
  const specialRemarks = editRakeStatus.specialRemarks.value;
  const file = editRakeStatus.image.files[0];

  // Query the collection to find the document with the searchedRakeno
  const q = query(colRef, where('rakeno', '==', searchRakeNo));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    alert('No rake found');
    return;
  }

  // Loop through the results (there should be only one if `rakeno` is unique)
  querySnapshot.forEach(async (docSnapshot) => {
    const docRef = doc(db, 'Rake', docSnapshot.id);

    // Update the document with the new status and special remarks
    const updateData = {
      status: newStatus,
      specialRemarks: specialRemarks
    };

    if (file) {
      const storageRef = ref(storage, `rakes/${file.name}`);

      try {
        // Upload image file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the image URL
        const imageURL = await getDownloadURL(storageRef);

        // Add imageURL to the updateData object
        updateData.imageUrl = imageURL;
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Error uploading image. Please try again.");
        return;
      }
    }

    await updateDoc(docRef, updateData);

    alert("Rake Status Updated Successfully");
  });

  editRakeStatus.reset();
});

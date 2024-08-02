import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAubUqFEXL0J6WLw8noIzNjHtUaqzlTVAg",
    authDomain: "eserfc-cd786.firebaseapp.com",
    databaseURL: "https://eserfc-cd786-default-rtdb.firebaseio.com",
    projectId: "eserfc-cd786",
    storageBucket: "eserfc-cd786.appspot.com",
    messagingSenderId: "793005029842",
    appId: "1:793005029842:web:57f5e5504c5c508938300b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById('contributeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const coachNumber = document.getElementById('coachNumber').value;
    const errorFound = document.getElementById('errorFound').value;
    const imageUpload = document.getElementById('imageUpload').files[0];
    const successMessage = document.getElementById('successMessage');

    try {
        let imageUrl = null;
        if (imageUpload) {
            const imageRef = ref(storage, 'images/' + imageUpload.name);
            await uploadBytes(imageRef, imageUpload);
            imageUrl = await getDownloadURL(imageRef);
        }

        await addDoc(collection(db, "Contributions"), {
            coachNumber,
            errorFound,
            imageUrl
        });

        successMessage.classList.remove('hidden');
        e.target.reset();

    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

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

// modal.js
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("termsModal");
    const agreeBtn = document.getElementById("agreeButton");
    const disagreeBtn = document.getElementById("disagreeButton");

    // Open the modal
    modal.style.display = "block";

    // Agree button
    agreeBtn.onclick = function() {
        modal.style.display = "none";
        // Allow access to the website
    };

    // Disagree button
    disagreeBtn.onclick = function() {
        // Redirect to another page or show a message
        window.location.href = "/dist/index.html";
    };
});

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const rakeNumberInput = document.getElementById('rakeNumber');
    const resultContainer = document.getElementById('resultContainer');

    searchButton.addEventListener('click', async function () {
        const rakeNumber = rakeNumberInput.value.trim();
        if (rakeNumber) {
            const q = query(collection(db, "Rake"), where("rakeno", "==", rakeNumber));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                let resultHTML = '';
                querySnapshot.forEach(async (doc) => {
                    const data = doc.data();
                    let imageUrl = '/dist/images/default.jpg'; // Default image

                    // Check if an image URL exists and get the download URL
                    if (data.imageUrl) {
                        try {
                            const imageRef = ref(storage, data.imageUrl);
                            imageUrl = await getDownloadURL(imageRef);
                        } catch (error) {
                            console.error("Error getting image URL: ", error);
                        }
                    }

                    resultHTML += `
                        <div id="successMessage" class="result-item">
                            <img src="${imageUrl}" alt="Rake Image" class="rake-image">
                            <div class="details">
                                <p>Rake No: ${data.rakeno}</p>
                                <p>Combination: ${data.combination}</p>
                                <p>TRS: ${data.trs}</p>
                                <p>Info: ${data.info}</p>
                                <p>Special Remarks: ${data.specialRemarks}</p>
                                <p>Status: ${data.status}</p>
                                <button onclick="window.location.href='acontribute.html'">See Contributions</button>
                            </div>
                        </div>
                    `;
                    resultContainer.innerHTML = resultHTML;
                });
            } else {
                resultContainer.innerHTML = `
                    <div id="errorMessage">
                        <p>No details found!</p>
                        <button onclick="window.location.href='/dist/admin/options/addRakeInfo.html'">Add Details</button>
                    </div>
                `;
            }
        } else {
            alert("Please enter a rake number.");
        }
    });

    document.getElementById('infoButton').addEventListener('click', function () {
        alert("This may occur by entering an invalid rake number or a rake number other than motor coach & DTC ⚠️");
    });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAubUqFEXL0J6WLw8noIzNjHtUaqzlTVAg",
    authDomain: "eserfc-cd786.firebaseapp.com",
    databaseURL: "https://eserfc-cd786-default-rtdb.firebaseio.com",
    projectId: "eserfc-cd786",
    storageBucket: "eserfc-cd786.appspot.com",
    messagingSenderId: "793005029842",
    appId: "1:793005029842:web:57f5e5504c5c508938300b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

let adminName = '';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDocRef = doc(db, "UserAuthList", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            adminName = userDocSnap.data().name; // Assuming 'name' field contains the admin's name
        } else {
            console.error("No such document!");
        }
    } else {
        console.error("No user is signed in.");
    }
});

async function loadContributions() {
    const querySnapshot = await getDocs(collection(db, "Contributions"));
    const contributions = [];
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        contributions.push({ id: doc.id, ...data });
    });

    contributions.sort((a, b) => {
        if (a.status && b.status) {
            return a.status.localeCompare(b.status);
        } else if (a.status) {
            return 1;
        } else if (b.status) {
            return -1;
        } else {
            return 0;
        }
    });

    const table = document.getElementById("contributionTable").getElementsByTagName('tbody')[0];
    table.innerHTML = "";

    contributions.forEach(async (contribution) => {
        const newRow = table.insertRow();
        
        const cellCoachNo = newRow.insertCell(0);
        const cellSuggestedEdit = newRow.insertCell(1);
        const cellImage = newRow.insertCell(2);
        const cellAction = newRow.insertCell(3);

        cellCoachNo.innerHTML = contribution.coachNumber;
        cellSuggestedEdit.innerHTML = contribution.errorFound;

        if (contribution.imageUrl) {
            const imageRef = ref(storage, contribution.imageUrl);
            getDownloadURL(imageRef)
                .then((url) => {
                    cellImage.innerHTML = `<a href="${url}" target="_blank">View Image</a>`;
                })
                .catch((error) => {
                    console.error("Error getting image URL:", error);
                    cellImage.innerHTML = "No Image";
                });
        } else {
            cellImage.innerHTML = "No Image";
        }

        if (contribution.status) {
            cellAction.textContent = contribution.status;
        } else {
            const acceptButton = document.createElement('button');
            acceptButton.textContent = 'Accept';
            acceptButton.style.backgroundColor = 'green';
            acceptButton.style.marginRight = '10px';
            acceptButton.addEventListener('click', async () => {
                try {
                    if (adminName) {
                        await updateDoc(doc(db, "Contributions", contribution.id), {
                            status: `Accepted by ${adminName}`
                        });
                        cellAction.textContent = `Accepted by ${adminName}`;
                    } else {
                        alert("Admin name not available. Please try again.");
                    }
                } catch (error) {
                    console.error("Error updating document: ", error);
                    alert("Failed to accept the contribution. Please try again.");
                }
            });

            const rejectButton = document.createElement('button');
            rejectButton.textContent = 'Reject';
            rejectButton.style.backgroundColor = 'red';
            rejectButton.addEventListener('click', async () => {
                try {
                    if (adminName) {
                        await updateDoc(doc(db, "Contributions", contribution.id), {
                            status: `Rejected by ${adminName}`
                        });
                        cellAction.textContent = `Rejected by ${adminName}`;
                    } else {
                        alert("Admin name not available. Please try again.");
                    }
                } catch (error) {
                    console.error("Error updating document: ", error);
                    alert("Failed to reject the contribution. Please try again.");
                }
            });

            cellAction.appendChild(acceptButton);
            cellAction.appendChild(rejectButton);
        }
    });
}

loadContributions();

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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

async function fetchHowrahData() {
    const howrahQuery = query(collection(db, "Rake"), where("trs", "in", ["HWH", "BDC", "TKPR"]));
    const querySnapshot = await getDocs(howrahQuery);
    const tableBody = document.querySelector("#rakeTable tbody");
    tableBody.innerHTML = ""; // Clear previous data

    // Collect data for sorting
    const dataArr = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        dataArr.push(data);
    });

    // Sort the data based on TRS
    dataArr.sort((a, b) => a.trs.localeCompare(b.trs));

    // Populate the table
    dataArr.forEach((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.trs}</td>
            <td>${data.combination}</td>
            <td>${data.info}</td>
            <td>${data.status}</td>
            <td>${data.remarks || ""}</td> <!-- Assuming the remarks field is 'remarks' -->
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', fetchHowrahData);
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, query, where, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAubUqFEXL0J6WLw8noIzNjHtUaqzlTVAg",
  authDomain: "eserfc-cd786.firebaseapp.com",
  databaseURL: "https://eserfc-cd786-default-rtdb.firebaseio.com",
  projectId: "eserfc-cd786",
  storageBucket: "eserfc-cd786.appspot.com",
  messagingSenderId: "793005029842",
  appId: "1:793005029842:web:57f5e5504c5c508938300b"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

const email = document.getElementById('email');
const phone = document.getElementById('phone');
const name = document.getElementById('name');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const securityCode = document.getElementById('securityCode');
const registerForm = document.getElementById('registerForm');
const generateSecurityCodeButton = document.getElementById('generateSecurityCodeButton');
const securityCodeMessage = document.getElementById('securityCodeMessage');
const timerMessage = document.getElementById('timerMessage');
const timeDisplay = document.getElementById('time');

registerForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  if (!await isUniqueUsername(username.value)) {
    alert("Username already taken!");
    return;
  }

  if (!await isUniquePhone(phone.value)) {
    alert("Phone number already in use!");
    return;
  }

  if (!await verifySecurityCode(securityCode.value)) {
    alert("Invalid security code");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (credentials) => {
      const ref = doc(db, 'UserAuthList', credentials.user.uid);
      await setDoc(ref, {
        name: name.value,
        username: username.value,
        email: email.value,
        phone: phone.value,
      });
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert(error.message);
      console.error(error.code, error.message);
    });
});

generateSecurityCodeButton.addEventListener('click', async () => {
  const code = generateRandomCode();

  await setDoc(doc(db, "SecurityCodes", code), {
    generated: true
  });

  securityCodeMessage.textContent = "Code Generated, Contact Master Admin for Code";
  startTimer(180, timeDisplay);

  // Automatically delete the security code from the database after 3 minutes
  setTimeout(async () => {
    await deleteSecurityCode(code);
  }, 180000);
});

async function isUniqueUsername(username) {
  const q = query(collection(db, "UserAuthList"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

async function isUniquePhone(phone) {
  const q = query(collection(db, "UserAuthList"), where("phone", "==", phone));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

async function verifySecurityCode(code) {
  const docRef = doc(db, "SecurityCodes", code);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await deleteDoc(docRef); // delete the code after successful verification
    return true;
  }
  return false;
}

async function deleteSecurityCode(code) {
  const docRef = doc(db, "SecurityCodes", code);
  await deleteDoc(docRef);
}

function generateRandomCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function startTimer(duration, display) {
  let timer = duration, minutes, seconds;
  const intervalId = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(intervalId);
      display.textContent = "00:00";
      securityCodeMessage.textContent = "Security code expired.";
    }
  }, 1000);
}

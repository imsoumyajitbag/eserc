import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, getDoc, query, collection, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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

const loginForm = document.getElementById('loginForm');
const loginIdentifier = document.getElementById('loginIdentifier');
const loginPassword = document.getElementById('loginPassword');

const loginUser = async (evt) => {
  evt.preventDefault();
  let identifier = loginIdentifier.value;
  let password = loginPassword.value;
  
  try {
    let user;
    if (identifier.includes('@')) {
      // If the identifier is an email
      user = await signInWithEmailAndPassword(auth, identifier, password);
    } else {
      // If the identifier is a username, find the corresponding email
      const userQuery = query(collection(db, 'UserAuthList'), where('username', '==', identifier));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        throw new Error('No user found with this username');
      }
      
      const userData = querySnapshot.docs[0].data();
      user = await signInWithEmailAndPassword(auth, userData.email, password);
    }

    if (user) {
      const ref = doc(db, 'UserAuthList', user.user.uid);
      const docSnap = await getDoc(ref);

      if (docSnap.exists) {
        sessionStorage.setItem("user-creds", JSON.stringify(user.user));
        window.location.href = '/dist/admin/options/dashboard.html';
      }
    }
  } catch (error) {
    alert(error.message);
    console.error(error.code, error.message);
  }
};

loginForm.addEventListener('submit', loginUser);

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8xEa25No0fBTof7nXU2_oKCa6-scDkFk",
  authDomain: "digital-legacy-1.firebaseapp.com",
  projectId: "digital-legacy-1",
  storageBucket: "digital-legacy-1.firebasestorage.app",
  messagingSenderId: "450657982007",
  appId: "1:450657982007:web:f8454c1b4af158603c91b2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save data to Firestore
async function saveCredentials() {
  const platform = document.getElementById("platformInput")?.value.trim();
  const username = document.getElementById("usernameInput")?.value.trim();
  const password = document.getElementById("passwordInput")?.value.trim();

  if (!platform || !username || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addDoc(collection(db, "credentials"), {
      platform,
      username,
      password,
      createdAt: Date.now()
    });

    alert("Credentials saved to Firestore");

    document.getElementById("platformInput").value = "";
    document.getElementById("usernameInput").value = "";
    document.getElementById("passwordInput").value = "";

    loadCredentials();
  } catch (error) {
    console.error("Error saving credentials:", error);
    alert("Failed to save credentials");
  }
}

// Read data from Firestore and show it
async function loadCredentials() {
  const list = document.getElementById("credentialsList");
  if (!list) return;

  list.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "credentials"));

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      list.innerHTML += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
          <p><strong>Platform:</strong> ${data.platform}</p>
          <p><strong>Username:</strong> ${data.username}</p>
          <p><strong>Password:</strong> ${data.password}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading credentials:", error);
  }
}

document.getElementById("saveCredentialsBtn")?.addEventListener("click", saveCredentials);

loadCredentials();

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
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

function encodePassword(password) {
  return btoa(password);
}

function decodePassword(encodedPassword) {
  try {
    return atob(encodedPassword);
  } catch (error) {
    return encodedPassword || "";
  }
}

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
      password: encodePassword(password),
      createdAt: serverTimestamp()
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

async function loadCredentials() {
  const list = document.getElementById("credentialsList");
  if (!list) return;

  list.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "credentials"));

    if (snapshot.empty) {
      list.innerHTML = "<p>No credentials saved yet.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.margin = "10px 0";
      card.style.borderRadius = "8px";

      card.innerHTML = `
        <p><strong>Platform:</strong> ${data.platform || ""}</p>
        <p><strong>Username:</strong> ${data.username || ""}</p>
        <p><strong>Password:</strong> ${decodePassword(data.password)}</p>
      `;

      list.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading credentials:", error);
    list.innerHTML = "<p>Failed to load credentials.</p>";
  }
}

document.getElementById("saveCredentialsBtn")?.addEventListener("click", saveCredentials);

loadCredentials();

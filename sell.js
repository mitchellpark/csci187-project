import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyClbY9zZUK1NvuUulI-f5cTSp_7OsNHJcY",
  authDomain: "market-c45ca.firebaseapp.com",
  projectId: "market-c45ca",
  storageBucket: "market-c45ca.firebasestorage.app",
  messagingSenderId: "1002648649266",
  appId: "1:1002648649266:web:be0d84910a108c5ea0862b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

async function upload(imageFile) {
  const record = ref(storage, `images/${Date.now()}-${imageFile.name}`);
  try {
    const img = await uploadBytes(record, imageFile);
    const link = await getDownloadURL(img.ref);
    console.log("File uploaded successfully. File URL:", link);
    return link; 
  } catch (error) {
    console.error("Error uploading to Firebase Storage:", error);
    throw new Error("Image upload failed. Please try again.");
  }
}

async function signout() {
  try {
    await signOut(auth);
    alert("You have been signed out.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Failed to sign out. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const listing = document.getElementById("listingForm");
  const sob = document.getElementById("signOutButton");

  if (sob) {
    sob.addEventListener("click", signout);
  }

  listing.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value.trim());
    const category = document.getElementById("category").value;
    const imgloc = document.getElementById("image").files[0];

    if (isNaN(price) || price < 0) {
      alert("Please enter a valid price.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be signed in to create a listing.");
      return;
    }

    try {
      let imageUrl = ""; 

      if (imgloc) {
        imageUrl = await upload(imgloc);
      }

      const listuserrec = collection(db, "Users", user.uid, "Listings");
      await addDoc(listuserrec, {
        title,
        description,
        price,
        category,
        image: imageUrl,
        createdAt: new Date(),
      });

      alert("Listing created successfully!");
      window.location.href = "marketplace.html";
    } catch (error) {
      console.error("Error creating listing:", error);
      alert(error.message || "Failed to create listing. Please try again.");
    }
  });
});


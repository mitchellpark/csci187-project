import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyClbY9zZUK1NvuUulI-f5cTSp_7OsNHJcY",
  authDomain: "market-c45ca.firebaseapp.com",
  projectId: "market-c45ca",
  storageBucket: "market-c45ca.firebaseapp.com",
  messagingSenderId: "1002648649266",
  appId: "1:1002648649266:web:be0d84910a108c5ea0862b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const review = document.getElementById("reviewChart");
  const sob = document.getElementById("signOutButton");
  if (sob) {
    sob.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error signing out:", error);
        alert("Failed to sign out. Please try again.");
      }
    });
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("You must be logged in to view your reviews.");
      window.location.href = "login.html";
      return;
    }

    try {
      const locateReviews = query(
        collection(db, "Users", user.uid, "Reviews")
      );

      const reviewdoc = await getDocs(locateReviews);

      if (reviewdoc.empty) {
        review.innerHTML = `<p>No reviews found.</p>`;
      } else {
        review.innerHTML = ""; 
        reviewdoc.forEach((doc) => {
          const info = doc.data();
          const rdoc = document.createElement("div");
          rdoc.className = "reviewcard";

          rdoc.innerHTML = `
            <h3>${info.buyerName || "Anonymous Buyer"}</h3>
            <div class="stars">${"★".repeat(info.rating)}</div>
            <p>${info.comment}</p>
          `;

          review.appendChild(rdoc);
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      review.innerHTML = `<p>Failed to load reviews. Please try again later.</p>`;
    }
  });
});



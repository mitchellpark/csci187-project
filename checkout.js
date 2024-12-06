import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", async () => {
  const products = document.getElementById("checkoutItems");
  const display = document.getElementById("display");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  function feed(message, isSuccess = false) {
    display.style.color = isSuccess ? "#00cc00" : "#ff0000";
    display.textContent = message;
  }

  if (cart.length === 0) {
    products.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  for (const item of cart) {
    const item = document.createElement("div");
    item.className = "checkoutItem";

    let sellerName = "Null";
    let sellerEmail = "Null";

    try {
      const sellerDoc = doc(db, "Users", item.userId);
      const sDoc = await getDoc(sellerDoc);

      if (sDoc.exists()) {
        const userData = sDoc.data();
        sellerName = `${userData["First Name"] } ${userData["Last Name"] || ""}`;
        sellerEmail = userData["Email"];
      }
    } catch (error) {
      console.error("Error retrieving seller data:", error);
    }

    item.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <p><strong>Title:</strong> ${item.title}</p>
      <p><strong>Price:</strong> $${item.price}</p>
      <p><strong>Seller:</strong> ${sellerName}</p>
      <p><strong>Seller's Email:</strong> ${sellerEmail}</p>
    `;
    products.appendChild(item);
  }

  document.getElementById("confirmCheckoutButton").addEventListener("click", async () => {
    const paymentConfirmed = document.getElementById("paymentConfirmation").checked;

    if (!paymentConfirmed) {
      feed("Please confirm that you sent the payment.");
      return;
    }

    const currentUser = auth.currentUser;

    for (const item of cart) {
      const buyerOrderHistoryRef = collection(db, "Users", currentUser.uid, "OrderHistory");

      const orderDetails = {
        buyerId: currentUser.uid,
        sellerId: item.userId,
        sellerName: `${item.sellerName || "Unknown"}`,
        sellerEmail: `${item.sellerEmail || "Not Provided"}`,
        itemTitle: item.title,
        price: item.price,
        date: new Date().toISOString(),
        itemImage: item.image,
      };

      try {
        await addDoc(buyerOrderHistoryRef, orderDetails);
        const docDeletion = doc(db, "Users", item.userId, "Listings", item.id);
        await deleteDoc(docDeletion);
      } catch (error) {
        console.error("Error processing checkout:", error);
        feed("An error occurred during checkout. Please try again.");
        return;
      }
    }

    localStorage.removeItem("cart");
    feed("Checkout successful!", true);
    setTimeout(() => {
      window.location.href = "checkout-success.html";
    }, 2000);
  });
});





















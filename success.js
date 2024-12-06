import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyClbY9zZUK1NvuUulI-f5cTSp_7OsNHJcY",
    authDomain: "market-c45ca.firebaseapp.com",
    projectId: "market-c45ca",
    storageBucket: "market-c45ca.appspot.com",
    messagingSenderId: "1002648649266",
    appId: "1:1002648649266:web:be0d84910a108c5ea0862b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    const returnToMarketplaceButton = document.getElementById("returnToMarketplace");

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "login.html";
        }
    });

    returnToMarketplaceButton.addEventListener("click", () => {
        window.location.href = "marketplace.html";
    });
});


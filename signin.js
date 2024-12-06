import { auth } from "./fireconfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

function checkvalid() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = "profile.html"; 
        });
}

document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault(); 
    checkvalid();
});


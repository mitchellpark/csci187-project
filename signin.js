import { auth } from "./fireconfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

function AuthUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login Success!");
            window.location.href = "profile.html";
        })
        .catch((error) => {
            const errMessage = error.message;
            alert(`Error! ${errMessage}`);
        });
}
document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault(); 
    AuthUser();
});


import { auth } from "./fireconfig.js";
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

function createUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email.endsWith('@scu.edu')) {
        alert("Only Santa Clara Edu emails allowed");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
            const user = res.user;
            alert("Registration success! Please check your email to verify.");

            sendEmailVerification(user)
                .then(() => {
                    alert("Verification email was sent!");
                })
                .catch((verificationError) => {
                    alert(`Error sending verification email: ${verificationError.message}`);
                });
        })
        .catch((error) => {
            alert(`Error! ${error.message}`);
        });
}

document.getElementById("regform").addEventListener("submit", function(event) {
    event.preventDefault();
    createUser();
});


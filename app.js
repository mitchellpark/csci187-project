import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyClbY9zZUK1NvuUulI-f5cTSp_7OsNHJcY",
    authDomain: "market-c45ca.firebaseapp.com",
    projectId: "market-c45ca",
    storageBucket: "market-c45ca.appspot.com",
    messagingSenderId: "1002648649266",
    appId: "1:1002648649266:web:be0d84910a108c5ea0862b",
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
    userfeedc("No persistence.", "error");
});

document.getElementById("regform")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email.endsWith("@scu.edu")) {
        userfeedc("Use a valid SCU email address.", "error");
        return;
    }

    try {
        const userDetails = await createUserWithEmailAndPassword(auth, email, password);
        const user = userDetails.user;

        await sendEmailVerification(user);
        await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            date: new Date().toISOString(),
        });

        userfeedc("Registered! Check email to verify account.");
        document.getElementById("regform").style.display = "none";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 8000);
    } catch (error) {
        userfeedc("Error during registration: " + error.message, "error");
    }
});
function userfeedc(message, type) {
    const userFeed = document.getElementById("userfeed");
    userFeed.innerHTML = "";

    const feed = document.createElement("p");
    feed.textContent = message;
    feed.className = type === "success" ? "successMessage" : "errorMessage";
    userFeed.appendChild(feed);
}

async function populateProfile() {
    const user = auth.currentUser;
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "Users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                document.getElementById("firstName").value = data["First Name"] ;
                document.getElementById("lastName").value = data["Last Name"];
                document.getElementById("email").value = data["Email"] || user.email;
                document.getElementById("address").value = data["Address"];
                document.getElementById("standing").value = data["Standing"];
                document.getElementById("venmoID").value = data["Venmo ID"];
            }
        } catch (error) {
            userfeedc("Error populating profile.", "error");
        }
    } else {
        window.location.href = "login.html";
    }
}
async function so() {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        userfeedc("Error signing out.", "error");
    }
}

async function store() {
    const user = auth.currentUser;
    if (user) {
        try {
            await setDoc(
                doc(db, "Users", user.uid),
                {
                    "First Name": document.getElementById("firstName").value,
                    "Last Name": document.getElementById("lastName").value,
                    "Address": document.getElementById("address").value,
                    "Standing": document.getElementById("standing").value,
                    "Venmo ID": document.getElementById("venmoID").value,
                    "Email": user.email,
                },
                { merge: true }
            );

            userfeedc("Profile updated", "success");
            populateProfile();
        } catch (error) {
            userfeedc("Error saving profile.", "error");
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const sb = document.getElementById("saveButton");
    const sob = document.getElementById("signOutButton");

    if (sb) sb.addEventListener("click", store);
    if (signOutButton) signOutButton.addEventListener("click", so);
    const path = window.location.pathname;
    if (!path.includes("registration.html")) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                populateProfile();
            } else {
                window.location.href = "login.html";
            }
        });
    }
});








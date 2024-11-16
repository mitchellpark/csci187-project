import { auth } from "./fireconfig.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const db = getFirestore();

async function populateProfile() {
    const user = auth.currentUser;
    if (user) {
        const uc = doc(db, "Users", user.uid);
        const udc = await getDoc(uc);

        if (udc.exists()) {
            const userData = udc.data();
            document.getElementById("firstName").value = userData["First Name"] || "";
            document.getElementById("lastName").value = userData["Last Name"] || "";
            document.getElementById("address").value = userData["Address"] || "";
            document.getElementById("standing").value = userData["Standing"] || "";
        } else {
            console.log("empty!");
        }
    } else {
        console.log("error!");
    }
}

async function savetoDB() {
    const user = auth.currentUser;
    if (user) {
        const uc = doc(db, "Users", user.uid);
        await setDoc(uc, {
            "First Name": document.getElementById("firstName").value,
            "Last Name": document.getElementById("lastName").value,
            "Address": document.getElementById("address").value,
            "Standing": document.getElementById("standing").value,
        }, { merge: true });

        alert("Profile updated");
    } else {
        console.log("error");
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        populateProfile(); 
    } else {
        console.log("No log in");
    }
});

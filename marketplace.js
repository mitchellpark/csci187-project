import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collectionGroup,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyClbY9zZUK1NvuUulI-f5cTSp_7OsNHJc5ea0862b",
  authDomain: "market-c45ca.firebaseapp.com",
  projectId: "market-c45ca",
  storageBucket: "market-c45ca.appspot.com",
  messagingSenderId: "1002648649266",
  appId: "1:1002648649266:web:be0d84910a108c5ea0862b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("dynamicListings");
  const pfilter = document.getElementById("applyFiltersButton");
  const bsearch = document.getElementById("searchButton");
  const inputS = document.getElementById("searchInput");
  const loading = document.getElementById("loadingIndicator");
  const sob = document.getElementById("signOutButton");

  if (sob) {
    sob.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error signing out:", error);
      }
    });
  }

  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Auth persistence set to local storage"))
    .catch((error) => console.error("Error setting persistence:", error));

  async function load(minPrice = 0, maxPrice = Infinity, searchQuery = "") {
    try {
      loading.style.display = "block";
      grid.innerHTML = "";

      let searchListings = collectionGroup(db, "Listings");

      if (minPrice || maxPrice < Infinity) {
        searchListings = query(
          searchListings,
          where("price", ">=", minPrice),
          where("price", "<=", maxPrice)
        );
      }

      const selectCats = Array.from(
        document.querySelectorAll(".categoryCheckbox:checked")
      ).map((checkbox) => checkbox.value);

      const listDoc = await getDocs(searchListings);

      if (listDoc.empty) {
        grid.innerHTML = "<p>No items match filter criteria.</p>";
        return;
      }

      listDoc.forEach((doc) => {
        const listing = doc.data();

        if (
          searchQuery &&
          !listing.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return;
        }

        if (
          selectCats.length > 0 &&
          !selectCats.includes(listing.category)
        ) {
          return;
        }

        const products = document.createElement("div");
        products.className = "productItems";
        products.innerHTML = `
          <img src="${listing.image}" alt="${listing.title}" onerror="this.src=">
          <p>${listing.title}</p>
          <p class="price">$${listing.price}</p>
        `;

        products.addEventListener("click", () => {
          window.location.href = `product.html?id=${doc.id}&seller=${doc.ref.parent.parent.id}`;
        });

        grid.appendChild(products);
      });
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      loading.style.display = "none";
    }
  }

  pfilter.addEventListener("click", () => {
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    if (minPrice > maxPrice) {
      console.warn("Minimum price can't be greater than maximum price.");
      return;
    }

    load(minPrice, maxPrice, inputS.value.trim());
  });

  bsearch.addEventListener("click", () => {
    load(0, Infinity, inputS.value.trim());
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in:", user.email);
    } else {
      console.warn("User not logged in.");
    }
  });

  load();
});



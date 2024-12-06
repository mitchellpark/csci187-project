document.addEventListener("DOMContentLoaded", () => {
    const ccart = document.getElementById("cartItems");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        ccart.innerHTML = "";

        if (cart.length === 0) {
            ccart.innerHTML = "<p>Cart is empty.</p>";
            return;
        }

        cart.forEach((item, index) => {
            const cartprod = document.createElement("div");
            cartprod.className = "cartproducts";
            cartprod.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cartproductsinfo">
                    <p><strong>Title:</strong> ${item.title}</p>
                    <p><strong>Price:</strong> $${item.price}</p>
                </div>
                <button class="remove-button" data-index="${index}">Remove</button>
            `;
            ccart.appendChild(cartprod);
        });

        document.querySelectorAll(".remove-button").forEach((button) => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                removeFromCart(index);
            });
        });
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    document.getElementById("checkoutButton").addEventListener("click", () => {
        window.location.href = "checkout.html";
    });

    renderCart();
});


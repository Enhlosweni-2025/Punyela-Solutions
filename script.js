// ----------------------
// CART FUNCTIONALITY
// ----------------------

// Load cart from localStorage or create empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQty;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Add product to cart
  function addToCart(product) {
    const existing = cart.find((item) => item.name === product.name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`${product.name} added to cart!`);
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Display cart items (only on cart.html)
  function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const totalPrice = document.getElementById("total-price");
    const payfastAmount = document.getElementById("payfast-amount");

    if (!cartItems) return; // Not on cart page

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
        <p><strong>${item.name}</strong> - R${item.price.toFixed(2)} × ${
          item.quantity
        }</p>
        <button class="btn remove-btn" data-index="${index}">Remove</button>
      `;
        cartItems.appendChild(div);
      });
    }

    totalPrice.textContent = total.toFixed(2);

    // ✅ Update PayFast hidden input with total
    if (payfastAmount) {
      payfastAmount.value = total.toFixed(2);
    }

    // Attach remove buttons
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let index = e.target.dataset.index;
        cart.splice(index, 1);
        saveCart();
        displayCart();
        updateCartCount();
      });
    });
  }

  // Handle Add to Cart buttons (on products and home)
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product");
      const name = productCard.querySelector("h3").textContent;
      const priceText = productCard.querySelector(".product-price").textContent;
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      const img = productCard.querySelector("img").src;

      addToCart({ name, price, img });
    });
  });

  // Initialize
  updateCartCount();
  displayCart();

  // Checkout button (on cart page)
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Checkout successful! Thank you for shopping with us.");
        cart = [];
        saveCart();
        displayCart();
        updateCartCount();
      }
    });
  }
});

const cars = [
    {
        id: 1,
        name: "Tesla Model S",
        category: "Sports",
        price: 199,
        image: "https://m.media-amazon.com/images/I/61g1mUPmfUL._AC_UF1000,1000_QL80_.jpg",
        description: "Electric performance collectible"
    },
    {
        id: 2,
        name: "Custom Datsun 240Z",
        category: "Classic",
        price: 249,
        image: "https://www.toycollectorsindia.com/cdn/shop/files/rn-image_picker_lib_temp_00006583-046b-4de6-b7d6-15c32a04c83d.png?v=1777805298",
        description: "Classic orange sports car"
    },
    {
        id: 3,
        name: "Mazda MX-5 Miata",
        category: "Sports",
        price: 179,
        image: "https://rukmini1.flixcart.com/image/1500/1500/xif0q/vehicle-pull-along/w/v/o/mazda-mx-5-miata-hw-dream-garage-2-5-gray-1-250-hot-wheels-2-original-imahgydvqduhpg5p.jpeg?q=70",
        description: "Compact roadster collectible"
    },
    {
        id: 4,
        name: "Racing Hatchback",
        category: "Racing",
        price: 219,
        image: "https://www.toycollectorsindia.com/cdn/shop/files/rn-image_picker_lib_temp_eed5770b-0cd5-483a-87d0-96ae54f47fa8.png?v=1777907816",
        description: "Racing-inspired miniature car"
    },
    {
        id: 5,
        name: "Yellow American Muscle Car",
        category: "Sports",
        price: 189,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9VJXJQjBEuzs9WMdPEXEzcYrbA184e_1OBUVcmfrun5oh-8Oz3P3HkR0&s=10",
        description: "Yellow Muscle Car"
    }
];

// Format prices in Indian rupees.
function formatPrice(price) {
    return "₹" + price.toFixed(2);
}

// Get saved cart items.
function getCart() {
    return JSON.parse(localStorage.getItem("hwCart") || "[]");
}

// Save cart items in the browser.
function saveCart(cart) {
    localStorage.setItem("hwCart", JSON.stringify(cart));
    updateCartCount();
}

// Update the cart counter.
function updateCartCount() {
    const totalItems = getCart().reduce(
        (total, item) => total + item.qty,
        0
    );

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = totalItems;
    });
}

// Create one product card.
function createProductCard(car) {
    return `
        <div class="col-sm-6 col-lg-4">
            <div class="product-card">
                <div class="product-image">
                    <img
                        src="${car.image}"
                        alt="${car.name}"
                        onerror="this.alt='Car picture unavailable'"
                    >
                </div>

                <div class="product-details">
                    <span class="tag">${car.category.toUpperCase()}</span>

                    <h5 class="mt-2">${car.name}</h5>

                    <p class="muted">${car.description}</p>

                    <div class="d-flex justify-content-between
                                align-items-center gap-2">
                        <span class="price">${formatPrice(car.price)}</span>

                        <button
                            class="btn btn-hot"
                            onclick="addToCart(${car.id})">
                            Add to Cart +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Display products and apply search/category filters.
function displayCars() {
    const grid = document.getElementById("productGrid");

    if (!grid) return;

    const searchInput = document.getElementById("productSearch");
    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const activeFilter = document.querySelector(".filter-btn.active");
    const category = activeFilter
        ? activeFilter.dataset.category
        : "All";

    const filteredCars = cars.filter(car => {
        const matchesSearch = (
            car.name + " " + car.category
        ).toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || car.category === category;

        return matchesSearch && matchesCategory;
    });

    if (filteredCars.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <p class="muted">No cars found. Try another search.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredCars.map(createProductCard).join("");
}

// Add a car to the cart.
function addToCart(id) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id: id, qty: 1 });
    }

    saveCart(cart);
    alert("Car added to your cart!");
}

// Display cart items.
function displayCart() {
    const cartContainer = document.getElementById("cartItems");

    if (!cartContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="content-panel">
                <h4>Your garage is empty!</h4>
                <p class="muted">Add some cars to your collection.</p>
                <a class="btn btn-hot" href="shop.html">Shop Cars</a>
            </div>
        `;

        document.getElementById("cartTotal").textContent =
            formatPrice(0);

        return;
    }

    let total = 0;

    cartContainer.innerHTML = cart.map(item => {
        const car = cars.find(product => product.id === item.id);

        if (!car) return "";

        const subtotal = car.price * item.qty;
        total += subtotal;

        return `
            <div class="cart-row d-flex align-items-center
                        gap-3 mb-3">
                <img
                    class="cart-thumb"
                    src="${car.image}"
                    alt="${car.name}"
                >

                <div class="flex-grow-1">
                    <h5>${car.name}</h5>
                    <p class="price mb-1">${formatPrice(car.price)}</p>
                    <p class="muted mb-0">Quantity: ${item.qty}</p>
                    <p class="muted mb-0">Subtotal: ${formatPrice(subtotal)}</p>
                </div>

                <button
                    class="btn btn-outline-danger"
                    onclick="removeFromCart(${car.id})">
                    Remove
                </button>
            </div>
        `;
    }).join("");

    document.getElementById("cartTotal").textContent =
        formatPrice(total);
}

// Remove a car from the cart.
function removeFromCart(id) {
    const updatedCart = getCart().filter(item => item.id !== id);

    saveCart(updatedCart);
    displayCart();
}

// Set up search, filters and demo forms.
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    displayCars();
    displayCart();

    const searchInput = document.getElementById("productSearch");

    if (searchInput) {
        searchInput.addEventListener("input", displayCars);
    }

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".filter-btn").forEach(filter => {
                filter.classList.remove("active");
            });

            this.classList.add("active");
            displayCars();
        });
    });

    const checkoutButton = document.getElementById("checkoutBtn");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", function () {
            if (getCart().length === 0) {
                alert("Your cart is empty!");
            } else {
                alert("This is a demo checkout. No real payment is processed.");
            }
        });
    }

    document.querySelectorAll("[data-demo-form]").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Demo form submitted. No data has been sent or saved.");
            form.reset();
        });
    });
});

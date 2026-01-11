const products=[
{id:1,name:"Wireless Headphones",price:2999,image:"https://picsum.photos/300/200?random=1",category:"Electronics",rating:4.8,sold:"1.2k", images: ["https://picsum.photos/300/200?random=1", "https://picsum.photos/300/200?random=101", "https://picsum.photos/300/200?random=102"]},
{id:2,name:"Smart Watch",price:4999,image:"https://picsum.photos/300/200?random=2",category:"Electronics",rating:4.7,sold:"850"},
{id:3,name:"Gaming Mouse",price:1499,image:"https://picsum.photos/300/200?random=3",category:"Accessories",rating:4.9,sold:"2.1k"},
{id:4,name:"Bluetooth Speaker",price:1999,image:"https://picsum.photos/300/200?random=4",category:"Electronics",rating:4.6,sold:"500+"},
{id:5,name:"Laptop Stand",price:999,image:"https://picsum.photos/300/200?random=5",category:"Accessories",rating:4.5,sold:"3.5k"},
{id:6,name:"USB Flash Drive",price:499,image:"https://picsum.photos/300/200?random=6",category:"Accessories",rating:4.7,sold:"10k+"},
{id:7,name:"Wireless Earbuds",price:2499,image:"https://picsum.photos/300/200?random=7",category:"Electronics",rating:4.8,sold:"5k+"},
{id:8,name:"Mechanical Keyboard",price:3999,image:"https://picsum.photos/300/200?random=8",category:"Accessories",rating:4.9,sold:"1.5k"},
{id:9,name:"Phone Case",price:299,image:"https://picsum.photos/300/200?random=9",category:"Accessories",rating:4.4,sold:"8k+"},
{id:10,name:"Tablet",price:8999,image:"https://picsum.photos/300/200?random=10",category:"Electronics",rating:4.6,sold:"300+"},
{id:11,name:"Power Bank",price:1299,image:"https://picsum.photos/300/200?random=11",category:"Accessories",rating:4.7,sold:"4.2k"},
{id:12,name:"Smartphone",price:15999,image:"https://picsum.photos/300/200?random=12",category:"Electronics",rating:4.8,sold:"1k+"},
{id:13,name:"Gaming Chair",price:8500,image:"https://picsum.photos/300/200?random=13",category:"Accessories",rating:4.7,sold:"200+"},
{id:14,name:"Webcam HD",price:1800,image:"https://picsum.photos/300/200?random=14",category:"Electronics",rating:4.5,sold:"1.1k"},
{id:15,name:"Monitor 24\"",price:7500,image:"https://picsum.photos/300/200?random=15",category:"Electronics",rating:4.8,sold:"900+"},
{id:16,name:"Mousepad RGB",price:650,image:"https://picsum.photos/300/200?random=16",category:"Accessories",rating:4.6,sold:"3k+"}
];

let cart=JSON.parse(localStorage.getItem("cart"))||[];
let wishlist=JSON.parse(localStorage.getItem("wishlist"))||[];
let filteredProducts=products;

const productContainer=document.getElementById("productContainer");
const searchInput=document.getElementById("searchInput");
const categoryButtons=document.querySelectorAll(".category-btn");
const sortSelect=document.getElementById("sortSelect");
const cartModal=document.getElementById("cartModal");
const cartItems=document.getElementById("cartItems");
const cartCount=document.getElementById("cartCount");
const totalPrice=document.getElementById("totalPrice");
const wishlistBtn=document.getElementById("wishlistBtn");
const wishlistCount=document.getElementById("wishlistCount");
const wishlistModal=document.getElementById("wishlistModal");
const wishlistItemsContainer=document.getElementById("wishlistItemsContainer");
const productModal=document.getElementById("productModal");
const zoomContainer=document.getElementById("zoomContainer");
const carouselThumbnails=document.getElementById("carouselThumbnails");
const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");
const modalImage=document.getElementById("modalImage");
const modalName=document.getElementById("modalName");
const modalPrice=document.getElementById("modalPrice");
const modalStats=document.getElementById("modalStats");
const modalCategory=document.getElementById("modalCategory");
const modalQty=document.getElementById("modalQty");
const relatedProductsContainer=document.getElementById("relatedProductsContainer");
let currentProductImages = [];
let currentImageIndex = 0;
let currentModalProductId = null;

function renderProducts(filteredProducts = products){
productContainer.innerHTML="";
filteredProducts.forEach(p=>{
productContainer.innerHTML+=`
<div class="product">
<img src="${p.image}" onclick="openProductModal(${p.id})" style="cursor:pointer;">
<h3>${p.name}</h3>
<div class="product-meta">
    <span class="price">₱${p.price}</span>
    <span class="stats"><span class="stars">★</span> ${p.rating} | ${p.sold} sold</span>
</div>
<div class="quantity-controls">
    <label>Qty:</label>
    <input type="number" min="1" value="1" id="qty-${p.id}">
</div>
<button onclick="addToCart(${p.id})">Add to Cart</button>
</div>`;
});
}

function addToCart(id){
const product=products.find(p=>p.id===id);
const qtyInput = document.getElementById(`qty-${id}`);
const qty = qtyInput ? parseInt(qtyInput.value) : 1;
const existingItem = cart.find(item => item.id === id);

if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + qty;
} else {
    cart.push({ ...product, quantity: qty });
}

localStorage.setItem("cart",JSON.stringify(cart));
updateCart();
showToast(`${product.name} (x${qty}) added to cart!`);
}

function removeFromCart(id){
cart = cart.filter(item => item.id !== id);
localStorage.setItem("cart",JSON.stringify(cart));
updateCart();
}

function updateQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    }
}

function updateCart(){
const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
cartCount.innerText = totalItems;
cartItems.innerHTML="";
let total=0;
cart.forEach((item)=>{
const qty = item.quantity || 1;
const itemTotal = item.price * qty;
total += itemTotal;
cartItems.innerHTML+=`
<div class="cart-item">
    <img src="${item.image}" alt="${item.name}">
    <div class="item-info">
        <h4>${item.name}</h4>
        <p>₱${item.price} x ${qty} = <strong>₱${itemTotal}</strong></p>
    </div>
    <div class="item-controls">
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${qty}</span>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
    </div>
</div>`;
});
totalPrice.innerText=total;
}

document.getElementById("cartBtn").onclick=()=>{
cartModal.style.display="flex";
updateCart();
}

function openWishlist() {
    renderWishlist();
    wishlistModal.style.display = "flex";
}

function closeWishlist() {
    wishlistModal.style.display = "none";
}

function renderWishlist() {
    wishlistItemsContainer.innerHTML = "";
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = "<p style='text-align:center; color:#666;'>Your wishlist is empty.</p>";
        return;
    }
    wishlist.forEach(item => {
        wishlistItemsContainer.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="price">₱${item.price}</p>
            </div>
            <div class="item-controls">
                <button onclick="moveToCart(${item.id})" class="move-btn">Move to Cart</button>
                <button onclick="removeFromWishlist(${item.id})" class="remove-btn">Remove</button>
            </div>
        </div>`;
    });
}

function moveToCart(id) {
    const product = wishlist.find(p => p.id === id);
    if (product) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
        removeFromWishlist(id);
        showToast(`${product.name} moved to cart!`);
    }
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlist();
}

function closeCart(){
cartModal.style.display="none";
}

function openProductModal(id){
    const product = products.find(p => p.id === id);
    if(product){
        currentModalProductId = id;
        currentProductImages = product.images || [product.image];
        currentImageIndex = 0;
        updateCarousel();
        modalImage.alt = product.name;
        modalName.innerText = product.name;
        modalPrice.innerText = `₱${product.price}`;
        modalStats.innerHTML = `<span style="color:#ffc107">★ ${product.rating}</span> | ${product.sold} sold`;
        modalCategory.innerText = `Category: ${product.category}`;
        modalQty.value = 1;

        // Render Related Products
        const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
        relatedProductsContainer.innerHTML = related.map(p => `
            <div class="related-product-card" onclick="openProductModal(${p.id})">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₱${p.price}</p>
            </div>
        `).join("");

        productModal.style.display = "flex";
    }
}

function changeImage(step) {
    currentImageIndex += step;
    if (currentImageIndex < 0) currentImageIndex = currentProductImages.length - 1;
    if (currentImageIndex >= currentProductImages.length) currentImageIndex = 0;
    updateCarousel();
}

function setImage(index) {
    currentImageIndex = index;
    updateCarousel();
}

function updateCarousel() {
    modalImage.src = currentProductImages[currentImageIndex];
    
    // Toggle arrows based on image count
    const display = currentProductImages.length > 1 ? 'flex' : 'none';
    if(prevBtn) prevBtn.style.display = display;
    if(nextBtn) nextBtn.style.display = display;

    // Update thumbnails
    carouselThumbnails.innerHTML = currentProductImages.length > 1 ? currentProductImages.map((img, idx) => 
        `<img src="${img}" class="thumbnail ${idx === currentImageIndex ? 'active' : ''}" onclick="setImage(${idx})" alt="Thumbnail">`
    ).join('') : '';
}

function closeProductModal(){
    productModal.style.display = "none";
}

function addToCartFromModal(){
    if(currentModalProductId){
        const qty = parseInt(modalQty.value);
        const product = products.find(p => p.id === currentModalProductId);
        const existingItem = cart.find(item => item.id === currentModalProductId);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + qty;
        } else {
            cart.push({ ...product, quantity: qty });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
        showToast(`${product.name} (x${qty}) added to cart!`);
        closeProductModal();
    }
}

function addToWishlistFromModal(){
    if(currentModalProductId){
        const product = products.find(p => p.id === currentModalProductId);
        if (!wishlist.find(p => p.id === product.id)) {
            wishlist.push(product);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistCount();
            
            // Animate badge
            const badge = document.getElementById("wishlistCount");
            badge.classList.remove("pop");
            void badge.offsetWidth; // Trigger reflow to restart animation
            badge.classList.add("pop");

            showToast("Added to wishlist!");
        } else {
            showToast("Already in your wishlist!");
        }
        closeProductModal();
    }
}

function checkout(){
if(cart.length===0){
alert("Your cart is empty!");
return;
}
alert(`Checkout successful! Total: ₱${totalPrice.innerText}`);
cart=[];
localStorage.setItem("cart",JSON.stringify(cart));
updateCart();
closeCart();
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function updateWishlistCount() {
    if(wishlistCount) wishlistCount.innerText = wishlist.length;
}

function clearCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategoryBtn = document.querySelector(".category-btn.active");
    const activeCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : "all";
    const sortValue = sortSelect.value;

    // Filter by search term and category
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort the filtered results
    if (sortValue === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else {
        filteredProducts.sort((a, b) => a.id - b.id); // Default to ID
    }

    renderProducts(filteredProducts);
}

function filterProducts() { applyFilters(); }
function sortProducts() { applyFilters(); }
function filterByCategory(e) {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    applyFilters();
}

if (zoomContainer) {
    zoomContainer.addEventListener("mousemove", function(e) {
        const { left, top, width, height } = zoomContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        modalImage.style.transformOrigin = `${x}% ${y}%`;
        modalImage.style.transform = "scale(2)";
    });

    zoomContainer.addEventListener("mouseleave", function() {
        modalImage.style.transformOrigin = "center center";
        modalImage.style.transform = "scale(1)";
    });
}

searchInput.addEventListener("input",filterProducts);
categoryButtons.forEach(btn=>btn.addEventListener("click",filterByCategory));
sortSelect.addEventListener("change",sortProducts);
wishlistBtn.addEventListener("click", openWishlist);

renderProducts();
updateCart();
updateWishlistCount();

// ====== PRODUTOS ======
const products = [
    { id: 1, name: "Gloss Dream Safira", price: 15.90, image: "img/d160bb94-3c09-4014-817a-5dee7c7df901.jpeg", stock: 0 },
    { id: 2, name: "Blush Safira Cores Variadas", price: 19.90, image: "img/179691af-2ffe-4378-b356-1fab83238041.jpeg", stock: 5 },
    { id: 3, name: "Iluminador Safira Cores Variadas", price: 13.90, image: "img/652ff3fb-9658-4305-b56b-0f8addd8934c.jpeg", stock: 5 },
    { id: 4, name: "Máscara de Cílios Efeito Boneca Safira", price: 14.90, image: "img/a5d9b425-dad8-4be2-a277-d14e0511435e.jpeg", stock: 0 },
    { id: 5, name: "Base líquida SARAH`S BEAUTY", price: 14.90, image: "img/unnamed.jpg", stock: 6 },
    { id: 6, name: "Paleta de iluminador LOVE-max Love", price: 19.90, image: "img/775392d6-299c-4535-8f79-4dc112f15cfe.jpeg", stock: 3 },
    { id: 7, name: "Corretivo Líquido Lua & Neve", price: 14.90, image: "img/cb9c3f40-ece2-41ab-923c-90b0bd6105e2.jpeg", stock: 6 },
    { id: 8, name: "Pó Facial Rosa MOsqueta Fenzza", price: 14.90, image: "img/unnamed (1).jpg", stock: 2 },
    { id: 9, name: "Pó Facial Peach Power-Dapop", price: 14.90, image: "img/unnamed (2).jpg", stock: 2 },
    { id: 10, name: "Lip Gloss Hudavioji", price: 19.90, image: "img/lip_gloss_chaveiro_cor_01_a_06_com_24un_de_10ml_hudamoji_22833_2_913f56393de86b5f05b7f3cf1b13fa6f.webp", stock: 6 }
];

let cart = [];

// ====== FUNÇÕES PRODUTOS ======
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        const isOutOfStock = product.stock === 0;
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h2 class="product-name">${product.name}</h2>
            <span class="product-price">R$ ${product.price.toFixed(2)}</span>
            <div class="stock-info">${product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}</div>
            <button class="add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}" onclick="addToCart(${product.id})" ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        product.stock--;
        const cartItem = cart.find(item => item.id === productId);
        if(cartItem) cartItem.quantity++;
        else cart.push({ ...product, quantity: 1 });
        updateCart();
        renderProducts();
    }
}

// ====== ALTERAR QUANTIDADE NO CARRINHO ======
function changeCartQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if(cartItem) {
        // Se aumentar, verifica se tem estoque
        if(change > 0 && product.stock > 0) {
            cartItem.quantity++;
            product.stock--;
        }

        // Se reduzir
        if(change < 0) {
            cartItem.quantity--;
            product.stock++;
            if(cartItem.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
    }

    updateCart();
    renderProducts();
}

// ====== UPDATE CART ======
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartSidebar = document.getElementById('cart-items');
    const finishBtn = document.getElementById('finish-btn');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = totalPrice.toFixed(2);

    cartSidebar.innerHTML = '';
    if(cart.length === 0) cartSidebar.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
    else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <div class="cart-controls">
                    <button class="cart-btn" onclick="changeCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-btn" onclick="changeCartQuantity(${item.id}, 1)">+</button>
                </div>
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartSidebar.appendChild(cartItem);
        });
    }

    finishBtn.disabled = cart.length === 0;
}

// ====== CARRINHO ======
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');

cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// ====== BANNER ======
const slides = document.querySelector('.banner-carousel .slides');
const totalSlides = slides.children.length;
const dots = document.querySelectorAll('.banner-carousel .dot');
let currentSlide = 0;
let slideInterval = setInterval(nextSlide, 3000);

function updateSlide() {
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide();
}

dots.forEach((dot, i) => dot.addEventListener('click', () => { currentSlide = i; updateSlide(); resetInterval(); }));
document.querySelector('.banner-carousel .next').addEventListener('click', () => { nextSlide(); resetInterval(); });
document.querySelector('.banner-carousel .prev').addEventListener('click', () => { prevSlide(); resetInterval(); });

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
}

// ====== FINALIZAR COMPRA WHATSAPP ======
document.getElementById("finish-btn").addEventListener("click", () => {
    if(cart.length === 0) return;

    let message = "Olá, Samya quero finalizar minha compra da Shinny You:\n";
    cart.forEach(item => {
        message += `- ${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    message += `Total: R$ ${total}\n`;
   

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5545998011346?text=${encodedMessage}`, "_blank");
});

// ====== INICIALIZAÇÃO ======
renderProducts();
updateCart();
updateSlide();

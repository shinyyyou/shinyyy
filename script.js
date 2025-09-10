// Product data
const products = [
  {
    id: 1,
    name: "Gloss Dream Safira",
    price: 15.90,
    image: "img/d160bb94-3c09-4014-817a-5dee7c7df901.jpeg",
    stock: 0  // Define o estoque corretamente
  },
  {
    id: 2,
    name: "Blush Safira Cores Variadas",
    price: 19.90,
    image: "img/179691af-2ffe-4378-b356-1fab83238041.jpeg",
    stock: 5  // Define o estoque corretamente
  },
  {
    id: 3,
    name: "Iluminador Safira Cores Variadas",
    price: 13.90,
    image: "img/652ff3fb-9658-4305-b56b-0f8addd8934c.jpeg",
    stock: 5  // Define o estoque corretamente
  },
  {
    id: 4,
    name: "Máscara de Cílios Efeito Boneca Safira",
    price: 14.90,
    image: "img/a5d9b425-dad8-4be2-a277-d14e0511435e.jpeg",
    stock: 0  // Define o estoque corretamente
  },
  {
    id: 5,
    name: "Base líquida SARAH`S BEAUTY ",
    price: 14.90,
    image: "img/unnamed.jpg",
    stock: 6  // Define o estoque corretamente
  },
  {
    id: 6,
    name: "Paleta de iluminador LOVE-max Love  ",
    price: 19.90,
    image: "img/775392d6-299c-4535-8f79-4dc112f15cfe.jpeg",
    stock: 3  // Define o estoque corretamente
  },
  {
    id: 7,
    name: "Corretivo Líquido Lua & Neve",
    price: 14.90,
    image: "img/cb9c3f40-ece2-41ab-923c-90b0bd6105e2.jpeg",
    stock: 6  // Define o estoque corretamente
  },
  {
    id: 8,
    name: "Pó Facial Rosa MOsqueta Fenzza",
    price: 14.90,
    image: "img/unnamed(1).jpg",
    stock: 2  // Define o estoque corretamente
  },
  {
    id: 9,
    name: "Pó Facial Peach Power-Dapop",
    price: 14.90,
    image: "img/unnamed(2).jpg",
    stock: 2  // Define o estoque corretamente
  },
  {
    id: 10,
    name: "Lip Gloss Hudavioji",
    price: 19.90,  // Corrigi o valor do preço, você usou vírgula ao invés de ponto
    image: "img/unnamed(3).jpg",
    stock: 6  // Define o estoque corretamente
  }
];

// Cart state
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const finishBtn = document.getElementById('finish-btn');
const emptyCart = document.getElementById('empty-cart');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    console.log('Products:', products);
    console.log('Products grid element:', productsGrid);
    
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        renderProducts();
        updateCartUI();
    }, 100);
    
    // Event listeners
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (finishBtn) finishBtn.addEventListener('click', finishPurchase);
});

// Render products
function renderProducts() {
    console.log('Rendering products...');
    
    if (!productsGrid) {
        console.error('Products grid element not found!');
        return;
    }
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        console.log('Creating product card for:', product.name);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const isOutOfStock = product.stock === 0;
        const stockDisplay = product.stock <= 3 ? `Apenas ${product.stock} restantes!` : `${product.stock} em estoque`;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="console.error('Failed to load image: ${product.image}')">
            <h2 class="product-name">${product.name}</h2>
            <span class="product-price">R$ ${product.price.toFixed(2)}</span>
            <div class="stock-info ${product.stock <= 3 ? 'low-stock' : ''} ${isOutOfStock ? 'out-of-stock' : ''}">
                ${isOutOfStock ? 'Fora de estoque' : stockDisplay}
            </div>
            <button class="add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}" 
                    onclick="addToCart(${product.id})" 
                    ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
    
    console.log('Products rendered successfully');
}

// Add product to cart
function addToCart(productId) {
    console.log('Adding product to cart:', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    if (product.stock === 0) {
        showToast('Produto indisponível', 'Este produto está fora de estoque');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    
    if (currentQuantityInCart >= product.stock) {
        showToast('Quantidade máxima atingida', `Você já tem todo o estoque disponível deste produto no carrinho`);
        return;
    }
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast('Produto adicionado!', `${product.name} foi adicionado ao carrinho`);
    }
    
    // Update stock
    product.stock -= 1;
    
    updateCartUI();
    renderProducts(); // Re-render to update stock display
}

// Remove product from cart
function removeFromCart(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        // Return stock
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock += cartItem.quantity;
        }
    }
    
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderProducts(); // Re-render to update stock display
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    
    // Update finish button state
    if (finishBtn) finishBtn.disabled = cart.length === 0;
    
    // Render cart items
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    if (!cartItems) return;

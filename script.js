// Product data
const products = [
  {
    id: 1,
    name: "Gloss Dream Safira",
    price: 15.90,
    image: "img/d160bb94-3c09-4014-817a-5dee7c7df901.jpeg",
    stock: 2
  },
  {
    id: 2,
    name: "Blush Safira Cores Variadas",
    price: 21.90,
    image: "img/179691af-2ffe-4378-b356-1fab83238041.jpeg",
    stock: 8
  },
  {
    id: 3,
    name: "Iluminador Safira Cores Variadas",
    price: 13.90,
    image: "img/652ff3fb-9658-4305-b56b-0f8addd8934c.jpeg",
    stock: 8
  },
  {
    id: 4,
    name: "Máscara de Cílios Efeito Boneca Safira",
    price: 14.90,
    image: "img/a5d9b425-dad8-4be2-a277-d14e0511435e.jpeg",
    stock: 2
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
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">R$ ${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                Remover
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Open cart
function openCart() {
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close cart
function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Finish purchase
function finishPurchase() {
    if (cart.length === 0) {
        showToast('Carrinho vazio', 'Adicione algum produto.');
        return;
    }
    
    // Create WhatsApp message
    let message = 'Olá! Gostaria de finalizar a compra dos seguintes produtos na Shinny You:\n\n';
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} (R$${item.price.toFixed(2)} cada)\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: R$${total.toFixed(2)}`;
    
    // Open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5545991013391?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showToast('Pedido encaminhado!', 'Agora é só concluir pelo WhatsApp 😉');
    
    // Clear cart and close sidebar
    cart = [];
    updateCartUI();
    closeCart();
}

// Show toast notification
function showToast(title, description) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Handle keyboard events
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCart();
    }
});
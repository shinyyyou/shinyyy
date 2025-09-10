// Product data
const products = [
  {
    id: 1,
    name: "Gloss Dream Safira",
    price: 15.90,
    image: "img/d160bb94-3c09-4014-817a-5dee7c7df901.jpeg",
    stock: 0
  },
  {
    id: 2,
    name: "Blush Safira Cores Variadas",
    price: 19.90,
    image: "img/179691af-2ffe-4378-b356-1fab83238041.jpeg",
    stock: 5
  },
  {
    id: 3,
    name: "Iluminador Safira Cores Variadas",
    price: 13.90,
    image: "img/652ff3fb-9658-4305-b56b-0f8addd8934c.jpeg",
    stock: 5
  },
  {
    id: 4,
    name: "Máscara de Cílios Efeito Boneca Safira",
    price: 14.90,
    image: "img/a5d9b425-dad8-4be2-a277-d14e0511435e.jpeg",
    stock: 0
  },
  {
    id: 5,
    name: "Base líquida SARAH`S BEAUTY ",
    price: 14.90,
    image: "img/unnamed.jpg",
    stock: 6
  },
  {
    id: 6,
    name: "Paleta de iluminador LOVE-max Love  ",
    price: 19.90,
    image: "img/775392d6-299c-4535-8f79-4dc112f15cfe.jpeg",
    stock: 3
  },
  {
    id: 7,
    name: "Corretivo Líquido Lua & Neve",
    price: 14.90,
    image: "img/cb9c3f40-ece2-41ab-923c-90b0bd6105e2.jpeg",
    stock: 6
  },
  {
    id: 8,
    name: "Pó Facial Rosa MOsqueta Fenzza",
    price: 14.90,
    image: "img/unnamed(1).jpg",
    stock: 2
  },
  {
    id: 9,
    name: "Pó Facial Peach Power-Dapop",
    price: 14.90,
    image: "img/unnamed(2).jpg",
    stock: 2
  },
  {
    id: 10,
    name: "Lip Gloss Hudavioji",
    price: 19.90,
    image: "img/unnamed(3).jpg",
    stock: 6
  }
];

// Cart state
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid'); // A referência ao grid de produtos
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
    
    // Verifique se o 'productsGrid' existe
    if (productsGrid) {
        console.log('Elemento "products-grid" encontrado!');
    } else {
        console.error('Elemento "products-grid" não encontrado!');
    }
    
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
    
    productsGrid.innerHTML = ''; // Limpar o grid antes de renderizar os produtos
    
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

// ============================================
// CART SYSTEM
// ============================================
let cart = [];

function updateCartStorage() {
    localStorage.setItem('routineCart', JSON.stringify(cart));
    updateCartCounter();
    renderCart();
}

function updateCartCounter() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.innerText = totalItems;
}

function addToCart(cardElement) {
    const id = parseInt(cardElement.dataset.id);
    const name = cardElement.dataset.name;
    const price = parseFloat(cardElement.dataset.price);
    const image = cardElement.dataset.image;
    
    const product = { id, name, price, image };
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartStorage();
    openCartNotification();
    
    const btn = cardElement.querySelector('.btn-comprar');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Added! <i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 1000);
    }
}

function openCartNotification() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }
}

function removeCartItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCartStorage();
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const totalSpan = document.getElementById('cartTotalPrice');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-box-open"></i><p>Your cart is empty</p></div>`;
        if (totalSpan) totalSpan.innerText = "$0.00";
        return;
    }
    
    let html = '';
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div>Qty: ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    });
    container.innerHTML = html;
    if (totalSpan) totalSpan.innerText = `$${total.toFixed(2)}`;
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            removeCartItem(id);
        });
    });
}

function loadSavedCart() {
    const saved = localStorage.getItem('routineCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCounter();
        renderCart();
    }
}

// ============================================
// EVENT LISTENERS PARA OS PRODUTOS
// ============================================
function initProductButtons() {
    const productCards = document.querySelectorAll('.produto-card');
    productCards.forEach(card => {
        const btn = card.querySelector('.btn-comprar');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(card);
            });
        }
    });
}

// ============================================
// EVENT LISTENERS GERAIS
// ============================================
function initEventListeners() {
    // Cart open/close
    const cartIcon = document.getElementById('cartIcon');
    const closeCart = document.getElementById('closeCartBtn');
    const overlay = document.getElementById('cartOverlay');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            const sidebar = document.getElementById('cartSidebar');
            const overlayEl = document.getElementById('cartOverlay');
            if (sidebar && overlayEl) {
                sidebar.classList.add('open');
                overlayEl.classList.add('active');
            }
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            const sidebar = document.getElementById('cartSidebar');
            const overlayEl = document.getElementById('cartOverlay');
            if (sidebar && overlayEl) {
                sidebar.classList.remove('open');
                overlayEl.classList.remove('active');
            }
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            const sidebar = document.getElementById('cartSidebar');
            if (sidebar && overlay) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    }
    
    // Mobile menu
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                navLinks.classList.remove('show');
            } else {
                navLinks.style.display = 'flex';
                navLinks.classList.add('show');
            }
        });
    }
    
    // Checkout button
    const checkout = document.getElementById('finalizarBtn');
    if (checkout) {
        checkout.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty :(");
                return;
            }
            const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            alert(`✨ Order placed! Total: $${total.toFixed(2)}\nThanks for choosing My Routine!`);
            cart = [];
            updateCartStorage();
            renderCart();
            const sidebar = document.getElementById('cartSidebar');
            const overlayEl = document.getElementById('cartOverlay');
            if (sidebar && overlayEl) {
                sidebar.classList.remove('open');
                overlayEl.classList.remove('active');
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const msg = document.getElementById('contactMsg').value.trim();
            if (name && email && msg) {
                alert(`Thanks ${name}! We'll help you build a better routine.`);
                contactForm.reset();
            } else {
                alert("Please fill in all fields.");
            }
        });
    }
}

function adjustMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768) {
        if (navLinks) navLinks.style.display = 'flex';
    } else {
        if (navLinks) navLinks.style.display = 'none';
    }
}

window.addEventListener('resize', adjustMobileMenu);

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initProductButtons();
    loadSavedCart();
    initEventListeners();
    adjustMobileMenu();
});
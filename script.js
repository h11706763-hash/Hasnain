window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    // For pages with active-nav always on, don't change background transparency as much but padding
    if (document.querySelector('.active-nav') && window.scrollY <= 50) {
        navbar.style.padding = '1rem 5%';
        return;
    }
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.padding = '1rem 5%';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.85)';
        navbar.style.padding = '1.5rem 5%';
    }
});

// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // If on cart page, render items
    if(document.getElementById('cart-items-container')) {
        renderCartItems();
    }
    
    // Listen to size btn clicks on product details
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
});

function addToCart(title, price, image) {
    let size = 'M';
    const activeSizeBtn = document.querySelector('.size-btn.active');
    if (activeSizeBtn) size = activeSizeBtn.innerText;

    let quantity = 1;
    const qtyInput = document.querySelector('.quantity-selector input');
    if (qtyInput) quantity = parseInt(qtyInput.value);

    const product = { title, price, image, size, quantity };
    
    let cart = JSON.parse(localStorage.getItem('suitBazarCart')) || [];
    let existing = cart.find(item => item.title === title && item.size === size);
    
    if(existing) {
        existing.quantity += quantity;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('suitBazarCart', JSON.stringify(cart));
    updateCartBadge();
    showToast("Added to cart successfully!");
}

function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('suitBazarCart')) || [];
    let count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    let cart = JSON.parse(localStorage.getItem('suitBazarCart')) || [];
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p><a href="index.html#collection" class="btn">Continue Shopping</a>';
        document.getElementById('cart-subtotal').innerText = 'Rs. 0';
        document.getElementById('cart-total').innerText = 'Rs. 0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p>Size: ${item.size}</p>
                    <p class="item-price">Rs. ${item.price.toLocaleString()}</p>
                </div>
                <div class="item-quantity">
                    <button type="button" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="item-total">
                    Rs. ${itemTotal.toLocaleString()}
                </div>
                <button type="button" class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('cart-subtotal').innerText = `Rs. ${total.toLocaleString()}`;
    document.getElementById('cart-total').innerText = `Rs. ${total.toLocaleString()}`;
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('suitBazarCart')) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('suitBazarCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('suitBazarCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('suitBazarCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
    showToast("Item removed from cart");
}

function processCheckout(event) {
    event.preventDefault();
    let cart = JSON.parse(localStorage.getItem('suitBazarCart')) || [];
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    
    // Simulate order placed
    localStorage.removeItem('suitBazarCart');
    updateCartBadge();
    renderCartItems();
    
    // Change layout to success message
    const layout = document.querySelector('.cart-layout');
    layout.innerHTML = `
        <div style="text-align: center; width: 100%; padding: 4rem 0;">
            <i class="fas fa-check-circle" style="font-size: 4rem; color: #4caf50; margin-bottom: 1rem;"></i>
            <h2>Order Placed Successfully!</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Thank you for shopping with Suit Bazar. Your order is being processed.</p>
            <a href="index.html" class="btn">Return to Home</a>
        </div>
    `;
    
    // Optional form reset
    event.target.reset();
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

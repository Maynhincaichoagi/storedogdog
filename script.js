// --- FILE: script.js ---

// 1. Dữ liệu mặc định (Sẽ hiện ra nếu chưa có gì trong kho lưu trữ)
const defaultProducts = [
    { id: 1, name: "Giày Sneaker Sport", price: 500000, img: "https://via.placeholder.com/250" },
    { id: 2, name: "Áo Thun Basic", price: 150000, img: "https://via.placeholder.com/250" },
    { id: 3, name: "Đồng Hồ Thông Minh", price: 1200000, img: "https://via.placeholder.com/250" },
    { id: 4, name: "Tai Nghe Bluetooth", price: 350000, img: "https://via.placeholder.com/250" },
    // MÓN HÀNG BẠN YÊU CẦU:
    { id: 99, name: "Thịt gâu gâu", price: 1, img: "anh-san-pham.jpg" } 
];

// 2. Hàm lấy sản phẩm (Ưu tiên lấy từ LocalStorage nếu Admin đã sửa)
function getProducts() {
    const stored = localStorage.getItem('myProducts');
    if (!stored) {
        // Nếu chưa có dữ liệu cũ, lưu danh sách mặc định (có món gâu gâu) vào
        localStorage.setItem('myProducts', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(stored);
}

let cart = [];
let products = getProducts();

// 3. Hiển thị sản phẩm ra màn hình
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    // Load lại dữ liệu mới nhất
    products = getProducts();

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${parseInt(product.price).toLocaleString('vi-VN')}đ</div>
                <button class="btn-add" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
}

// 4. Thêm vào giỏ hàng
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    toggleCart(true); 
}

// 5. Cập nhật giao diện giỏ hàng
function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if(cartCountEl) cartCountEl.innerText = totalCount;

    const cartItemsContainer = document.getElementById('cartItems');
    if(cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Giỏ hàng trống</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${parseInt(item.price).toLocaleString('vi-VN')}đ x ${item.quantity}</small>
                    </div>
                    <div style="display:flex; align-items:center;">
                        <span style="font-weight:bold; color:var(--primary-color);">
                            ${(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                        <i class="fas fa-trash" 
                           style="color:red; margin-left:10px; cursor:pointer;" 
                           onclick="removeFromCart(${item.id})"></i>
                    </div>
                </div>
            `).join('');
        }
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPriceEl = document.getElementById('totalPrice');
    if(totalPriceEl) totalPriceEl.innerText = total.toLocaleString('vi-VN') + 'đ';
}

// 6. Xóa khỏi giỏ
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// 7. Bật/Tắt giỏ hàng
function toggleCart(forceOpen = false) {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    if (forceOpen) modal.classList.add('active');
    else modal.classList.toggle('active');
}

// 8. Thanh toán
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    alert(`Đã đặt hàng thành công!\nTổng tiền: ${document.getElementById('totalPrice').innerText}`);
    cart = [];
    updateCartUI();
    toggleCart();
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
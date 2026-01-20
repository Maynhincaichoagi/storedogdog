// --- FILE: script.js ---

// 1. DỮ LIỆU SẢN PHẨM (Đã thêm phần mô tả - desc)
const defaultProducts = [
    // --- MÓN CỦA BẠN (Đã cập nhật mô tả) ---
    { 
        id: 99, name: "Thịt gâu gâu", price: 1, img: "anh1.jpg", 
        desc: "Ngon từ thịt ngọt từ xương. Nhược điểm: Bệnh dại dễ tái phát." 
    },
    { 
        id: 100, name: "Noledaden", price: 1, img: "anh2.jpg", 
        desc: "camonvidaden" 
    }
];

// --- 2. HÀM LẤY DỮ LIỆU ---
function getProducts() {
    localStorage.clear(); // Xóa bộ nhớ cũ để cập nhật mô tả mới
    return defaultProducts;
}

let cart = [];
let products = getProducts();

// --- 3. HIỂN THỊ SẢN PHẨM ---
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    products = getProducts();

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}" class="product-img" onclick="openDetail(${product.id})" onerror="this.src='https://via.placeholder.com/250?text=Loi+Anh'">
            <div class="product-info">
                <div class="product-name" onclick="openDetail(${product.id})">${product.name}</div>
                <div class="product-price">${parseInt(product.price).toLocaleString('vi-VN')}đ</div>
                <button class="btn-add" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
}

// --- 4. XỬ LÝ XEM CHI TIẾT (Đã cập nhật để hiện mô tả) ---
function openDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('detailImg').src = product.img;
    document.getElementById('detailName').innerText = product.name;
    document.getElementById('detailPrice').innerText = parseInt(product.price).toLocaleString('vi-VN') + 'đ';
    
    // --- CẬP NHẬT DÒNG MÔ TẢ TẠI ĐÂY ---
    const descEl = document.getElementById('detailDesc');
    if (descEl) {
        descEl.innerText = product.desc || "Đang cập nhật...";
    }
    
    const btn = document.getElementById('detailBtnAdd');
    btn.onclick = function() { addToCart(product.id); closeDetail(); };

    document.getElementById('detailModal').classList.add('active');
}

function closeDetail() { document.getElementById('detailModal').classList.remove('active'); }
document.getElementById('detailModal')?.addEventListener('click', function(e) { if (e.target === this) closeDetail(); });

// --- 5. GIỎ HÀNG ---
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) existingItem.quantity += 1; else cart.push({ ...product, quantity: 1 });
    updateCartUI(); toggleCart(true); 
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = totalCount;
    const cartItemsContainer = document.getElementById('cartItems');
    if(cartItemsContainer) {
        if (cart.length === 0) cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Giỏ hàng trống</p>';
        else cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div><strong>${item.name}</strong><br><small>${parseInt(item.price).toLocaleString('vi-VN')}đ x ${item.quantity}</small></div>
                <div style="display:flex; align-items:center;"><span style="font-weight:bold; color:var(--primary-color);">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</span><i class="fas fa-trash" style="color:red; margin-left:10px; cursor:pointer;" onclick="removeFromCart(${item.id})"></i></div>
            </div>`).join('');
    }
    document.getElementById('totalPrice').innerText = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('vi-VN') + 'đ';
}

function removeFromCart(id) { cart = cart.filter(item => item.id !== id); updateCartUI(); }
function toggleCart(f) { const m = document.getElementById('cartModal'); if(m) { if(f) m.classList.add('active'); else m.classList.toggle('active'); } }
function checkout() { if (cart.length === 0) { alert("Giỏ hàng trống!"); return; } alert(`Đã đặt hàng!\nTổng: ${document.getElementById('totalPrice').innerText}`); cart = []; updateCartUI(); toggleCart(); }

document.addEventListener('DOMContentLoaded', () => { renderProducts(); });

// --- FILE: admin.js ---

// 1. Kiểm tra đăng nhập
function checkLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    if (u === 'admin' && p === '123456') {
        document.getElementById('loginOverlay').style.display = 'none';
        loadAdminProducts();
    } else {
        alert('Sai tài khoản hoặc mật khẩu!');
    }
}

function logout() {
    location.reload();
}

// 2. Quản lý dữ liệu
function getProducts() {
    const stored = localStorage.getItem('myProducts');
    return stored ? JSON.parse(stored) : [];
}

function saveProductsToStorage(products) {
    // Cảnh báo: LocalStorage có giới hạn (khoảng 5MB). Nếu ảnh quá nặng sẽ lỗi.
    try {
        localStorage.setItem('myProducts', JSON.stringify(products));
        loadAdminProducts();
    } catch (e) {
        alert("Lỗi: Ảnh quá nặng hoặc bộ nhớ đầy! Vui lòng chọn ảnh nhẹ hơn.");
    }
}

// 3. Hiển thị bảng
function loadAdminProducts() {
    const products = getProducts();
    const tbody = document.getElementById('adminProductList');
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.img}" class="img-preview-table" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>${p.name}</td>
            <td>${parseInt(p.price).toLocaleString('vi-VN')}đ</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// --- XỬ LÝ ẢNH (MỚI) ---
function previewImage() {
    const file = document.getElementById('fileInput').files[0];
    const previewBox = document.getElementById('previewBox');
    const previewImg = document.getElementById('previewImgSrc');
    const hiddenInput = document.getElementById('prodImgData');

    if (file) {
        // Kiểm tra kích thước (Nếu > 1MB thì cảnh báo)
        if (file.size > 1024 * 1024) {
            alert("Ảnh này hơi nặng (>1MB). Web có thể bị lag hoặc không lưu được. Hãy chọn ảnh nhẹ hơn!");
        }

        const reader = new FileReader();
        reader.onloadend = function() {
            previewBox.classList.add('has-img');
            previewImg.src = reader.result;
            hiddenInput.value = reader.result; // Lưu mã ảnh vào input ẩn
        }
        reader.readAsDataURL(file);
    } else {
        previewBox.classList.remove('has-img');
        previewImg.src = "";
        hiddenInput.value = "";
    }
}

// 4. Mở/Đóng Modal
function openModal(isEdit = false) {
    document.getElementById('editModal').classList.add('active');
    // Reset file input
    document.getElementById('fileInput').value = ""; 
    
    if (!isEdit) {
        document.getElementById('modalTitle').innerText = "Thêm Sản Phẩm Mới";
        document.getElementById('prodId').value = "";
        document.getElementById('prodName').value = "";
        document.getElementById('prodPrice').value = "";
        
        // Reset ảnh
        document.getElementById('prodImgData').value = "https://via.placeholder.com/250"; 
        document.getElementById('previewBox').classList.remove('has-img');
        document.getElementById('previewImgSrc').src = "";
    }
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

// 5. Lưu sản phẩm
function saveProduct() {
    const id = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    // Lấy dữ liệu ảnh từ input ẩn (đã được xử lý bởi hàm previewImage)
    const img = document.getElementById('prodImgData').value;

    if (!name || !price) {
        alert("Vui lòng điền tên và giá!");
        return;
    }
    
    // Nếu chưa chọn ảnh mới và đang thêm mới, dùng ảnh mặc định
    const finalImg = img || "https://via.placeholder.com/250";

    let products = getProducts();

    if (id) {
        // Sửa
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { id: parseInt(id), name, price: parseInt(price), img: finalImg };
        }
    } else {
        // Thêm mới
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price: parseInt(price), img: finalImg });
    }

    saveProductsToStorage(products);
    closeModal();
    alert("Đã lưu thành công!");
}

// 6. Đổ dữ liệu vào form để sửa
function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
        openModal(true);
        document.getElementById('modalTitle').innerText = "Sửa Sản Phẩm";
        document.getElementById('prodId').value = product.id;
        document.getElementById('prodName').value = product.name;
        document.getElementById('prodPrice').value = product.price;
        
        // Hiển thị ảnh cũ
        document.getElementById('prodImgData').value = product.img;
        document.getElementById('previewBox').classList.add('has-img');
        document.getElementById('previewImgSrc').src = product.img;
    }
}

// 7. Xóa sản phẩm
function deleteProduct(id) {
    if (confirm("Bạn có chắc muốn xóa món này không?")) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProductsToStorage(products);
    }
}
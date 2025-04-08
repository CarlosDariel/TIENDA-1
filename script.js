document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    let cartCount = 0;
    const cartCountElement = document.getElementById('cartCount');
    
    // Fetch products from FakeStore API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('productList');
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('col-md-4');
                productCard.innerHTML = `
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">$${product.price}</p>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                        </div>
                    </div>
                `;
                productList.appendChild(productCard);
            });

            // Add event listener to each "Añadir al carrito" button
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.target.dataset.id;
                    openModal(productId);
                });
            });
        });

    // Open quantity modal
    function openModal(productId) {
        const modal = new bootstrap.Modal(document.getElementById('modalCantidad'));
        modal.show();
        document.getElementById('agregarAlCarrito').onclick = () => {
            const quantity = document.getElementById('cantidadInput').value;
            addToCart(productId, quantity);
            modal.hide();
        }
    }

    // Add product to cart
    function addToCart(productId, quantity) {
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                const cartItem = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: parseInt(quantity),
                    total: product.price * quantity
                };
                cart.push(cartItem);
                updateCart();
            });
    }

    // Update cart UI
    function updateCart() {
        const cartList = document.getElementById('carritoContenido');
        cartList.innerHTML = '';
        cart.forEach(item => {
            cartList.innerHTML += `
                <div class="d-flex justify-content-between">
                    <span>${item.title} (x${item.quantity})</span>
                    <span>$${item.total}</span>
                </div>
            `;
        });
        const total = cart.reduce((sum, item) => sum + item.total, 0);
        cartList.innerHTML += `
            <hr>
            <div class="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>$${total}</strong>
            </div>
        `;
        cartCount = cart.length;
        cartCountElement.textContent = cartCount;
    }

    // Simulate payment process and generate PDF
    document.getElementById('procesarPago').addEventListener('click', () => {
        const nombre = document.getElementById('nombre').value;
        const tarjeta = document.getElementById('tarjeta').value;
        const fecha = document.getElementById('fecha').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!nombre || !tarjeta || !fecha || !cvv) {
            alert("Por favor complete todos los campos de pago.");
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + item.total, 0);
        
        const doc = new jsPDF();
        doc.text(`Factura de Compra`, 10, 10);
        cart.forEach((item, index) => {
            doc.text(`${item.title} (x${item.quantity}): $${item.total}`, 10, 20 + (index * 10));
        });
        doc.text(`Total: $${total}`, 10, 30 + (cart.length * 10));
        doc.save('factura.pdf');
    });
});

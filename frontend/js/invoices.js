const token = localStorage.getItem('token');

const saleItems = [];

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Request failed');
  }

  return response.json();
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function updateSummary() {
  const subtotal = saleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Number(document.getElementById('discountValue').value || 0);
  const tax = Number(document.getElementById('taxValue').value || 0);
  const total = subtotal - discount + tax;

  document.getElementById('subtotalValue').textContent = formatCurrency(subtotal);
  document.getElementById('totalValue').textContent = formatCurrency(total);
}

function renderSaleItems() {
  const body = document.getElementById('saleItemsBody');
  body.innerHTML = saleItems
    .map(
      (item, index) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(item.price * item.quantity)}</td>
          <td><button type="button" class="btn btn-secondary" data-remove="${index}">Remove</button></td>
        </tr>
      `
    )
    .join('');

  document.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      saleItems.splice(Number(button.dataset.remove), 1);
      renderSaleItems();
      updateSummary();
    });
  });

  updateSummary();
}

async function loadCustomersAndProducts() {
  try {
    const [customers, products] = await Promise.all([
      apiFetch('/api/customers'),
      apiFetch('/api/products'),
    ]);

    const customerSelect = document.getElementById('saleCustomer');
    customerSelect.innerHTML = customers
      .map((customer) => `<option value="${customer.id}">${customer.name}</option>`)
      .join('');

    const productSelect = document.getElementById('productSelect');
    productSelect.innerHTML = products
      .map((product) => `<option value="${product.id}">${product.name} - ${formatCurrency(product.price)}</option>`)
      .join('');
  } catch (error) {
    window.location.href = '/';
  }
}

document.getElementById('addItemBtn').addEventListener('click', () => {
  const productId = document.getElementById('productSelect').value;
  const quantity = Number(document.getElementById('productQty').value || 1);

  const selectedProduct = document.getElementById('productSelect').selectedOptions[0];
  const productName = selectedProduct ? selectedProduct.textContent.split(' - ')[0] : 'Product';
  const price = Number(selectedProduct?.textContent.match(/₹([\d,]+)/)?.[1].replace(/,/g, '') || 0);

  if (!quantity || quantity < 1) {
    alert('Quantity must be at least 1');
    return;
  }

  saleItems.push({ product_id: Number(productId), name: productName, quantity, price });
  renderSaleItems();
});

document.getElementById('discountValue').addEventListener('input', updateSummary);
document.getElementById('taxValue').addEventListener('input', updateSummary);

document.getElementById('saleForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!saleItems.length) {
    alert('Please add at least one product to the sale.');
    return;
  }

  const payload = {
    customer_id: Number(document.getElementById('saleCustomer').value),
    discount: Number(document.getElementById('discountValue').value || 0),
    tax: Number(document.getElementById('taxValue').value || 0),
    payment_method: document.getElementById('paymentMethod').value,
    items: saleItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    })),
  };

  try {
    const result = await apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    alert(`Sale completed successfully. Total: ${formatCurrency(result.total)}`);
    saleItems.length = 0;
    renderSaleItems();
    document.getElementById('discountValue').value = 0;
    document.getElementById('taxValue').value = 0;
  } catch (error) {
    alert(error.message || 'Unable to complete sale');
  }
});

loadCustomersAndProducts();
renderSaleItems();

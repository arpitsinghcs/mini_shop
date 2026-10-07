const token = localStorage.getItem('token');

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

function resetProductForm() {
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productSku').value = '';
  document.getElementById('productCategory').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productCost').value = '';
  document.getElementById('productStock').value = '';
  document.getElementById('productDescription').value = '';
}

async function loadProducts() {
  const tableBody = document.getElementById('productsTableBody');
  try {
    const products = await apiFetch('/api/products');
    tableBody.innerHTML = products
      .map(
        (product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>₹${Number(product.price).toLocaleString('en-IN')}</td>
            <td>${product.stock}</td>
            <td>
              <button class="btn btn-secondary" data-edit="${product.id}">Edit</button>
              <button class="btn btn-secondary" data-delete="${product.id}">Delete</button>
            </td>
          </tr>
        `
      )
      .join('');

    document.querySelectorAll('[data-edit]').forEach((button) => {
      button.addEventListener('click', () => populateProductForm(button.dataset.edit));
    });

    document.querySelectorAll('[data-delete]').forEach((button) => {
      button.addEventListener('click', () => deleteProduct(button.dataset.delete));
    });
  } catch (error) {
    window.location.href = '/';
  }
}

async function populateProductForm(id) {
  const products = await apiFetch('/api/products');
  const product = products.find((item) => String(item.id) === String(id));

  if (!product) return;

  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productSku').value = product.sku;
  document.getElementById('productCategory').value = product.category_name || '';
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productCost').value = product.cost_price || 0;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productDescription').value = product.description || '';
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;

  await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
  loadProducts();
}

document.getElementById('productForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('productId').value;
  const payload = {
    name: document.getElementById('productName').value,
    sku: document.getElementById('productSku').value,
    category_id: null,
    price: Number(document.getElementById('productPrice').value),
    cost_price: Number(document.getElementById('productCost').value || 0),
    stock: Number(document.getElementById('productStock').value),
    description: document.getElementById('productDescription').value,
  };

  if (id) {
    await apiFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  } else {
    await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) });
  }

  resetProductForm();
  loadProducts();
});

document.getElementById('resetProductForm').addEventListener('click', resetProductForm);

loadProducts();

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

function resetCustomerForm() {
  document.getElementById('customerId').value = '';
  document.getElementById('customerName').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('customerEmail').value = '';
  document.getElementById('customerAddress').value = '';
}

async function loadCustomers() {
  const tableBody = document.getElementById('customersTableBody');
  try {
    const customers = await apiFetch('/api/customers');
    tableBody.innerHTML = customers
      .map(
        (customer) => `
          <tr>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email || '-'}</td>
            <td>${customer.address || '-'}</td>
            <td>
              <button class="btn btn-secondary" data-edit="${customer.id}">Edit</button>
              <button class="btn btn-secondary" data-delete="${customer.id}">Delete</button>
            </td>
          </tr>
        `
      )
      .join('');

    document.querySelectorAll('[data-edit]').forEach((button) => {
      button.addEventListener('click', () => populateCustomerForm(button.dataset.edit));
    });

    document.querySelectorAll('[data-delete]').forEach((button) => {
      button.addEventListener('click', () => deleteCustomer(button.dataset.delete));
    });
  } catch (error) {
    window.location.href = '/';
  }
}

async function populateCustomerForm(id) {
  const customers = await apiFetch('/api/customers');
  const customer = customers.find((item) => String(item.id) === String(id));

  if (!customer) return;

  document.getElementById('customerId').value = customer.id;
  document.getElementById('customerName').value = customer.name;
  document.getElementById('customerPhone').value = customer.phone;
  document.getElementById('customerEmail').value = customer.email || '';
  document.getElementById('customerAddress').value = customer.address || '';
}

async function deleteCustomer(id) {
  if (!confirm('Delete this customer?')) return;

  await apiFetch(`/api/customers/${id}`, { method: 'DELETE' });
  loadCustomers();
}

document.getElementById('customerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('customerId').value;
  const payload = {
    name: document.getElementById('customerName').value,
    phone: document.getElementById('customerPhone').value,
    email: document.getElementById('customerEmail').value,
    address: document.getElementById('customerAddress').value,
  };

  if (id) {
    await apiFetch(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  } else {
    await apiFetch('/api/customers', { method: 'POST', body: JSON.stringify(payload) });
  }

  resetCustomerForm();
  loadCustomers();
});

document.getElementById('resetCustomerForm').addEventListener('click', resetCustomerForm);

loadCustomers();

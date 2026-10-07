const token = localStorage.getItem('token');

async function apiFetch(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  return response.json();
}

async function loadInvoices() {
  try {
    const invoices = await apiFetch('/api/invoices');
    const tbody = document.getElementById('invoicesTableBody');

    tbody.innerHTML = invoices
      .map(
        (invoice) => `
          <tr>
            <td>${invoice.order_number || `INV-${invoice.id}`}</td>
            <td>${invoice.customer_name || 'Customer'}</td>
            <td>${new Date(invoice.order_date).toLocaleDateString('en-IN')}</td>
            <td>₹${Number(invoice.total).toLocaleString('en-IN')}</td>
          </tr>
        `
      )
      .join('');
  } catch (error) {
    window.location.href = '/';
  }
}

loadInvoices();

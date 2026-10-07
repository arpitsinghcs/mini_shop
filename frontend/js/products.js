async function fetchJson(url) {
  const token = localStorage.getItem('token');
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

async function loadDashboard() {
  try {
    const data = await fetchJson('/api/dashboard');

    document.getElementById('totalProducts').textContent = data.totalProducts;
    document.getElementById('totalCustomers').textContent = data.totalCustomers;
    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${Number(data.totalRevenue || 0).toLocaleString('en-IN')}`;

    const lowStockList = document.getElementById('lowStockList');
    if (!data.lowStock || !data.lowStock.length) {
      lowStockList.innerHTML = '<p>No low stock items.</p>';
      return;
    }

    lowStockList.innerHTML = data.lowStock
      .map((item) => `<div class="card"><strong>${item.name}</strong> - ${item.stock} left</div>`)
      .join('');
  } catch (error) {
    window.location.href = '/';
  }
}

loadDashboard();

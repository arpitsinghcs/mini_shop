const db = require('../config/db');

async function getDashboard(req, res) {
  try {
    const [productCount] = await db.query('SELECT COUNT(*) AS total FROM products');
    const [customerCount] = await db.query('SELECT COUNT(*) AS total FROM customers');
    const [orderCount] = await db.query('SELECT COUNT(*) AS total FROM orders');
    const [revenue] = await db.query('SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders');
    const [lowStock] = await db.query('SELECT * FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 10');

    const totalProducts = productCount[0].total;
    const totalCustomers = customerCount[0].total;
    const totalOrders = orderCount[0].total;
    const totalRevenue = Number(revenue[0].total_revenue || 0);

    return res.json({
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      lowStock,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
}

async function createOrder(req, res) {
  const { customer_id, items, discount = 0, tax = 0, payment_method = 'Cash' } = req.body;

  if (!customer_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Customer and at least one order item are required.' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let subtotal = 0;

    for (const item of items) {
      const [productRows] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);

      if (!productRows.length) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      const product = productRows[0];
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const lineTotal = Number(product.price) * Number(item.quantity);
      subtotal += lineTotal;
    }

    const discountAmount = Number(discount || 0);
    const taxAmount = Number(tax || 0);
    const total = subtotal - discountAmount + taxAmount;

    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, order_number, subtotal, discount, tax, total, order_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, NOW())',
      [customer_id, `MS-${Date.now()}`, subtotal, discountAmount, taxAmount, total, 'Paid']
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const [productRows] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      const product = productRows[0];
      const lineTotal = Number(product.price) * Number(item.quantity);

      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [orderId, item.product_id, Number(item.quantity), Number(product.price), lineTotal]
      );

      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [Number(item.quantity), item.product_id]);
    }

    await connection.query(
      'INSERT INTO payments (order_id, amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [orderId, total, payment_method, 'completed']
    );

    await connection.commit();

    return res.status(201).json({
      message: 'Sale created successfully',
      orderId,
      total,
      orderNumber: `MS-${orderId}`,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    return res.status(400).json({ message: error.message || 'Unable to create sale.' });
  } finally {
    connection.release();
  }
}

async function getInvoices(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT o.*, c.name AS customer_name
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
    `);

    return res.json(rows);
  } catch (error) {
    console.error('Invoices error:', error);
    return res.status(500).json({ message: 'Failed to fetch invoices.' });
  }
}

module.exports = { getDashboard, createOrder, getInvoices };

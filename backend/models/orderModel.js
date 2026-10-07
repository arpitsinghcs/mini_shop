const db = require('../config/db');

async function createOrderWithItems(customerId, items, discount = 0, tax = 0, paymentMethod = 'Cash') {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let subtotal = 0;

    for (const item of items) {
      const [productRows] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      if (!productRows.length) throw new Error(`Product not found: ${item.product_id}`);
      if (productRows[0].stock < item.quantity) throw new Error(`Insufficient stock for product: ${productRows[0].name}`);
      subtotal += Number(productRows[0].price) * Number(item.quantity);
    }

    const discountAmount = Number(discount || 0);
    const taxAmount = Number(tax || 0);
    const total = subtotal - discountAmount + taxAmount;

    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, order_number, subtotal, discount, tax, total, order_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, NOW())',
      [customerId, `MS-${Date.now()}`, subtotal, discountAmount, taxAmount, total, 'Paid']
    );

    for (const item of items) {
      const [productRows] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      const product = productRows[0];
      const lineTotal = Number(product.price) * Number(item.quantity);

      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [orderResult.insertId, item.product_id, Number(item.quantity), Number(product.price), lineTotal]
      );

      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [Number(item.quantity), item.product_id]);
    }

    await connection.query(
      'INSERT INTO payments (order_id, amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [orderResult.insertId, total, paymentMethod, 'completed']
    );

    await connection.commit();
    return { orderId: orderResult.insertId, total };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { createOrderWithItems };

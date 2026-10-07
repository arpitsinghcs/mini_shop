const db = require('../config/db');

async function getProducts(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.created_at DESC
    `);

    return res.json(rows);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
}

async function addProduct(req, res) {
  const { name, sku, category_id, price, cost_price, stock, description, image_url } = req.body;

  if (!name || !sku || !price || !stock) {
    return res.status(400).json({ message: 'Name, SKU, price, and stock are required.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO products (name, sku, category_id, price, cost_price, stock, description, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, sku, category_id || null, Number(price), Number(cost_price || 0), Number(stock), description || '', image_url || '']
    );

    return res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  } catch (error) {
    console.error('Add product error:', error);
    return res.status(500).json({ message: 'Failed to create product.' });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, sku, category_id, price, cost_price, stock, description, image_url } = req.body;

  try {
    await db.query(
      `UPDATE products
       SET name = ?, sku = ?, category_id = ?, price = ?, cost_price = ?, stock = ?, description = ?, image_url = ?
       WHERE id = ?`,
      [name, sku, category_id || null, Number(price), Number(cost_price || 0), Number(stock), description || '', image_url || '', id]
    );

    return res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ message: 'Failed to update product.' });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };

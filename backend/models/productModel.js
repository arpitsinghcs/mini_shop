const db = require('../config/db');

async function getAllProducts() {
  const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows;
}

async function getProductById(id) {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

async function createProduct(productData) {
  const { name, sku, category_id, price, cost_price, stock, description, image_url } = productData;
  const [result] = await db.query(
    `INSERT INTO products (name, sku, category_id, price, cost_price, stock, description, image_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [name, sku, category_id || null, Number(price), Number(cost_price || 0), Number(stock), description || '', image_url || '']
  );

  return result.insertId;
}

async function updateProduct(id, productData) {
  const { name, sku, category_id, price, cost_price, stock, description, image_url } = productData;
  await db.query(
    `UPDATE products
     SET name = ?, sku = ?, category_id = ?, price = ?, cost_price = ?, stock = ?, description = ?, image_url = ?
     WHERE id = ?`,
    [name, sku, category_id || null, Number(price), Number(cost_price || 0), Number(stock), description || '', image_url || '', id]
  );
  return true;
}

async function deleteProduct(id) {
  await db.query('DELETE FROM products WHERE id = ?', [id]);
  return true;
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

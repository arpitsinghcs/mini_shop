const db = require('../config/db');

async function getAllCustomers() {
  const [rows] = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
  return rows;
}

async function createCustomer(data) {
  const { name, phone, email, address } = data;
  const [result] = await db.query(
    'INSERT INTO customers (name, phone, email, address, created_at) VALUES (?, ?, ?, ?, NOW())',
    [name, phone, email || '', address || '']
  );
  return result.insertId;
}

async function updateCustomer(id, data) {
  const { name, phone, email, address } = data;
  await db.query(
    'UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
    [name, phone, email || '', address || '', id]
  );
  return true;
}

async function deleteCustomer(id) {
  await db.query('DELETE FROM customers WHERE id = ?', [id]);
  return true;
}

module.exports = { getAllCustomers, createCustomer, updateCustomer, deleteCustomer };

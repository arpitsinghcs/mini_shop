const db = require('../config/db');

async function getCustomers(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
    return res.json(rows);
  } catch (error) {
    console.error('Get customers error:', error);
    return res.status(500).json({ message: 'Failed to fetch customers.' });
  }
}

async function addCustomer(req, res) {
  const { name, phone, email, address } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO customers (name, phone, email, address, created_at) VALUES (?, ?, ?, ?, NOW())',
      [name, phone, email || '', address || '']
    );

    return res.status(201).json({ message: 'Customer created successfully', customerId: result.insertId });
  } catch (error) {
    console.error('Add customer error:', error);
    return res.status(500).json({ message: 'Failed to create customer.' });
  }
}

async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;

  try {
    await db.query(
      'UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [name, phone, email || '', address || '', id]
    );

    return res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Update customer error:', error);
    return res.status(500).json({ message: 'Failed to update customer.' });
  }
}

async function deleteCustomer(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM customers WHERE id = ?', [id]);
    return res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    return res.status(500).json({ message: 'Failed to delete customer.' });
  }
}

module.exports = { getCustomers, addCustomer, updateCustomer, deleteCustomer };

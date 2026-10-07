const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getCustomers, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');

const router = express.Router();

router.get('/', authMiddleware, getCustomers);
router.post('/', authMiddleware, addCustomer);
router.put('/:id', authMiddleware, updateCustomer);
router.delete('/:id', authMiddleware, deleteCustomer);

module.exports = router;

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboard, createOrder, getInvoices } = require('../controllers/orderController');

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.post('/sales', authMiddleware, createOrder);
router.get('/invoices', authMiddleware, getInvoices);

module.exports = router;

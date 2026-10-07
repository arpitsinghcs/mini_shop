const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { login } = require('../controllers/authController');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getCustomers, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { getDashboard, createOrder, getInvoices } = require('../controllers/orderController');

const router = express.Router();

router.post('/auth/login', login);

router.get('/dashboard', authMiddleware, getDashboard);
router.get('/products', authMiddleware, getProducts);
router.post('/products', authMiddleware, addProduct);
router.put('/products/:id', authMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);

router.get('/customers', authMiddleware, getCustomers);
router.post('/customers', authMiddleware, addCustomer);
router.put('/customers/:id', authMiddleware, updateCustomer);
router.delete('/customers/:id', authMiddleware, deleteCustomer);

router.post('/orders', authMiddleware, createOrder);
router.get('/invoices', authMiddleware, getInvoices);

module.exports = router;

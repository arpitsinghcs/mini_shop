const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db');
const { ensureDefaultAdmin } = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, '../frontend');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', details: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', orderRoutes);

app.use(express.static(frontendDir));

app.get('/', (req, res) => res.sendFile(path.join(frontendDir, 'login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(frontendDir, 'dashboard.html')));
app.get('/products', (req, res) => res.sendFile(path.join(frontendDir, 'products.html')));
app.get('/customers', (req, res) => res.sendFile(path.join(frontendDir, 'customers.html')));
app.get('/sales', (req, res) => res.sendFile(path.join(frontendDir, 'sales.html')));
app.get('/invoices', (req, res) => res.sendFile(path.join(frontendDir, 'invoices.html')));

async function startServer() {
  try {
    await db.query('SELECT 1');
    await ensureDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`MiniShop server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MySQL connection failed. Please import the schema first:');
    console.error('mysql -u root -p < database/schema.sql');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();

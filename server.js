const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const initAdmin = require('./utils/initAdmin');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Admin Backend: Connected to MongoDB');
    initAdmin(); // Auto-create mastering admin if not exists
  })
  .catch(err => console.error('Admin Backend: MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Admin Backend is running on Vercel!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Admin Backend is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/subcategories', require('./routes/subCategoryRoutes'));
app.use('/api/feedbacks', require('./routes/feedbackRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/brands', require('./routes/brandRoutes'));
app.use('/api/shipping', require('./routes/shippingRoutes'));

app.listen(PORT, () => {
  console.log(`Admin Backend server is running on port ${PORT}`);
});

module.exports = app;

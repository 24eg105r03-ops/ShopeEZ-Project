// Run with: node seed.js
// Populates the DB with a demo seller, buyer, and sample products for your demo video/link.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const run = async () => {
  await connectDB();
  await Order.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();

  const seller = await User.create({
    name: 'ShopEZ Seller',
    email: 'seller@shopez.com',
    password: 'seller123',
    role: 'seller',
  });

  const buyer = await User.create({
    name: 'Demo Buyer',
    email: 'buyer@shopez.com',
    password: 'buyer123',
    role: 'buyer',
  });

  const products = [
    { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 30hr battery life.', category: 'Electronics', price: 79.99, discountPercent: 15, countInStock: 25, image: 'https://placehold.co/400x400?text=Headphones' },
    { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart-rate monitor.', category: 'Electronics', price: 129.99, discountPercent: 10, countInStock: 15, image: 'https://placehold.co/400x400?text=Smart+Watch' },
    { name: 'Running Shoes', description: 'Lightweight breathable running shoes for daily training.', category: 'Footwear', price: 59.99, discountPercent: 0, countInStock: 40, image: 'https://placehold.co/400x400?text=Shoes' },
    { name: 'Backpack', description: 'Water-resistant 25L backpack with laptop sleeve.', category: 'Accessories', price: 39.99, discountPercent: 20, countInStock: 30, image: 'https://placehold.co/400x400?text=Backpack' },
    { name: 'Coffee Maker', description: '12-cup programmable drip coffee maker.', category: 'Home', price: 45.5, discountPercent: 5, countInStock: 4, image: 'https://placehold.co/400x400?text=Coffee+Maker' },
    { name: 'Yoga Mat', description: 'Non-slip extra-thick yoga and exercise mat.', category: 'Sports', price: 24.99, discountPercent: 0, countInStock: 50, image: 'https://placehold.co/400x400?text=Yoga+Mat' },
  ].map((p) => ({ ...p, seller: seller._id }));

  await Product.insertMany(products);

  console.log('Seed complete!');
  console.log('Seller login -> email: seller@shopez.com / password: seller123');
  console.log('Buyer login  -> email: buyer@shopez.com  / password: buyer123');
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

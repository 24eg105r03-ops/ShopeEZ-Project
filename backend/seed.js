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
    { name: 'Ares Pro Gaming Controller', description: 'Retro-style 16-bit arcade gaming controller with textured grip and premium responsive d-pad buttons.', category: 'Gaming', price: 3499, discountPercent: 10, countInStock: 18, image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Retro Pocket Console', description: 'Vintage-styled 8-bit pocket gaming console loaded with 100+ retro arcade classics.', category: 'Gaming', price: 4999, discountPercent: 15, countInStock: 12, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60' },
    { name: 'Vintage Polaroid Camera', description: 'Classic instant-print polaroid camera with manual exposure settings and carrying strap.', category: 'Photography', price: 7999, discountPercent: 5, countInStock: 8, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60' },
    { name: 'Typewriter Mechanical Keyboard', description: 'Retro typewriter-key tactile mechanical keyboard with rounded caps and vintage amber backlights.', category: 'Electronics', price: 4499, discountPercent: 0, countInStock: 15, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60' },
    { name: 'Vinyl Record Player', description: 'Vintage wooden turntable record player with built-in stereo speakers and Bluetooth pairing support.', category: 'Music', price: 8999, discountPercent: 10, countInStock: 6, image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80' },
    { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 30hr battery life.', category: 'Electronics', price: 2499, discountPercent: 15, countInStock: 25, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },
    { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart-rate monitor.', category: 'Electronics', price: 3999, discountPercent: 10, countInStock: 15, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
    { name: 'Running Shoes', description: 'Lightweight breathable running shoes for daily training.', category: 'Footwear', price: 1999, discountPercent: 0, countInStock: 40, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
    { name: 'Backpack', description: 'Water-resistant 25L backpack with laptop sleeve.', category: 'Accessories', price: 1299, discountPercent: 20, countInStock: 30, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' },
    { name: 'Coffee Maker', description: '12-cup programmable drip coffee maker.', category: 'Home', price: 1499, discountPercent: 5, countInStock: 4, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80' },
    { name: 'Yoga Mat', description: 'Non-slip extra-thick yoga and exercise mat.', category: 'Sports', price: 799, discountPercent: 0, countInStock: 50, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=60' },
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

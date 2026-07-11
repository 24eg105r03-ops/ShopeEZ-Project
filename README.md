# ShopEZ — Vintage Sepia Neubrutalist E-Commerce Platform

ShopEZ is a highly polished, responsive MERN-stack e-commerce web application featuring a pleasant retro sepia console aesthetic ('old vibes'). Built with MongoDB, Express, React, and Node.js, the platform offers an authentic retro-gaming catalog (including the Ares Pro Controller), custom neubrutalist UI widgets, a live flipping credit card payment gateway simulator, and fully decoupled controller-pattern backend APIs.

---

## 🎨 Design Theme & Aesthetics ('Old Vibes')
ShopEZ utilizes custom styling tokens to deliver a warm, nostalgic arcade/console layout:
* **Vintage Typography**: Incorporates Google Fonts **Courier Prime** (for typewriter headings) and **Space Mono** (for monospaced labels and pricing tags), blended with **Plus Jakarta Sans** for body readability.
* **Neubrutalist Geometry**: Features solid warm charcoal borders (`2.5px solid #2d2724`), flat-shaded solid offsets (`box-shadow: 4px 4px 0px #2d2724`), and blocky console grids on a cozy vintage cream backdrop (`#faf6eb`).
* **Micro-interactions**: Interactive buttons physically depress (`transform: translate(2px, 2px)`) when clicked. Banners include subtle CRT scanline overlays for that nostalgic cathode-ray television look.

---

## ⚡ Features & Modules

### 🛒 Buyer Experience
* **Cozy Catalog Showcase**: Browsing items with a grid format featuring shimmering skeleton loaders (`ProductSkeleton.js`) while data fetches.
* **Catalog Sorting & Search Filters**: Instantly sort by Newest Arrivals, Price (Low to High / High to Low), or Top Customer Ratings. Filter catalog items by categories or a custom price range form.
* **Product Card Quick Actions**: Cards display remaining inventory counts ("Only X Left!"), discount percentages, and inline instant "Add to Cart" checkout triggers.
* **Interactive Flipping Credit Card Gateway**: In checkout, selecting Credit Card displays a virtual credit card card widget that updates live as you type. When you select the CVV field, the card flips over to show the signature area. Submitting shows a simulated retro terminal transaction loader.
* **Delivery Tracker & Printable Invoice Receipts**: The order confirmation details page features a dynamic shipping tracker (Placed → Processing → Shipped → Delivered). Features a print button that automatically hides nav/footer components to produce clean printouts.
* **Account Settings**: Dedicated profile manager page (`/profile`) allowing users to update full names, emails, and change passwords.

### 📊 Seller Console
* **Analytics Dashboard**: Monitor shop statistics using styled KPI cards (Total Revenue, Orders, Products, Shipped Units) and itemized lists showing sales distributions and low-stock alerts.
* **Catalog CRUD Manager**: Search, add, edit, or delete items in the store. Includes live thumbnail preview checks on images.
* **Order Fullfillment**: Track customer invoices and update shipping statuses using dropdown forms (Processing, Shipped, Delivered, Cancelled).

---

## 🔧 Technical Stack & Architecture

### Backend Restructuring (Clean Code)
* **Decoupled Controllers**: Routes are cleanly bound to standalone controllers (`authController`, `productController`, `orderController`, `sellerController`), keeping route mapping files light and readable.
* **asyncHandler Utility**: Wraps Express endpoints to catch rejected promises, redirecting database/network errors to a global handler in `server.js` and reducing `try-catch` boilerplate.
* **Input Validation Middleware**: Custom schema validation middleware verifies inputs (email formats, password lengths, positive product prices) before querying models.
* **401 Unauthorized Response Interceptor**: If the database is reseeded, any stale token session in a user's browser triggers a global `'shopez-logout'` custom event, clearing their local storage and redirecting them to `/login` automatically.

---

## 🚀 Setup & Local Execution

### 1. Prerequisites
Ensure you have **Node.js** and a local **MongoDB** database instance running on your machine.

### 2. Backend Config
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure your local `.env` environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/shopez
   JWT_SECRET=supersecretjwtkeyforlocaldevelopment12345
   CLIENT_URL=http://localhost:3000
   ```
4. Seeding vintage catalog items (Recommended for testing the Ares Pro Controller, Polaroid, etc.):
   ```bash
   node seed.js
   ```
   *Seeds active accounts: Buyer (`buyer@shopez.com` / `buyer123`) & Seller (`seller@shopez.com` / `seller123`).*

5. Boot up the backend API service:
   ```bash
   npm start
   ```

### 3. Frontend Config
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set your React environment URL in `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Boot up the React client development server:
   ```bash
   npm start
   ```
   *Opens the portal on: http://localhost:3000*

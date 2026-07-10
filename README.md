# ShopEZ — MERN Stack E-Commerce Platform

Your one-stop destination for online shopping. Built with MongoDB, Express, React, and Node.js.

## Features
- **Buyers:** browse/search/filter product catalog, product detail pages with reviews & ratings, cart, secure checkout, order history.
- **Sellers:** dashboard with revenue/units/order analytics, low-stock alerts, full product CRUD, order status management.
- **Auth:** JWT-based registration/login with role-based access (buyer/seller).
- **Stack:** React (Router, Context API), Node/Express REST API, MongoDB/Mongoose, JWT, Bootstrap 5.

## Project Structure
```
shopez/
  backend/     Express API, MongoDB models, JWT auth, seed script
  frontend/    React app (CRA), Bootstrap UI
```

## Local Setup

### 1. Backend
```
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run dev                # or: npm start
```
Get a free MongoDB URI from https://www.mongodb.com/cloud/atlas (free tier, no card needed).

### 2. Seed demo data (recommended before your demo)
```
node seed.js
```
This creates:
- Seller login → `seller@shopez.com` / `seller123`
- Buyer login  → `buyer@shopez.com` / `buyer123`
- 6 sample products across categories

### 3. Frontend
```
cd frontend
npm install
cp .env.example .env      # points to http://localhost:5000/api by default
npm start
```
App runs at http://localhost:3000, API at http://localhost:5000.

---

## Getting Your GitHub Link (for mentor review)

```bash
cd shopez
git init
git add .
git commit -m "Initial commit: ShopEZ MERN e-commerce app"
```
Then on GitHub: create a new empty repo (e.g. `shopez`), then:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/shopez.git
git push -u origin main
```
Paste that repo URL — `https://github.com/<your-username>/shopez` — into the GitHub field.

**Note:** `.env` files are already gitignored so your secrets won't be pushed. Push `.env.example` only.

---

## Getting Your Live Demo Link

Easiest free path (~10 min):

**Backend → Render.com**
1. Push code to GitHub (above).
2. On https://render.com → New → Web Service → connect your repo, set root directory to `backend`.
3. Build command: `npm install`  |  Start command: `npm start`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (set this after step below).
5. Deploy → copy the resulting URL, e.g. `https://shopez-api.onrender.com`.

**Frontend → Vercel or Netlify**
1. On https://vercel.com → New Project → import the same repo, set root directory to `frontend`.
2. Add environment variable: `REACT_APP_API_URL=https://shopez-api.onrender.com/api`
3. Deploy → copy the resulting URL, e.g. `https://shopez.vercel.app`.
4. Go back to Render and set `CLIENT_URL=https://shopez.vercel.app`, redeploy the backend.

Paste the Vercel/Netlify URL into the "Demo" field.

**MongoDB:** use a free MongoDB Atlas cluster; in Atlas Network Access, allow access from anywhere (0.0.0.0/0) so Render can connect.

---

## API Overview
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account (buyer/seller) |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/products | List/search/filter products |
| GET | /api/products/:id | Product detail |
| POST | /api/products | Create product (seller) |
| PUT/DELETE | /api/products/:id | Update/delete own product (seller) |
| POST | /api/products/:id/reviews | Add review (buyer) |
| POST | /api/orders | Place order (checkout) |
| GET | /api/orders/myorders | Buyer's order history |
| GET | /api/seller/products, /orders, /analytics | Seller dashboard data |

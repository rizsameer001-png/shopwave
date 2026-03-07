# ShopWave — React Client (Frontend)

React 18 web storefront for ShopWave e-commerce, connecting to the MERN backend via REST API.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set API URL (optional — defaults to /api via proxy)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local

# 3. Start development server
npm start
# Opens http://localhost:3000

# 4. Build for production
npm run build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `/api` (proxied) | Backend API base URL |

> In development, `"proxy": "http://localhost:5000"` in package.json handles this automatically.

## Pages & Routes

| Route | Component | Auth Required |
|---|---|---|
| `/` | HomePage | ❌ |
| `/products` | ProductsPage | ❌ |
| `/products/:id` | ProductDetailPage | ❌ |
| `/cart` | CartPage | ❌ |
| `/login` | LoginPage | ❌ |
| `/register` | RegisterPage | ❌ |
| `/checkout` | CheckoutPage | ✅ |
| `/order/:id/confirm` | OrderConfirmPage | ✅ |
| `/orders` | OrdersPage | ✅ |
| `/orders/:id` | OrderDetailPage | ✅ |
| `/profile` | ProfilePage | ✅ |
| `/wishlist` | WishlistPage | ✅ |
| `/admin` | AdminDashboard | 🔑 Admin |
| `/admin/products` | AdminProducts | 🔑 Admin |
| `/admin/products/new` | AdminProductEdit | 🔑 Admin |
| `/admin/products/:id/edit` | AdminProductEdit | 🔑 Admin |
| `/admin/orders` | AdminOrders | 🔑 Admin |
| `/admin/users` | AdminUsers | 🔑 Admin |

## Features

- **Product browsing** — grid, filters, search, pagination
- **Product detail** — image gallery, size/color picker, reviews
- **Cart** — persistent (localStorage), quantity controls
- **Checkout** — 3-step flow (Shipping → Payment → Review)
- **Auth** — JWT stored in localStorage, auto-verified on load
- **Wishlist** — toggle from any product card
- **Admin panel** — dashboard stats, manage products/orders/users
- **Responsive** — mobile-friendly layout

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── App.js                  # Routes + providers
│   ├── index.js                # React entry
│   ├── context/
│   │   ├── AuthContext.js      # Auth state + login/logout
│   │   └── CartContext.js      # Cart state + localStorage
│   ├── services/
│   │   └── api.js              # Axios client + all API calls
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   └── product/
│   │       └── ProductCard.js
│   └── pages/
│       ├── HomePage.js
│       ├── ProductsPage.js
│       ├── ProductDetailPage.js
│       ├── CartPage.js
│       ├── CheckoutPage.js
│       ├── LoginPage.js
│       ├── RegisterPage.js
│       ├── OrdersPage.js
│       ├── OrderDetailPage.js
│       ├── OrderConfirmPage.js
│       ├── ProfilePage.js
│       ├── WishlistPage.js
│       ├── NotFoundPage.js
│       └── admin/
│           ├── AdminDashboard.js
│           ├── AdminProducts.js
│           ├── AdminProductEdit.js
│           ├── AdminOrders.js
│           └── AdminUsers.js
└── package.json
```

## Connecting to Flutter

The same `/api` endpoints used by this React app are consumed by the Flutter app.
Both share the same backend. Just point both to:
```
https://your-backend.com/api
```

## Demo Login

- **Admin:** admin@shopwave.com / admin123
- **User:**  demo@shopwave.com  / demo123

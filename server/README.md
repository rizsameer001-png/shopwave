# ShopWave — MERN Backend (Server)

Express.js + MongoDB REST API powering the ShopWave e-commerce platform.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env .env.local
# Edit .env — set your MONGO_URI

# 3. Seed the database
npm run seed

# 4. Start development server
npm run dev

# 5. Start production server
npm start
```

## Environment Variables (.env)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/shopwave` | MongoDB connection |
| `JWT_SECRET` | *(change this!)* | JWT signing secret |
| `JWT_EXPIRE` | `30d` | Token expiry |
| `CLIENT_URL` | `http://localhost:3000` | CORS allowed origin |
| `NODE_ENV` | `development` | Environment |

## Seed Credentials

After running `npm run seed`:
- **Admin:** admin@shopwave.com / admin123
- **User:**  demo@shopwave.com  / demo123

## API Endpoints

### Auth  `/api/auth`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login & get JWT |
| GET | `/me` | ✅ | Get current user |
| PUT | `/profile` | ✅ | Update profile |
| POST | `/address` | ✅ | Add address |
| PUT | `/address/:id` | ✅ | Update address |
| DELETE | `/address/:id` | ✅ | Delete address |
| POST | `/wishlist/:productId` | ✅ | Toggle wishlist |

### Products  `/api/products`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | List products (filter/sort/page) |
| GET | `/featured` | ❌ | Featured products |
| GET | `/new-arrivals` | ❌ | New arrival products |
| GET | `/categories` | ❌ | Distinct categories |
| GET | `/:id` | ❌ | Single product |
| GET | `/:id/related` | ❌ | Related products |
| POST | `/` | 🔑 Admin | Create product |
| PUT | `/:id` | 🔑 Admin | Update product |
| DELETE | `/:id` | 🔑 Admin | Deactivate product |
| POST | `/:id/reviews` | ✅ | Add review |

#### Product Query Params
- `keyword` — full-text search
- `category` — filter by category
- `brand` — filter by brand
- `minPrice` / `maxPrice` — price range
- `sort` — `newest`, `price_asc`, `price_desc`, `rating`, `popular`
- `page` / `limit` — pagination
- `featured=true` / `isNew=true` — flags

### Orders  `/api/orders`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create order |
| GET | `/my` | ✅ | My orders |
| GET | `/:id` | ✅ | Order detail |
| PUT | `/:id/pay` | ✅ | Mark paid |
| GET | `/` | 🔑 Admin | All orders |
| GET | `/stats` | 🔑 Admin | Dashboard stats |
| PUT | `/:id/status` | 🔑 Admin | Update status |
| DELETE | `/:id` | 🔑 Admin | Delete order |

### Users  `/api/users`  (Admin only)
| Method | Route | Description |
|---|---|---|
| GET | `/` | List users |
| GET | `/stats` | User stats |
| GET | `/:id` | User detail |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user |

### Categories  `/api/categories`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | All categories |
| POST | `/` | 🔑 Admin | Create category |
| PUT | `/:id` | 🔑 Admin | Update category |
| DELETE | `/:id` | 🔑 Admin | Remove category |

### Upload  `/api/upload`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Upload single image |
| POST | `/multiple` | ✅ | Upload up to 5 images |

## Response Format

### Success
```json
{ "products": [...], "page": 1, "pages": 5, "total": 60 }
```

### Error
```json
{ "message": "Descriptive error message" }
```

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

## Project Structure

```
server/
├── config/
│   ├── db.js          # MongoDB connection
│   └── seeder.js      # Database seeder
├── middleware/
│   └── auth.js        # JWT protect, admin, optionalAuth
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Category.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   ├── categoryRoutes.js
│   └── uploadRoutes.js
├── uploads/           # Uploaded images (local)
├── .env
├── package.json
└── server.js
```

## Deployment (Render / Railway)

1. Push to GitHub
2. Create new Web Service
3. Set environment variables
4. Set `MONGO_URI` to MongoDB Atlas connection string
5. Build command: `npm install`
6. Start command: `npm start`

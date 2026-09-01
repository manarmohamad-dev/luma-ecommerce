# Luma

Luma is a full-stack e-commerce course project with an Angular storefront and a Node.js, Express, and MongoDB REST API. It includes product discovery, authentication, a shopping cart, favorites, and admin product and user management.

## Technology

- Angular 20
- Node.js and Express 5
- MongoDB and Mongoose
- JWT and bcryptjs
- Bootstrap 5 and Bootstrap Icons
- express-validator, Helmet, CORS, express-rate-limit, Morgan, and Winston

## Project Structure

```text
Luma/
├── src/                 Angular application
├── public/              Static product assets
├── backend/
│   ├── src/
│   │   ├── config/      Database configuration
│   │   ├── controllers/ Request handlers
│   │   ├── models/      Mongoose schemas
│   │   ├── routes/      REST endpoints
│   │   ├── middlewares/ Authentication, authorization, validation, errors
│   │   ├── services/    Product query logic
│   │   ├── utils/       Logging
│   │   └── data/        Seed data
│   ├── .env.example
│   └── server.js
└── package.json
```

## Local Setup

### Prerequisites

- Node.js 20 or later
- A MongoDB Atlas cluster (or a local MongoDB instance for development)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

The API starts at `http://localhost:5000`.

### Frontend

In a second terminal:

```bash
npm install
npm start
```

Open `http://localhost:4200`.

The development frontend uses `http://localhost:5000/api` by default. The production build uses the safe placeholder in `src/environments/environment.production.ts`; replace that placeholder with the deployed backend API URL before building for production.

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

| Variable | Description |
| --- | --- |
| `PORT` | API port, default `5000` |
| `NODE_ENV` | Runtime environment |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long, unique secret used to sign tokens |
| `JWT_EXPIRES_IN` | JWT lifetime, for example `7d` |
| `CLIENT_URL` | Allowed frontend origin |

Never commit `backend/.env`. For deployment, set all of these values in the hosting provider's environment-variable settings rather than in source files.

## Deployment Architecture

Deploy the Angular frontend and Node/Express backend as separate services. The frontend calls the backend API URL configured in its production environment file, while the backend connects to MongoDB Atlas using `MONGO_URI`. Set `CLIENT_URL` to the deployed frontend origin so CORS permits that application.

Build the frontend with:

```bash
npm run build
```

Start the backend in a production environment with:

```bash
cd backend
npm start
```

## Seed Data

`npm run seed` resets the local database and inserts four sample products and one administrator account.

Use this command only for a development or explicitly designated seed database: it clears the application's products and users before inserting seed records.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `Admin12345` |

These credentials are for local development only. Change or remove them before any public deployment.

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login and receive a JWT |

### Products

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| GET | `/api/products` | Public | List products with optional `search`, `category`, `page`, and `limit` queries |
| GET | `/api/products/:id` | Public | Get one product |
| POST | `/api/products` | Admin | Create a product |
| PATCH | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |

### Users, Cart, and Favorites

| Method | Endpoint | Access | Description |
| --- | --- | --- |
| GET | `/api/users/profile` | User | Get profile |
| PATCH | `/api/users/profile` | User | Update name or email |
| GET | `/api/users/cart` | User | Get cart |
| PUT | `/api/users/cart` | User | Add or update a cart item |
| DELETE | `/api/users/cart/:productId` | User | Remove a cart item |
| GET | `/api/users/favorites` | User | Get favorites |
| POST | `/api/users/favorites/:productId` | User | Add or remove a favorite |
| GET | `/api/users` | Admin | List users |
| PATCH | `/api/users/:id/ban` | Admin | Ban or unban a user |

Authenticated routes require `Authorization: Bearer <token>`.

## Security and Reliability

- Passwords are hashed with bcryptjs.
- JWT middleware authenticates protected routes.
- Role middleware restricts admin operations.
- express-validator checks request body, route parameters, and query values.
- Helmet sets security headers.
- CORS restricts browser access to the configured client origin.
- Rate limiting protects the API from repeated requests.
- Morgan and Winston write request and error logs locally.
- Global error handling returns a consistent error response shape.

## Validation

```bash
npm run build
cd backend
node --check server.js
```

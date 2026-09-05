# Luma E-Commerce

Luma is a full-stack portfolio project that demonstrates a modern Angular storefront backed by a Node.js, Express, and MongoDB REST API. It covers product discovery, user authentication, customer shopping features, and role-protected administration in one end-to-end application.

## Live Demo

- Frontend: [luma-ecommerce-roan.vercel.app](https://luma-ecommerce-roan.vercel.app/)
- Backend API: deployed separately on Railway and consumed by the production frontend

The deployed services may take a short time to respond after inactivity. No private credentials or infrastructure secrets are included in this repository.

## Features

### Storefront

- Browse, search, and filter products
- View product details
- Create an account and sign in
- Maintain a persistent shopping cart
- Add or remove favorite products
- View and update a customer profile

### Administration

- Role-protected admin routes
- Create, update, and delete products
- Browse registered users
- Ban or reactivate user accounts

### API and security

- RESTful Express API
- MongoDB persistence with Mongoose
- Password hashing with bcryptjs
- JWT authentication and authorization middleware
- Request validation with express-validator
- Helmet security headers, restricted CORS, and API rate limiting
- Centralized error handling and structured logging

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Angular 20, TypeScript, RxJS, Bootstrap 5 |
| Backend | Node.js, Express 5, JavaScript |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| Validation and security | express-validator, Helmet, CORS, express-rate-limit |
| Deployment | Vercel, Railway |

## Architecture

```text
Angular storefront
       |
       | HTTPS / JSON REST requests
       v
Node.js + Express API
       |
       | Mongoose
       v
MongoDB Atlas
```

The Angular application separates routing, pages, guards, and shared data services. The backend separates configuration, models, controllers, services, routes, validation, authorization, and error middleware.

```text
Luma/
├── src/
│   ├── app/
│   │   ├── core/          # Store service and route guards
│   │   └── pages/         # Storefront and administration pages
│   └── environments/      # API configuration
├── public/                # Product assets
└── backend/
    └── src/
        ├── config/        # Database configuration
        ├── controllers/   # HTTP request handlers
        ├── data/          # Development seed data
        ├── middlewares/   # Auth, roles, validation, and errors
        ├── models/        # Mongoose schemas
        ├── routes/        # REST endpoints
        ├── services/      # Product query logic
        └── utils/         # Logging
```

## API Overview

### Authentication

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Products

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PATCH | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Users, cart, and favorites

| Method | Endpoint | Access |
| --- | --- | --- |
| GET / PATCH | `/api/users/profile` | Authenticated user |
| GET / PUT | `/api/users/cart` | Authenticated user |
| DELETE | `/api/users/cart/:productId` | Authenticated user |
| GET | `/api/users/favorites` | Authenticated user |
| POST | `/api/users/favorites/:productId` | Authenticated user |
| GET | `/api/users` | Admin |
| PATCH | `/api/users/:id/ban` | Admin |

Protected endpoints require a valid bearer token. The backend remains authoritative for role and account-status checks.

## Local Setup

### Prerequisites

- Node.js 20 or later
- npm
- MongoDB Atlas or a local MongoDB instance

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Configure `.env` using the placeholders in `backend/.env.example`. Never commit real credentials.

Set `SEED_ADMIN_PASSWORD` to a development-only password of at least eight characters before running the optional seed command. Do not reuse a personal or production password.

### Frontend

From the repository root:

```bash
npm install
npm start
```

The development frontend runs at `http://localhost:4200` and communicates with the configured backend API.

## Verification

Create a production frontend bundle with:

```bash
npm run build
```

The repository does not currently include an automated test suite, so no automated test coverage is claimed. Authentication, cart, favorites, product management, and responsive behavior should be verified before each release.

## Development Seed Data

The backend includes a development-only seed command. It replaces product and user records in the selected database and must only be used with an explicitly designated development database.

No reusable password or production administrator credential is published in this README.

## Project Status

This project is maintained as a portfolio demonstration of full-stack development with Angular, Express, and MongoDB. It is not presented as a production retail service.

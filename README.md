# CarRentalAPI (BookCar)

> ⚠️ **Not actively maintained.** This is a portfolio/learning project from 2020–2023. It was fully modernized in August 2026 (dependencies current, 0 known vulnerabilities at that time), but it receives no ongoing maintenance or support.

REST API for **BookCar**, a car rental service — users register and manage a renter profile (driving licence, Aadhar), browse and filter the car fleet, and book cars; admins manage the fleet and view bookings. The React front end lives in [CarRentalApp](https://github.com/HrithikDalal/CarRentalApp).

![Node](https://img.shields.io/badge/Node-18%2B-339933) ![Express](https://img.shields.io/badge/Express-5-000000) ![MongoDB](https://img.shields.io/badge/Mongoose-8-47A248) ![Maintenance](https://img.shields.io/badge/maintained-no-red)

## Features

- **JWT authentication** — register/login, bcrypt-hashed passwords, `x-auth-token` middleware
- **Role-based authorization** — separate `auth` and `isAdmin` middleware; fleet management is admin-only
- **Renter profiles** — licence/ID details required before booking
- **Car fleet** — CRUD (admin), public browsing and filtering
- **Bookings** — book a car for a date range, view own bookings, admin sees active bookings per car

## Tech stack

Node.js 18+, Express 5, Mongoose 8 (MongoDB), jsonwebtoken 9, express-validator 7, bcryptjs — MVC layout (`routes/` → `controllers/` → `models/`).

## API overview

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/user/register` | public | Register (returns JWT) |
| POST | `/api/user/login` | public | Login (returns JWT) |
| GET | `/api/user` | private | Current user |
| GET | `/api/profile/me` | private | Own renter profile |
| POST | `/api/profile` | private | Create/update profile |
| DELETE | `/api/profile` | private | Delete account & profile |
| GET | `/api/profile` | admin | All profiles |
| GET | `/api/profile/user/:user_id` | admin | Profile by user |
| GET | `/api/cars` | public | List fleet |
| GET | `/api/cars/filter` | public | Filter cars |
| GET | `/api/cars/:car_id` | public | Car details |
| POST/PUT/DELETE | `/api/cars[/:car_id]` | admin | Manage fleet |
| POST | `/api/bookings/:car_id` | private | Book a car |
| GET | `/api/bookings` | private | Own bookings |
| GET | `/api/bookings/:car_id/active` | admin | Active bookings for a car |
| DELETE | `/api/bookings/:booking_id` | private | Cancel booking |

## Getting started

1. `npm install`
2. Create `config/default.json` (**gitignored — never commit credentials**):

   ```json
   {
     "mongoURI": "<your MongoDB connection string>",
     "jwtSecret": "<a long random secret>"
   }
   ```

3. `npm run server` (nodemon) or `npm start` — API on port 5000.

## Security note (2026-08)

In August 2026 this repository's git history was rewritten to purge a `config/production.json` that had been committed in 2020 with a MongoDB Atlas connection string and JWT secret. The Atlas cluster no longer exists, so the credentials were already dead. Commit hashes therefore differ from any pre-2026 clone. Config files are now gitignored.

## History

- **2020** — built as a learning project (Express 4, Mongoose 5).
- **2026-08** — modernized: Express 5, Mongoose 8, jsonwebtoken 9, express-validator 7; all 19 `npm audit` vulnerabilities eliminated; leaked config purged from git history.

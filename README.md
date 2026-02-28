# PayX – Full Stack Banking Application

A full-stack digital wallet and banking application built using **React (Vite)**, **Node.js**, **Express**, and **MongoDB**.

This project simulates real-world digital payment features including authentication, wallet balance management, and secure money transfers using a microservice-based architecture.

---

## Live Deployment: https://paytm-black-psi.vercel.app/

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

### Project Structure
```
payx/
├── frontend/          # React + Vite app
├── backend/           # Express API server
├── dummy-bank-server/ # Simulated bank for on-ramp flow
└── shared_schemas/    # Zod schemas shared across frontend & backend
```

---

## Features

- User Signup & Login
- JWT-based Authentication
- Secure Password Hashing
- Wallet Balance Management
- Transfer Money Between Users
- Bank Service Integration
- Protected Routes
- Axios Interceptors for Auth Handling
- Production-ready CORS Configuration
- Environment-based Configuration Management

---

## Environment Variables

### Frontend (`frontend/.env`)

```
VITE_BACKEND_URL=https://localhost:3000
VITE_BANK_URL=https://localhost:3001
```

### Backend (`backend/.env`)

```
APP_PORT=3000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES="15m"
JWT_REFRESH_KEY=your_refresh_token
JWT_REFRESH_EXPIRES="24h"
FRONTEND_URL=https://localhost:5173
BANK_URL=https://localhost:3001
RESEND_API=google_app_password
EMAIL_FROM=gmail_google
```

### Bank Service (`dummy-bank/.env`)

```
PORT=3001
BACKEND_WEBHOOK_URL=https://localhost:3000
FRONTEND_URL=http://localhost:5173
BANK_BASE_URL=http://localhost:3001
```

---

## Local Development Setup

### Clone the Repository
```
git clone https://github.com/Laxmi-gupta/Paytm.git
cd Paytm
```

### Install Dependencies

Install frontend dependencies:
```
cd frontend
npm install
```

Install backend dependencies:

```
cd backend
npm install
```

Install bank service dependencies:

```
cd dummy-bank
npm install
```

### Run the Application

Run backend:
```
npm run dev
```
Run bank service:

```
nodemon index.js
```

Run frontend:

```
cd frontend
npm run dev
```


### Frontend runs at:
```
http://localhost:5173
```

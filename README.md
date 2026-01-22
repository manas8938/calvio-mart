# 🛒 Calvio Mart - Full-Stack E-Commerce Platform

A production-ready, full-featured e-commerce platform built with React.js, NestJS, PostgreSQL, Swagger, and Docker, serving 1,000+ daily users.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

## 📖 Description

Calvio Mart is a complete e-commerce solution I built as a Full Stack Developer. The platform handles everything from user authentication to order management, featuring a responsive React.js frontend and a secure NestJS backend with 50+ RESTful API endpoints. Currently serving 1,000+ daily users with Docker containerization for reliable deployment.

## ✨ Features

- **Product Management** - Complete CRUD operations for products
- **Shopping Cart** - Add, update, remove items
- **Order System** - Place orders with real-time tracking
- **Authentication** - JWT with OTP email verification
- **Admin Panel** - RBAC-based secure admin dashboard
- **WhatsApp Notifications** - Order confirmations via WhatsApp
- **Payment Gateway** - Secure payment integration
- **Swagger Docs** - Auto-generated API documentation

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React.js, JavaScript, TypeScript, CSS |
| Backend | NestJS, Node.js, TypeORM |
| Database | PostgreSQL |
| Auth | JWT, Bcrypt, OTP |
| Docs | Swagger/OpenAPI |
| DevOps | Docker, Git, CI/CD |
| Integrations | WhatsApp API, Payment Gateway |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Installation
git clone https://github.com/manas8938/calvio-mart.git
cd calvio-mart

# Backend
cd backend
npm install
cp .env.example .env
npm run start:dev

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev

### API Documentation
http://localhost:3000/docs


## 📋 API Endpoints

### Auth

- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/verify-otp` - Verify OTP
- POST `/api/auth/forgot-password` - Password reset

### Products

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (Admin)
- PATCH `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Orders

- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get order details
- POST `/api/orders` - Create order
- PATCH `/api/orders/:id/status` - Update status (Admin)

### Cart

- GET `/api/cart` - Get user cart
- POST `/api/cart/add` - Add to cart
- PATCH `/api/cart/update/:id` - Update cart item
- DELETE `/api/cart/remove/:id` - Remove from cart

### Users

- GET `/api/users` - Get all users (Admin)
- GET `/api/users/:id` - Get user by ID
- PATCH `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user (Admin)

### Payments

- POST `/api/payments/initiate` - Initiate payment
- POST `/api/payments/verify` - Verify payment

## 🐳 Docker


## 📄 License

MIT License

Copyright (c) 2026 Muhammad Anas Nawaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 👨‍💻 Author

**Muhammad Anas Nawaz**

- GitHub: [@manas8938](https://github.com/manas8938)
- LinkedIn: [Muhammad Anas Nawaz](https://linkedin.com/in/muhammad-anas-nawaz-9730a8287)
- Portfolio: [anas-portfolio](https://anas-portfolio-rho.vercel.app/)

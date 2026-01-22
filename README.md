Perfect 👍
Here’s **everything merged into ONE single `README.md`**.
You can copy–paste this **as-is** into GitHub and you’re done. No separate LICENSE file needed.

---

````markdown
# 🛒 Calvio Mart – Full-Stack E-Commerce Platform

A production-ready, full-featured e-commerce platform built with **React.js**, **NestJS**, **PostgreSQL**, **Swagger**, and **Docker**, designed to scale and serve **1,000+ daily users**.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

---

## 📖 Description

**Calvio Mart** is a complete full-stack e-commerce solution developed from scratch.  
It features a responsive **React.js frontend** and a secure, scalable **NestJS backend** exposing **50+ RESTful APIs**, fully documented using **Swagger (OpenAPI)**.

The platform supports authentication, product management, cart operations, order processing, payments, and admin workflows, with **Dockerized deployment** for scalability and reliability.

---

## ✨ Key Features

- JWT-based authentication with OTP email verification  
- Product CRUD operations with admin access  
- Shopping cart management  
- Order placement and status tracking  
- Role-based admin panel (RBAC)  
- Secure payment gateway integration  
- WhatsApp order notifications  
- Auto-generated Swagger API documentation  

---

## 🛠️ Tech Stack

| Layer | Technologies |
|------|-------------|
| Frontend | React.js, JavaScript, TypeScript, CSS |
| Backend | NestJS, Node.js, TypeORM |
| Database | PostgreSQL |
| Authentication | JWT, Bcrypt, OTP |
| API Docs | Swagger / OpenAPI |
| DevOps | Docker, Git |
| Integrations | Payment Gateway, WhatsApp API |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- PostgreSQL `>= 15`
- Docker (optional)

---

### Installation

```bash
git clone https://github.com/manas8938/calvio-mart.git
cd calvio-mart
````

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

#### Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

---

## 📑 API Documentation

Swagger UI available at:

```
http://localhost:3000/docs
```

---

## 📋 API Overview

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/verify-otp`
* POST `/api/auth/forgot-password`

### Products

* GET `/api/products`
* GET `/api/products/:id`
* POST `/api/products` (Admin)
* PATCH `/api/products/:id` (Admin)
* DELETE `/api/products/:id` (Admin)

### Orders

* GET `/api/orders`
* GET `/api/orders/:id`
* POST `/api/orders`
* PATCH `/api/orders/:id/status` (Admin)

### Cart

* GET `/api/cart`
* POST `/api/cart/add`
* PATCH `/api/cart/update/:id`
* DELETE `/api/cart/remove/:id`

### Users

* GET `/api/users` (Admin)
* GET `/api/users/:id`
* PATCH `/api/users/:id`
* DELETE `/api/users/:id` (Admin)

### Payments

* POST `/api/payments/initiate`
* POST `/api/payments/verify`

---

## 🐳 Docker

```bash
docker-compose up -d
```

---

## 📄 License

MIT License

Copyright (c) 2026 Muhammad Anas Nawaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

---

## 👨‍💻 Author

**Muhammad Anas Nawaz**

* GitHub: [https://github.com/manas8938](https://github.com/manas8938)
* LinkedIn: [https://linkedin.com/in/muhammad-anas-nawaz-9730a8287](https://linkedin.com/in/muhammad-anas-nawaz-9730a8287)
* Portfolio: [https://anas-portfolio-rho.vercel.app/](https://anas-portfolio-rho.vercel.app/)

```

---

If you want, I can now:
- Make this **match your SaaS backend README 100%**
- Add **architecture + ER diagram**
- Optimize it for **recruiters / ATS / interviews**

Just tell me 🔥
```

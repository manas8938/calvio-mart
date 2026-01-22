# 🛒 Calvio Mart - Full-Stack E-Commerce Platform

A production-ready, full-featured e-commerce platform built with React.js, NestJS, PostgreSQL, Swagger, and Docker, serving 1,000+ daily users.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📖 Description

Calvio Mart is a complete e-commerce solution I built as a Full Stack Developer. The platform handles everything from user authentication to order management, featuring a responsive React.js frontend and a secure NestJS backend with 50+ RESTful API endpoints. Currently serving 1,000+ daily users with Docker containerization for reliable deployment.

## ✨ Features

### 🛍️ Customer Features
- Browse and search products by category
- Shopping cart management
- Order placement and real-time tracking
- User registration with OTP email verification
- WhatsApp order confirmations
- Secure payment gateway integration

### 👨‍💼 Admin Panel
- Complete admin dashboard
- Product management (Create, Read, Update, Delete)
- Order management and status updates
- User management
- Sales analytics and reports
- Role-based access control (RBAC)

### 🔐 Security Features
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Bcrypt password hashing
- OTP email verification
- Input validation on all endpoints
- Secure API design

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React.js, JavaScript, TypeScript, CSS, Context API |
| **Backend** | NestJS, Node.js, TypeORM, Swagger, Nodemailer |
| **Database** | PostgreSQL |
| **Authentication** | JWT, Bcrypt, OTP Verification |
| **DevOps** | Docker, Git, CI/CD |
| **Integrations** | WhatsApp API, Payment Gateway |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/manas8938/calvio-mart.git
cd calvio-mart

# Backend setup
cd backend
npm install
cp .env.example .env
npm run start:dev

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev

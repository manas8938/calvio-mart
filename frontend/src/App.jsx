// src/App.jsx - COMPLETE & FIXED
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Customer pages
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./screens/Home";
import ProductDetails from "./screens/ProductDetails";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import OTPVerification from "./screens/OTPVerification";
import OrderSuccess from "./screens/OrderSuccess";
import ProfilePage from "./screens/ProfilePage";
import MyOrders from "./screens/MyOrders";

// Admin pages
import AdminLogin from "./screens/admin/AdminLogin";
import AdminSignup from "./screens/admin/AdminSignup";
import AdminLayout from "./AdminLayout";
import Dashboard from "./screens/admin/Dashboard";
import ProductsList from "./screens/admin/ProductsList";
import AddProduct from "./screens/admin/AddProduct";
import EditProduct from "./screens/admin/EditProduct";
import OrdersList from "./screens/admin/OrdersList";

function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="page-content">{children}</main>
      <Footer />
    </>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
      <Route path="/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
      <Route path="/verify-otp" element={<Layout><OTPVerification /></Layout>} />
      <Route path="/order-success" element={<Layout><OrderSuccess /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/my-orders" element={<Layout><MyOrders /></Layout>} />

      {/* Admin Auth Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<OrdersList />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import UserDashboardPage from './pages/UserDashboardPage';
import SuccessPage from './pages/SuccessPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import SearchPage from './pages/SearchPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard';
import AddProduct from './admin/AddProduct';
import ManageProducts from './admin/ManageProducts';
import Orders from './admin/Orders';
import Returns from './admin/Returns';
import Payments from './admin/Payments';
import Delivery from './admin/Delivery';

import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';

import './index.css';
import './styles/MobileOptimization.css';
import './styles/GlobalFixes.css';
import './styles/AdminProtection.css';
import './components/MobileUtils.css';

// Layout wrapper component
const Layout = ({ children }) => (
  <div className="app-container">
    <Header />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="returns" element={<Returns />} />
          <Route path="payments" element={<Payments />} />
          <Route path="delivery" element={<Delivery />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/search" element={<Layout><SearchPage /></Layout>} />
        <Route path="/success" element={<Layout><SuccessPage /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
        <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />
        
        {/* Protected routes */}
        <Route path="/user/dashboard/*" element={<Layout><PrivateRoute><UserDashboardPage /></PrivateRoute></Layout>} />
        <Route path="/orders" element={<Layout><PrivateRoute><OrdersPage /></PrivateRoute></Layout>} />
        <Route path="/checkout" element={<Layout><PrivateRoute><CheckoutPage /></PrivateRoute></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;

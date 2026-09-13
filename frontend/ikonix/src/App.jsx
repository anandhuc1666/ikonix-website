import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ======================================================
// ADMIN
// ======================================================

import AdminLogin from "./controller/auth/AdminLogin.jsx";
import ProtectedRoute from "./controller/auth/ProtectedRoute.jsx";
import AdminLayout from "./controller/AdminLayout.jsx";

import Dashboard from "./controller/dashboard/Dashboard.jsx";
import Categoris from "./controller/categorys/Categoris.jsx";
import Brand from "./controller/brands/Brand.jsx";
import Products from "./controller/products/Products.jsx";

import AddBrand from "./controller/brands/AddBrand.jsx";
import UpdateBrand from "./controller/brands/UpdateBrand.jsx";

import AddProduct from "./controller/products/AddProduct.jsx";
import ProductEdit from "./controller/products/ProductEdit.jsx";
import Order from "./controller/Order/Order.jsx";

// ======================================================
// USER
// ======================================================

import UserLayout from "./controllers/UserLayout.jsx";
import Homes from "./controllers/Home/Home.jsx";
import ProductsPage from "./controllers/Products/ProductsPage.jsx";
import Brands from "./controllers/Brands/Brands.jsx";
import Contacts from "./controllers/Contacts/Contacts.jsx";
import AboutPage from "./controllers/About/AboutPage.jsx";
import PageLess from "./controllers/pageless/PageLess.jsx";
import ProductDetails from "./controllers/Products/ProductDetails.jsx";
import BrandProducts from "./controllers/Brands/BrandProducts.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================================================
            USER SECTION
        ================================================== */}

        <Route element={<UserLayout />}>
          <Route path="/" element={<Homes />} />

          <Route path="/products/page" element={<ProductsPage />} />

          <Route path="/brands/page" element={<Brands />} />

          <Route path="/about/page" element={<AboutPage />} />

          <Route path="/contact/page" element={<Contacts />} />

          <Route path="/products/page/:id" element={<ProductDetails />} />

          <Route path="/brands/page/:brandName" element={<BrandProducts />} />
        </Route>

        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ==================================================
            PROTECTED ADMIN
        ================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* ============================
                DASHBOARD
            ============================ */}

            <Route path="/admin/dashboard" element={<Dashboard />} />

            {/* ============================
                CATEGORIES
            ============================ */}

            <Route path="/admin/categories" element={<Categoris />} />

            {/* ============================
                BRANDS
            ============================ */}

            <Route path="/admin/brands" element={<Brand />} />

            <Route path="/admin/brands/add" element={<AddBrand />} />

            <Route path="/admin/brands/edit/:id" element={<UpdateBrand />} />

            {/* ============================
                PRODUCTS
            ============================ */}

            <Route path="/admin/products" element={<Products />} />

            <Route path="/admin/products/AddProduct" element={<AddProduct />} />

            <Route path="/admin/products/edit/:id" element={<ProductEdit />} />

            <Route path="/admin/orders" element={<Order />} />
          </Route>
        </Route>

        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route path="*" element={<PageLess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

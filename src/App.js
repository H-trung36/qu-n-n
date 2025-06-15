import { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import Cart from "./components/Cart/Cart";
import CartProvider from "./store/CartProvider";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminLayout from "./components/Layout/AdminLayout";

function App() {
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  return (
    <HashRouter>
      <CartProvider>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                {cartIsShown && <Cart onClose={hideCartHandler} />}
                <Header onShowCart={showCartHandler} />
                <main>
                  <Meals />
                </main>
              </>
            }
          />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect to home if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </HashRouter>
  );
}

export default App;

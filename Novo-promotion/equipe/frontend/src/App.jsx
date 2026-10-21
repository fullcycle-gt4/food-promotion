import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth.jsx';
import ClientLayout from './layouts/ClientLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

import Catalog from './pages/client/Catalog.jsx';
import ProductDetail from './pages/client/ProductDetail.jsx';
import Cart from './pages/client/Cart.jsx';
import MyOrders from './pages/client/MyOrders.jsx';
import ClientProfile from './pages/client/Profile.jsx';

import AdminProducts from './pages/admin/Products.jsx';
import ProductForm from './pages/admin/ProductForm.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminProfile from './pages/admin/Profile.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      <Route
        element={
          <RequireAuth role="client">
            <ClientLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Catalog />} />
        <Route path="produtos/:id" element={<ProductDetail />} />
        <Route path="carrinho" element={<Cart />} />
        <Route path="pedidos" element={<MyOrders />} />
        <Route path="perfil" element={<ClientProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="produtos" replace />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="produtos/novo" element={<ProductForm />} />
        <Route path="produtos/:id/editar" element={<ProductForm />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="perfil" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

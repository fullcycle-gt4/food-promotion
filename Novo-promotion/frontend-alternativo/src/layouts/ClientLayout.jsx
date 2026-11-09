import { Outlet, useLocation } from 'react-router-dom';
import AppShell from './AppShell.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ClientLayout() {
  const { pathname } = useLocation();
  const { count } = useCart();
  if (pathname === '/') return <Outlet />;

  return (
    <AppShell
      nav={[
        { to: '/', label: 'Produtos', icon: 'products', end: true },
        { to: '/carrinho', label: 'Carrinho', badge: count || null },
        { to: '/pedidos', label: 'Meus pedidos' },
        { to: '/perfil', label: 'Perfil' },
      ]}
    />
  );
}

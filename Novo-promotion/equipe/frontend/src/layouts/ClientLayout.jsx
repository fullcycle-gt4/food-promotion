import AppShell from './AppShell.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ClientLayout() {
  const { count } = useCart();
  return (
    <AppShell
      nav={[
        { to: '/', label: 'Ofertas', end: true },
        { to: '/carrinho', label: 'Carrinho', badge: count || null },
        { to: '/pedidos', label: 'Meus pedidos' },
        { to: '/perfil', label: 'Perfil' },
      ]}
    />
  );
}

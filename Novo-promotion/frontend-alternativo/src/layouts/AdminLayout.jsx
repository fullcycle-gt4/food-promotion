import { useNavigate } from 'react-router-dom';
import AppShell from './AppShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell
      onLogout={() => {
        logout();
        navigate('/login', { replace: true });
      }}
      nav={[
        { to: '/admin', label: 'Início', end: true },
        { to: '/admin/produtos', label: 'Produtos', end: true },
        { to: '/admin/produtos/novo', label: 'Cadastrar produto' },
        { to: '/admin/pedidos', label: 'Pedidos' },
        { to: '/admin/usuarios', label: 'Usuários e perfis' },
        { to: '/admin/relatorios', label: 'Relatórios' },
        { to: '/admin/perfil', label: 'Perfil' },
      ]}
    />
  );
}

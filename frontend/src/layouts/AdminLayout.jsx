import AppShell from './AppShell.jsx';

export default function AdminLayout() {
  return (
    <AppShell
      nav={[
        { to: '/admin/produtos', label: 'Produtos', end: true },
        { to: '/admin/produtos/novo', label: 'Cadastrar produto' },
        { to: '/admin/pedidos', label: 'Pedidos' },
        { to: '/admin/perfil', label: 'Perfil' },
      ]}
    />
  );
}

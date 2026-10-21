import { Link } from 'react-router-dom';
import { Card, PageHeader } from '../../components/ui.jsx';

const sections = [
  {
    title: 'Produtos',
    description: 'Consulte, edite e remova produtos cadastrados.',
    to: '/admin/produtos',
  },
  {
    title: 'Cadastrar produtos',
    description: 'Inclua um novo produto no catálogo.',
    to: '/admin/produtos/novo',
  },
  {
    title: 'Pedidos',
    description: 'Acompanhe pedidos e atualize seus status.',
    to: '/admin/pedidos',
  },
  {
    title: 'Usuários e perfis',
    description: 'Crie administradores e gerencie os perfis de acesso.',
    to: '/admin/usuarios',
  },
  {
    title: 'Relatórios',
    description: 'Veja um resumo dos produtos, pedidos e vendas.',
    to: '/admin/relatorios',
  },
  {
    title: 'Perfil',
    description: 'Gerencie os dados da sua conta administrativa.',
    to: '/admin/perfil',
  },
];

export default function AdminDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Área administrativa"
        title="Início"
        subtitle="Acesse rapidamente as ferramentas de administração do sistema."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className="group rounded-md text-brand no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Card className="flex h-full min-h-36 flex-col justify-between p-5 transition-colors group-hover:border-brand group-hover:bg-[#f8f9f6]">
              <div>
                <h2 className="text-[16px] font-semibold">{section.title}</h2>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">{section.description}</p>
              </div>
              <span className="mt-5 self-end text-lg font-semibold" aria-hidden="true">→</span>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

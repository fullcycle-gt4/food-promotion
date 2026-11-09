import { orderService, productService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { Card, EmptyState, Loading, PageHeader } from '../../components/ui.jsx';
import { money } from '../../utils/format';

export default function AdminReports() {
  const { data, error } = useAsync(async () => {
    const [products, orders] = await Promise.all([
      productService.list(),
      orderService.list(),
    ]);
    return { products, orders };
  }, []);

  if (error) {
    return <EmptyState role="alert">Não foi possível carregar os relatórios: {error.message}</EmptyState>;
  }
  if (!data) return <Loading />;

  const revenue = data.orders
    .filter((order) => order.status === 'done')
    .reduce((total, order) => total + order.total, 0);
  const pendingOrders = data.orders.filter((order) => order.status === 'waiting').length;
  const availableProducts = data.products.filter((product) => product.stock > 0).length;
  const metrics = [
    { label: 'Produtos cadastrados', value: data.products.length },
    { label: 'Produtos disponíveis', value: availableProducts },
    { label: 'Pedidos aguardando', value: pendingOrders },
    { label: 'Vendas concluídas', value: money(revenue) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Conta administrativa"
        title="Relatórios"
        subtitle="Resumo do catálogo, dos pedidos e das vendas concluídas."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <p className="text-[11px] text-muted">{metric.label}</p>
            <strong className="mt-2 block text-2xl font-semibold text-brand">{metric.value}</strong>
          </Card>
        ))}
      </div>
    </>
  );
}

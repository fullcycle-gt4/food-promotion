import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import OrderDetail from '../../components/OrderDetail.jsx';
import { BackLink, Button, Divider, EmptyState, Loading, PageHeader, StatusBadge, Table, Tr } from '../../components/ui.jsx';
import { money } from '../../utils/format';
import { formatDate, formatDateTime } from '../../utils/date';
import { deliveryLabel, paymentLabel } from '../../utils/labels';

const COLS = '.7fr 1.2fr .6fr .9fr 1fr 1.3fr';

export default function MyOrders() {
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const { data: orders, setData } = useAsync(() => orderService.list({ clientId: user.id }), [user.id]);
  const [selId, setSelId] = useState(location.state?.highlight ?? null);

  const list = orders || [];
  const sel = list.find((o) => o.id === selId) || list[0];

  const cancel = async () => {
    if (!window.confirm(`Cancelar o pedido #${sel.id}?`)) return;
    const u = await orderService.updateStatus(sel.id, 'canceled');
    setData((l) => l.map((o) => (o.id === u.id ? u : o)));
    toast(`Pedido #${u.id} cancelado`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Minha conta"
        title="Meus pedidos"
        subtitle="Acompanhe suas reservas e o prazo de retirada."
        action={<BackLink to="/">Ver ofertas</BackLink>}
      />
      {!orders ? (
        <Loading />
      ) : list.length === 0 ? (
        <EmptyState>
          Você ainda não fez pedidos.{' '}
          <Link to="/" className="font-semibold">
            Ver ofertas
          </Link>
        </EmptyState>
      ) : (
        <>
          <Table cols={COLS} head={['Nº', 'Data', 'Itens', 'Total', 'Retirar até', 'Status']}>
            {list.map((o) => (
              <Tr key={o.id} cols={COLS} onClick={() => setSelId(o.id)} active={sel?.id === o.id}>
                <span className="font-semibold text-brand">#{o.id}</span>
                <span>{formatDateTime(o.createdAt)}</span>
                <span>{o.itemsCount}</span>
                <span className="font-semibold">{money(o.total)}</span>
                <span>{formatDate(o.pickupUntil)}</span>
                <span>
                  <StatusBadge status={o.status} />
                </span>
              </Tr>
            ))}
          </Table>
          {sel && (
            <>
              <Divider className="mb-5 mt-6" />
              <OrderDetail
                order={sel}
                subtitle={`${deliveryLabel[sel.delivery]} · ${paymentLabel[sel.payment]} · Retirar até ${formatDate(sel.pickupUntil)}`}
                actions={
                  sel.status === 'waiting' && (
                    <Button variant="danger" onClick={cancel}>
                      Cancelar pedido
                    </Button>
                  )
                }
              />
            </>
          )}
        </>
      )}
    </>
  );
}

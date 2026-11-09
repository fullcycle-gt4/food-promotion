import { useState } from 'react';
import { orderService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../components/Toast.jsx';
import OrderDetail from '../../components/OrderDetail.jsx';
import {
  Button, Chip, Divider, EmptyState, Input, Loading, PageHeader, StatusBadge, Table, Tr,
} from '../../components/ui.jsx';
import { money } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { ORDER_STATUS, deliveryLabel, paymentLabel } from '../../utils/labels';

const COLS = '.7fr 1.6fr .6fr .9fr 1fr 1.3fr 70px';
const TABS = [{ value: 'all', label: 'Todos' }, ...ORDER_STATUS];

export default function AdminOrders() {
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [selId, setSelId] = useState(null);
  const { data: orders, setData } = useAsync(() => orderService.list(), []);

  const all = orders || [];
  const term = q.trim().toLowerCase();
  const filtered = all.filter(
    (o) => (tab === 'all' || o.status === tab) && (!term || String(o.id).includes(term) || o.clientName.toLowerCase().includes(term)),
  );
  const sel = filtered.find((o) => o.id === selId) || filtered[0];

  const setStatus = async (status) => {
    if (status === 'canceled' && !window.confirm(`Cancelar o pedido #${sel.id}?`)) return;
    const u = await orderService.updateStatus(sel.id, status);
    setData((list) => list.map((o) => (o.id === u.id ? u : o)));
    toast(status === 'done' ? `Retirada do pedido #${u.id} confirmada` : `Pedido #${u.id} cancelado`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Conta administrativa"
        title="Pedidos"
        subtitle="Acompanhe as reservas dos clientes e confirme as retiradas."
        action={<Input className="w-full sm:w-[220px]" placeholder="Buscar por nº ou cliente" aria-label="Buscar pedido" value={q} onChange={(e) => setQ(e.target.value)} />}
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Chip key={t.value} active={tab === t.value} onClick={() => setTab(t.value)}>
            {t.label} · {t.value === 'all' ? all.length : all.filter((o) => o.status === t.value).length}
          </Chip>
        ))}
      </div>

      <div className="mt-4">
        {!orders ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <EmptyState>Nenhum pedido encontrado.</EmptyState>
        ) : (
          <Table cols={COLS} minWidth={720} head={['Nº', 'Cliente', 'Itens', 'Total', 'Retirar até', 'Status', '']}>
            {filtered.map((o) => (
              <Tr key={o.id} cols={COLS} onClick={() => setSelId(o.id)} active={sel?.id === o.id}>
                <span className="font-semibold text-brand">#{o.id}</span>
                <span>{o.clientName}</span>
                <span>{o.itemsCount}</span>
                <span className="font-semibold">{money(o.total)}</span>
                <span>{formatDate(o.pickupUntil)}</span>
                <span>
                  <StatusBadge status={o.status} />
                </span>
                <Button variant="outline" size="sm">
                  Ver
                </Button>
              </Tr>
            ))}
          </Table>
        )}
      </div>

      {sel && (
        <>
          <Divider className="mb-5 mt-[26px]" />
          <OrderDetail
            order={sel}
            subtitle={`${sel.clientName} · ${sel.clientPhone} · ${paymentLabel[sel.payment]} · ${deliveryLabel[sel.delivery]}`}
            actions={
              sel.status === 'waiting' && (
                <div className="flex gap-2">
                  <Button variant="danger" onClick={() => setStatus('canceled')}>
                    Cancelar pedido
                  </Button>
                  <Button onClick={() => setStatus('done')}>Confirmar retirada</Button>
                </div>
              )
            }
          />
        </>
      )}
    </>
  );
}

import { SectionTitle, Table, Tr } from './ui.jsx';
import { money } from '../utils/format';
import { formatDate } from '../utils/date';

const COLS = '2fr 1fr .6fr 1fr';

export default function OrderDetail({ order, subtitle, actions }) {
  return (
    <section>
      <SectionTitle title={`Pedido #${order.id}`} subtitle={subtitle} action={actions} />
      <div className="mt-3.5">
        <Table
          cols={COLS}
          minWidth={520}
          head={['Produto', 'Vencimento', 'Qtd.', 'Subtotal']}
          footer={
            <div className="flex items-baseline justify-end gap-4 border-t border-zebra px-4 py-3">
              <span className="font-semibold">Total</span>
              <span className="text-base font-semibold text-brand">{money(order.total)}</span>
            </div>
          }
        >
          {order.items.map((it) => (
            <Tr key={it.productId} cols={COLS}>
              <span className="font-semibold text-brand">{it.name}</span>
              <span>{formatDate(it.expiresAt)}</span>
              <span>{it.qty}</span>
              <span>{money(it.qty * it.unitPrice)}</span>
            </Tr>
          ))}
        </Table>
      </div>
      {order.notes && <p className="mt-2.5 text-[11px] text-muted">Observações: {order.notes}</p>}
    </section>
  );
}

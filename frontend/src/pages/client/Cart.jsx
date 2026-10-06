import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import {
  BackLink, Badge, Button, Card, Divider, EmptyState, ImagePlaceholder, Input, PageHeader, QtyStepper,
  SectionTitle, Select, Table, Tr,
} from '../../components/ui.jsx';
import { money } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { DELIVERY_METHODS, PAYMENT_METHODS } from '../../utils/labels';

const COLS = '2.2fr 1fr 1fr 1.1fr 1fr 80px';

export default function Cart() {
  const { items, setQty, remove, clear, totals, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [delivery, setDelivery] = useState(DELIVERY_METHODS[0].value);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].value);
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const checkout = async () => {
    setSending(true);
    setError('');
    try {
      const order = await orderService.create({
        client: user,
        items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
        delivery,
        payment,
        notes,
      });
      clear();
      toast(`Pedido #${order.id} realizado`);
      navigate('/pedidos', { state: { highlight: order.id } });
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Sua compra"
        title="Carrinho"
        subtitle={`${count} ${count === 1 ? 'item selecionado' : 'itens selecionados'}. Retire antes da data de vencimento.`}
        action={<BackLink to="/">Continuar comprando</BackLink>}
      />

      {items.length === 0 ? (
        <EmptyState>
          Seu carrinho está vazio.{' '}
          <Link to="/" className="font-semibold">
            Ver ofertas
          </Link>
        </EmptyState>
      ) : (
        <>
          <SectionTitle title="Itens do carrinho" />
          <div className="mt-3.5">
            <Table cols={COLS} minWidth={700} head={['Produto', 'Vencimento', 'Preço', 'Qtd.', 'Subtotal', '']}>
              {items.map(({ product: p, qty }) => (
                <Tr key={p.id} cols={COLS}>
                  <Link to={`/produtos/${p.id}`} className="flex items-center gap-3">
                    <ImagePlaceholder src={p.images?.[0]} className="h-10 w-10 shrink-0 rounded" />
                    <span className="font-semibold leading-snug text-brand">{p.name}</span>
                  </Link>
                  <span>{formatDate(p.expiresAt)}</span>
                  <span>{money(p.promoPrice)}</span>
                  <QtyStepper size="sm" value={qty} max={p.stock} onChange={(q) => setQty(p.id, q)} />
                  <span className="font-semibold">{money(p.promoPrice * qty)}</span>
                  <Button variant="danger" size="sm" onClick={() => remove(p.id)}>
                    Remover
                  </Button>
                </Tr>
              ))}
            </Table>
          </div>

          <Divider className="my-7" />

          <div className="grid items-start gap-7 md:grid-cols-[minmax(0,1fr)_300px]">
            <div className="flex flex-col gap-3.5">
              <SectionTitle title="Retirada e pagamento" subtitle="Escolha como deseja receber e pagar." />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select label="Forma de entrega" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                  {DELIVERY_METHODS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </Select>
                <Select label="Pagamento" value={payment} onChange={(e) => setPayment(e.target.value)}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Input label="Observações" placeholder="Ex.: retirar após 18h" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <Card className="flex flex-col gap-2.5 p-[18px] text-xs">
              <h3 className="mb-1 text-[15px] font-semibold text-brand">Resumo</h3>
              <div className="flex justify-between">
                <span className="text-muted">Preço original</span>
                <span className="text-faint line-through">{money(totals.original)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Economia</span>
                <Badge className="text-xs">− {money(totals.savings)}</Badge>
              </div>
              <Divider className="my-1 bg-zebra" />
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-[22px] font-semibold text-brand">{money(totals.total)}</span>
              </div>
              {error && <p className="text-[11px] text-danger">{error}</p>}
              <Button size="lg" className="mt-1.5" disabled={sending} onClick={checkout}>
                {sending ? 'Enviando…' : 'Finalizar compra'}
              </Button>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

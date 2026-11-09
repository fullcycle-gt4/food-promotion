import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import {
  BackLink, Badge, Button, Divider, EmptyState, ExpiryBadge, ImagePlaceholder, Label, LinkButton,
  Loading, PageHeader, Price, QtyStepper, Table, Tr, cx,
} from '../../components/ui.jsx';
import { money } from '../../utils/format';
import { formatDate } from '../../utils/date';

const COLS = '2fr 1fr 1fr 1fr 80px';

export default function ProductDetail() {
  const { id } = useParams();
  const { add, items } = useCart();
  const toast = useToast();
  const { data: p, error } = useAsync(() => productService.get(id), [id]);
  const { data: related } = useAsync(
    () => (p ? productService.list({ category: p.category, onlyAvailable: true }) : Promise.resolve([])),
    [p?.category],
  );
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  useEffect(() => {
    setQty(1);
    setImg(0);
  }, [id]);

  if (error)
    return (
      <EmptyState>
        Produto não encontrado.{' '}
        <Link to="/" className="font-semibold">
          Voltar às ofertas
        </Link>
      </EmptyState>
    );
  if (!p || String(p.id) !== String(id)) return <Loading />;

  const inCart = items.find((i) => i.product.id === p.id)?.qty || 0;
  const max = Math.max(0, p.stock - inCart);
  const others = (related || []).filter((r) => r.id !== p.id).slice(0, 4);

  const onAdd = () => {
    add(p, qty);
    toast(`${qty}× ${p.name} adicionado ao carrinho`);
    setQty(1);
  };

  return (
    <>
      <PageHeader
        eyebrow={`Ofertas / ${p.category}`}
        title={p.name}
        subtitle={p.store ? `Vendido por ${p.store.name} · ${p.store.city}` : undefined}
        action={<BackLink to="/">Voltar às ofertas</BackLink>}
      />

      <div className="grid gap-8 md:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2.5">
          <ImagePlaceholder src={p.images?.[img]} label="foto principal do produto" className="h-[320px] rounded-md border border-line" />
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`Foto ${i + 1}`}
                onClick={() => p.images?.[i] && setImg(i)}
                className={cx('h-[84px] overflow-hidden rounded border', i === img ? 'border-brand' : 'border-line')}
              >
                <ImagePlaceholder src={p.images?.[i]} className="h-full" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <Badge tone="yellow" className="px-2.5 text-[11px]">
              -{p.discount}%
            </Badge>
            <ExpiryBadge date={p.expiresAt} />
          </div>
          <Price promo={p.promoPrice} original={p.originalPrice} size="lg" />
          <div className="grid grid-cols-2 rounded-md border border-line bg-white">
            <div className="border-r border-line px-4 py-3.5">
              <Label>Vencimento</Label>
              <p className="mt-1.5 text-sm font-semibold">{formatDate(p.expiresAt)}</p>
            </div>
            <div className="px-4 py-3.5">
              <Label>Estoque</Label>
              <p className="mt-1.5 text-sm font-semibold">{p.stock} un.</p>
            </div>
          </div>
          {p.description && (
            <div>
              <h2 className="text-[15px] font-semibold text-brand">Descrição</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-body text-pretty">{p.description}</p>
            </div>
          )}
          <Divider />
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold">Quantidade</p>
              <QtyStepper value={Math.min(qty, Math.max(1, max))} onChange={setQty} max={Math.max(1, max)} />
            </div>
            <Button size="lg" disabled={max === 0} onClick={onAdd}>
              {max === 0 ? 'Estoque máximo no carrinho' : `Adicionar ao carrinho · ${money(p.promoPrice * qty)}`}
            </Button>
          </div>
          <p className="text-[11px] text-muted">Você economiza {money((p.originalPrice - p.promoPrice) * qty)} nesta compra.</p>
        </div>
      </div>

      {others.length > 0 && (
        <>
          <Divider className="mb-5 mt-8" />
          <h2 className="text-[17px] font-semibold text-brand">Outras ofertas em {p.category}</h2>
          <div className="mt-3.5">
            <Table cols={COLS} head={['Produto', 'Preço', 'Desconto', 'Vencimento', '']}>
              {others.map((r) => (
                <Tr key={r.id} cols={COLS}>
                  <span className="font-semibold text-brand">{r.name}</span>
                  <span>{money(r.promoPrice)}</span>
                  <span>{r.discount}%</span>
                  <span>{formatDate(r.expiresAt)}</span>
                  <LinkButton to={`/produtos/${r.id}`} variant="outline" size="sm">
                    Ver
                  </LinkButton>
                </Tr>
              ))}
            </Table>
          </div>
        </>
      )}
    </>
  );
}

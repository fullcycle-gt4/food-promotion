import { Link } from 'react-router-dom';
import { Badge, Button, ExpiryBadge, ImagePlaceholder, Price } from './ui.jsx';

// `preview` desativa links e botão (usado na prévia do cadastro)
export default function ProductCard({ product, onAdd, preview = false }) {
  const Wrap = preview ? 'div' : Link;
  const to = preview ? undefined : `/produtos/${product.id}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
      <Wrap to={to} className="relative block">
        <ImagePlaceholder src={product.images?.[0]} label="foto do produto" className="h-[130px]" />
        <Badge tone="yellow" className="absolute left-2.5 top-2.5 text-[11px]">
          -{product.discount || 0}%
        </Badge>
      </Wrap>
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3.5">
        <p className="text-[10px] text-muted">{product.category || 'Categoria'}</p>
        <Wrap to={to} className="text-sm font-semibold leading-snug text-brand text-pretty hover:underline">
          {product.name || 'Nome do produto'}
        </Wrap>
        <Price promo={product.promoPrice} original={product.originalPrice} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <ExpiryBadge date={product.expiresAt} />
          {!preview && onAdd && (
            <Button size="sm" onClick={() => onAdd(product)}>
              Adicionar
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

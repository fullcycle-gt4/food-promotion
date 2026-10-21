import { useState } from 'react';
import { categoryService, productService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import { Chip, EmptyState, Input, Loading, PageHeader } from '../../components/ui.jsx';

export default function Catalog() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { add } = useCart();
  const toast = useToast();
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const { data: products } = useAsync(
    () => productService.list({ category, search, onlyAvailable: true, sort: 'expiresAt' }),
    [category, search],
  );

  const handleAdd = (p) => {
    add(p, 1);
    toast(`${p.name} adicionado ao carrinho`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Ofertas da semana"
        title="Produtos perto do vencimento"
        subtitle="Itens em perfeito estado com até 60% de desconto."
        action={
          <Input
            className="w-full sm:w-[220px]"
            placeholder="Buscar produto"
            aria-label="Buscar produto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
      <div className="flex flex-wrap gap-2">
        <Chip active={!category} onClick={() => setCategory('')}>
          Todos
        </Chip>
        {categories?.map((c) => (
          <Chip key={c.id} active={category === c.name} onClick={() => setCategory(c.name)}>
            {c.name}
          </Chip>
        ))}
      </div>
      {!products ? (
        <Loading />
      ) : products.length === 0 ? (
        <EmptyState className="mt-5">Nenhuma oferta encontrada.</EmptyState>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </>
  );
}

import { useState } from 'react';
import { categoryService, productService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../components/Toast.jsx';
import {
  Badge, Button, EmptyState, Input, LinkButton, Loading, PageHeader, Select, Table, Tr,
} from '../../components/ui.jsx';
import { money } from '../../utils/format';
import { daysUntil, formatDate } from '../../utils/date';

const COLS = '2fr 1.3fr .9fr .9fr .7fr 1fr 130px';

export default function AdminProducts() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('expiresAt');
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const { data: products, reload } = useAsync(
    () => productService.list({ search, category, sort }),
    [search, category, sort],
  );

  const remove = async (p) => {
    if (!window.confirm(`Excluir "${p.name}"?`)) return;
    await productService.remove(p.id);
    toast('Produto excluído');
    reload();
  };

  return (
    <>
      <PageHeader
        eyebrow="Conta administrativa"
        title="Produtos cadastrados"
        subtitle={products ? `${products.length} itens no catálogo.` : ' '}
        action={<LinkButton to="/admin/produtos/novo">Cadastrar produto</LinkButton>}
      />

      <div className="flex flex-wrap gap-3">
        <Input className="min-w-[200px] flex-1" placeholder="Buscar por nome" aria-label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select className="w-full sm:w-[200px]" aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select className="w-full sm:w-[200px]" aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="expiresAt">Vencimento: mais próximo</option>
          <option value="discount">Maior desconto</option>
        </Select>
      </div>

      <div className="mt-4">
        {!products ? (
          <Loading />
        ) : products.length === 0 ? (
          <EmptyState>Nenhum produto encontrado.</EmptyState>
        ) : (
          <Table cols={COLS} minWidth={760} head={['Produto', 'Categoria', 'Preço', 'Promoção', 'Estoque', 'Vencimento', '']}>
            {products.map((p) => {
              const d = daysUntil(p.expiresAt);
              return (
                <Tr key={p.id} cols={COLS}>
                  <span className="pr-2.5 font-semibold leading-snug text-brand">{p.name}</span>
                  <span className="text-body">{p.category}</span>
                  <span className="text-faint line-through">{money(p.originalPrice)}</span>
                  <span className="font-semibold">{money(p.promoPrice)}</span>
                  <span>{p.stock} un.</span>
                  <span>
                    {d < 0 ? (
                      <Badge tone="red">{formatDate(p.expiresAt)}</Badge>
                    ) : d <= 3 ? (
                      <Badge tone="orange" className="text-[11px]">{formatDate(p.expiresAt)}</Badge>
                    ) : (
                      formatDate(p.expiresAt)
                    )}
                  </span>
                  <div className="flex justify-end gap-1.5">
                    <LinkButton to={`/admin/produtos/${p.id}/editar`} variant="outline" size="sm">
                      Editar
                    </LinkButton>
                    <Button variant="danger" size="sm" onClick={() => remove(p)}>
                      Excluir
                    </Button>
                  </div>
                </Tr>
              );
            })}
          </Table>
        )}
      </div>
      <p className="mt-3 text-[11px] text-muted">Datas em destaque vencem nos próximos 3 dias.</p>
    </>
  );
}

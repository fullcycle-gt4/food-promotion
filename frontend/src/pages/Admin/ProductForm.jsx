import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService, productService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../components/Toast.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import {
  BackLink, Button, Divider, Input, Label, Loading, PageHeader, SectionTitle, Select, Textarea,
} from '../../components/ui.jsx';
import { discountOf, parseMoney, toMoneyInput } from '../../utils/format';

const empty = {
  name: '', brand: '', category: '', description: '',
  originalPrice: '', promoPrice: '', discount: '',
  stock: '', expiresAt: '', batch: '', images: [],
};

const readFile = (file) =>
  new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.readAsDataURL(file);
  });

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      setForm(empty);
      setLoading(false);
      return;
    }
    setLoading(true);
    productService
      .get(id)
      .then((p) =>
        setForm({
          ...empty,
          ...p,
          originalPrice: toMoneyInput(p.originalPrice),
          promoPrice: toMoneyInput(p.promoPrice),
          discount: String(p.discount),
          stock: String(p.stock),
        }),
      )
      .catch(() => navigate('/admin/produtos', { replace: true }))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Preço original, preço promocional e desconto se recalculam entre si
  const onOriginal = (e) => {
    const v = e.target.value;
    setForm((f) => {
      const o = parseMoney(v);
      const d = parseFloat(f.discount);
      return { ...f, originalPrice: v, promoPrice: o > 0 && d >= 0 ? toMoneyInput(o * (1 - d / 100)) : f.promoPrice };
    });
  };
  const onPromo = (e) => {
    const v = e.target.value;
    setForm((f) => {
      const o = parseMoney(f.originalPrice);
      const p = parseMoney(v);
      return { ...f, promoPrice: v, discount: o > 0 && p >= 0 ? String(discountOf(o, p)) : f.discount };
    });
  };
  const onDiscount = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 3);
    setForm((f) => {
      const d = Math.min(100, Number(v || 0));
      const o = parseMoney(f.originalPrice);
      return { ...f, discount: v === '' ? '' : String(d), promoPrice: o > 0 && v !== '' ? toMoneyInput(o * (1 - d / 100)) : f.promoPrice };
    });
  };

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - form.images.length);
    e.target.value = '';
    const urls = await Promise.all(files.map(readFile));
    setForm((f) => ({ ...f, images: [...f.images, ...urls].slice(0, 3) }));
  };
  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e = {};
    const o = parseMoney(form.originalPrice);
    const p = parseMoney(form.promoPrice);
    if (!form.name.trim()) e.name = 'Informe o nome.';
    if (!form.category) e.category = 'Escolha a categoria.';
    if (!(o > 0)) e.originalPrice = 'Valor inválido.';
    if (!(p > 0)) e.promoPrice = 'Valor inválido.';
    else if (o > 0 && p > o) e.promoPrice = 'Maior que o preço original.';
    if (form.discount === '' || Number(form.discount) > 100) e.discount = 'Entre 0 e 100.';
    if (!/^\d+$/.test(String(form.stock))) e.stock = 'Informe a quantidade.';
    if (!form.expiresAt) e.expiresAt = 'Informe a data.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      description: form.description.trim(),
      originalPrice: parseMoney(form.originalPrice),
      promoPrice: parseMoney(form.promoPrice),
      discount: Number(form.discount),
      stock: Number(form.stock),
      expiresAt: form.expiresAt,
      batch: form.batch.trim(),
      images: form.images,
    };
    if (isEdit) await productService.update(id, payload);
    else await productService.create(payload);
    toast(isEdit ? 'Produto atualizado' : 'Produto cadastrado');
    navigate('/admin/produtos');
  };

  if (loading) return <Loading />;

  const preview = {
    ...form,
    originalPrice: parseMoney(form.originalPrice) || 0,
    promoPrice: parseMoney(form.promoPrice) || 0,
    discount: Number(form.discount) || 0,
  };

  return (
    <>
      <PageHeader
        eyebrow="Conta administrativa"
        title={isEdit ? 'Editar produto' : 'Cadastrar produto'}
        subtitle="Os dados informados aqui aparecem no catálogo de ofertas."
        action={<BackLink to="/admin/produtos">Voltar aos produtos</BackLink>}
      />

      <form onSubmit={submit} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="flex flex-col gap-[18px]">
          <section>
            <SectionTitle title="Informações do produto" subtitle="Nome, categoria e descrição exibidos ao cliente." />
            <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
              <Input className="sm:col-span-2" label="Nome do produto" value={form.name} onChange={set('name')} error={errors.name} />
              <Select label="Categoria" value={form.category} onChange={set('category')} error={errors.category}>
                <option value="">Selecione</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Input label="Marca" placeholder="Ex.: Serra Alta" value={form.brand} onChange={set('brand')} />
              <Textarea className="sm:col-span-2" label="Descrição" placeholder="Estado da embalagem, forma de armazenamento…" value={form.description} onChange={set('description')} />
            </div>
          </section>

          <Divider />

          <section>
            <SectionTitle title="Preço, estoque e validade" subtitle="Preencha o preço promocional ou o desconto." />
            <div className="mt-3.5 grid gap-3.5 sm:grid-cols-3">
              <Input label="Preço original (R$)" inputMode="decimal" placeholder="0,00" value={form.originalPrice} onChange={onOriginal} error={errors.originalPrice} />
              <Input label="Preço promocional (R$)" inputMode="decimal" placeholder="0,00" value={form.promoPrice} onChange={onPromo} error={errors.promoPrice} />
              <Input label="Desconto (%)" inputMode="numeric" placeholder="0" suffix="%" value={form.discount} onChange={onDiscount} error={errors.discount} />
              <Input label="Estoque (un.)" inputMode="numeric" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value.replace(/\D/g, '') }))} error={errors.stock} />
              <Input label="Data de vencimento" type="date" value={form.expiresAt} onChange={set('expiresAt')} error={errors.expiresAt} />
              <Input label="Lote" placeholder="Ex.: L2309" value={form.batch} onChange={set('batch')} />
            </div>
          </section>

          <Divider />

          <section>
            <SectionTitle title="Fotos" subtitle="Até 3 imagens. A primeira é a capa." />
            <div className="mt-3.5 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => {
                const src = form.images[i];
                if (src)
                  return (
                    <div key={i} className="relative h-[72px] overflow-hidden rounded border border-line">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="Remover foto"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-white/90 text-xs text-danger"
                      >
                        ×
                      </button>
                    </div>
                  );
                if (i === form.images.length)
                  return (
                    <label
                      key={i}
                      className="flex h-[72px] cursor-pointer items-center justify-center rounded border border-dashed border-[#9fb0a6] bg-white text-[11px] font-semibold text-soft-ink hover:border-brand"
                    >
                      + Enviar foto
                      <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
                    </label>
                  );
                return <div key={i} className="h-[72px] rounded border border-dashed border-field bg-[#fafbf8]" />;
              })}
            </div>
          </section>

          <div className="flex justify-end gap-2.5">
            <Button variant="outline" onClick={() => navigate('/admin/produtos')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Cadastrar produto'}
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-2.5 lg:sticky lg:top-6">
          <Label>Prévia no catálogo</Label>
          <ProductCard product={preview} preview />
        </aside>
      </form>
    </>
  );
}

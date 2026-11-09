import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { categoryService, productService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import SelectionPanel from '../../components/SelectionPanel.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/date';
import { money } from '../../utils/format';
import '../../../../src/pages/Home/styles.css';

export default function Catalog() {
  const [category, setCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState({});
  const { items, add } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const { data: products } = useAsync(
    () => productService.list({
      category: category === 'Todas' ? '' : category,
      search,
      onlyAvailable: true,
      sort: 'expiresAt',
    }),
    [category, search],
  );

  const selectedCount = items.reduce((total, item) => total + item.qty, 0);
  const quantityFor = (product) => Math.min(
    product.stock,
    Math.max(1, Number(quantities[product.id]) || 1),
  );

  const changeQuantity = (product, delta) => {
    setQuantities((current) => ({
      ...current,
      [product.id]: Math.min(
        product.stock,
        Math.max(1, (Number(current[product.id]) || 1) + delta),
      ),
    }));
  };

  const handleAdd = (product) => {
    add(product, quantityFor(product));
    toast(`${product.name} adicionado à seleção`);
  };

  return (
    <main className="produtos-page">
      <header className="produtos-header">
        <div className="brand">
          <h1>Food Promotion</h1>
        </div>
        <div className="home-account-actions">
          <Link className="selection-access" to="/carrinho">
            Carrinho <span>{selectedCount}</span>
          </Link>
          <Link to="/perfil" className="profile-access-button">Meu perfil</Link>
          <Link to="/login" className="logout" onClick={logout}>Sair</Link>
        </div>
      </header>

      <section className="produtos-container">
        <div className="produtos-title">
          <div>
            <h2>Produtos</h2>
            <p>Produtos disponíveis para sua próxima compra.</p>
          </div>
          <span className="total-produtos">{products?.length ?? 0} produtos</span>
        </div>

        <div className="loja-filtros">
          <label className="visually-hidden" htmlFor="buscar-produto">Buscar produtos</label>
          <input
            id="buscar-produto"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produto ou categoria"
          />
          <label className="visually-hidden" htmlFor="filtrar-categoria">Filtrar por categoria</label>
          <select
            id="filtrar-categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="Todas">Todas as categorias</option>
            {categories?.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="loja-conteudo">
          <div className="produtos-grid">
            {products?.map((product) => (
              <article className="produto-card" key={product.id}>
                <div className="produto-imagem">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <span className="produto-sem-imagem">{product.category || 'Produto'}</span>
                  )}
                </div>
                <div className="produto-conteudo">
                  <span className="produto-categoria">{product.category || 'Produto'}</span>
                  <h3>{product.name}</h3>
                  <div className="produto-preco-linha">
                    {product.discount > 0 && (
                      <span className="produto-desconto-badge">-{product.discount}%</span>
                    )}
                    {product.originalPrice > product.promoPrice && (
                      <del className="produto-preco-original">{money(product.originalPrice)}</del>
                    )}
                    <strong className="produto-preco">{money(product.promoPrice)}</strong>
                  </div>
                  <div className="produto-info">
                    <div><span>Em estoque</span><strong>{product.stock} un.</strong></div>
                    <div><span>Vencimento</span><strong>{formatDate(product.expiresAt)}</strong></div>
                  </div>
                  <div className="produto-compra">
                    <div className="produto-stepper" aria-label={`Quantidade de ${product.name}`}>
                      <button
                        type="button"
                        aria-label={`Diminuir quantidade de ${product.name}`}
                        onClick={() => changeQuantity(product, -1)}
                        disabled={quantityFor(product) <= 1}
                      >
                        -
                      </button>
                      <output>{quantityFor(product)}</output>
                      <button
                        type="button"
                        aria-label={`Aumentar quantidade de ${product.name}`}
                        onClick={() => changeQuantity(product, 1)}
                        disabled={quantityFor(product) >= product.stock}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="adicionar-selecao"
                      type="button"
                      onClick={() => handleAdd(product)}
                      disabled={product.stock === 0}
                    >
                      Adicionar à seleção
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {products?.length === 0 && <p className="loja-vazio">Nenhum produto encontrado.</p>}
          </div>
          <SelectionPanel />
        </div>
      </section>
    </main>
  );
}

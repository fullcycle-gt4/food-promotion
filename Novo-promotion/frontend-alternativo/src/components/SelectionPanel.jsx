import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/format';

export default function SelectionPanel() {
  const navigate = useNavigate();
  const { items, setQty, remove, clear, totals } = useCart();
  const selectedCount = items.reduce((total, item) => total + item.qty, 0);

  return (
    <aside className="selecao-panel" id="minha-selecao" aria-labelledby="selecao-titulo">
      <div className="selecao-heading">
        <h2 id="selecao-titulo">Minha seleção</h2>
        <span>
          {selectedCount} {selectedCount === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="selecao-vazia">Sua seleção está vazia.</p>
      ) : (
        <ul className="selecao-lista">
          {items.map(({ product, qty }) => (
            <li key={product.id} className="selecao-item">
              <div className="selecao-item-info">
                <Link
                  to={`/produtos/${product.id}`}
                  className="selecao-item-link"
                >
                  {product.name}
                </Link>
                <span>{qty} × {money(product.promoPrice)}</span>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="selecao-remover"
                  aria-label={`Remover ${product.name} da seleção`}
                >
                  Remover
                </button>
              </div>
              <div className="selecao-item-acoes">
                <button
                  type="button"
                  aria-label={`Diminuir ${product.name}`}
                  onClick={() => setQty(product.id, qty - 1)}
                  disabled={qty <= 1}
                >
                  -
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  aria-label={`Aumentar ${product.name}`}
                  onClick={() => setQty(product.id, qty + 1)}
                  disabled={qty >= product.stock}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="selecao-total">
        <span>Total estimado</span>
        <strong>{money(totals.total)}</strong>
      </div>
      <p className="selecao-nota">Valores sujeitos à confirmação na loja.</p>
      <div className="selecao-acoes">
        <button
          className="comprar-selecao"
          type="button"
          disabled={items.length === 0}
          onClick={() => navigate('/carrinho')}
        >
          Comprar
        </button>
        <button
          className="limpar-selecao"
          type="button"
          disabled={items.length === 0}
          onClick={clear}
        >
          Limpar seleção
        </button>
      </div>
    </aside>
  );
}

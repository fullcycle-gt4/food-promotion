// frontend/src/components/ListaProdutos.js
import { useEffect, useState } from 'react';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    // Consumindo a API do backend
    fetch('/api/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error("Erro ao carregar catálogo:", error));
  }, []);

  return (
    <div className="container">
      <h2>Ofertas Especiais por Vencimento</h2>
      <div className="grid-produtos">
        {produtos.map(produto => (
          <div key={produto.id} className="card-produto">
            <h3>{produto.nome}</h3>
            
            {/* Exibe tag de status se houver desconto */}
            {produto.percentualDesconto > 0 && (
              <span className="badge-desconto">
                -{produto.percentualDesconto}% ({produto.status})
              </span>
            )}

            <p>
              <span className="preco-antigo">R$ {produto.precoBase.toFixed(2)}</span>
              <span className="preco-novo">R$ {produto.precoFinal.toFixed(2)}</span>
            </p>
            
            <small>Vence em: {produto.diasRestantes} dia(s)</small>
          </div>
        ))}
      </div>
    </div>
  );
}
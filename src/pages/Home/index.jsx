import { useState } from "react";
import "./styles.css";
import { carregarProdutos } from "../../utils/produtos";
import { Link } from "react-router-dom";

export default function Home() {
  const [produtos] = useState(carregarProdutos);

  function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
  }

  return (
    <main className="produtos-page">
      <header className="produtos-header">
        <div className="brand">
          <h1>Food Promotion</h1>
        </div>

        <div className="home-account-actions">
          <Link to="/perfil" className="profile-access-button">Perfil do ADM</Link>
          <Link to="/" className="logout">Sair</Link>
        </div>
      </header>

      <section className="produtos-container">
        <div className="produtos-title">
          <div>
            <h2>Produtos</h2>
            <p>Confira a lista de produtos cadastrados.</p>
          </div>

          <span className="total-produtos">{produtos.length} produtos</span>
        </div>

        <div className="produtos-grid">
          {produtos.map((produto) => (
            <article className="produto-card" key={produto.id}>
              <div className="produto-imagem">
                {produto.imagem
                  ? <img src={produto.imagem} alt={produto.nome} />
                  : <span className="produto-sem-imagem">{produto.categoria || 'Produto'}</span>}
              </div>

              <div className="produto-conteudo">
                <h3>{produto.nome}</h3>

                <strong className="produto-preco">
                  {formatarPreco(produto.preco)}
                </strong>

                <div className="produto-info">
                  <div>
                    <span>📦 Quantidade</span>
                    <strong>{produto.quantidade} un.</strong>
                  </div>

                  <div>
                    <span>📅 Vencimento</span>
                    <strong>{formatarData(produto.dataVencimento)}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

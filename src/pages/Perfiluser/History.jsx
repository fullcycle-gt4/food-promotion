import { useState } from "react";
import { Link } from "react-router-dom";
import { mockProdutos } from "../../mocks/mockProdutos";
import "./History.css";

const historicoInicial = [mockProdutos[3].id, mockProdutos[1].id];
const carrinhoInicial = [mockProdutos[0], mockProdutos[5]].map((produto) => ({ ...produto, quantidadeCarrinho: 1 }));

function lerHistorico() {
  const salvo = localStorage.getItem("foodPromotionHistorico");
  if (salvo) {
    try {
      const ids = JSON.parse(salvo);
      if (Array.isArray(ids) && ids.length === 0 && !localStorage.getItem("foodPromotionHistoricoRestaurado")) {
        localStorage.setItem("foodPromotionHistorico", JSON.stringify(historicoInicial));
        localStorage.setItem("foodPromotionHistoricoRestaurado", "true");
        return historicoInicial.map((id) => mockProdutos.find((produto) => produto.id === id));
      }
      return ids.map((id) => mockProdutos.find((produto) => produto.id === id)).filter(Boolean);
    }
    catch { return historicoInicial.map((id) => mockProdutos.find((produto) => produto.id === id)); }
  }
  localStorage.setItem("foodPromotionHistorico", JSON.stringify(historicoInicial));
  localStorage.setItem("foodPromotionHistoricoRestaurado", "true");
  return historicoInicial.map((id) => mockProdutos.find((produto) => produto.id === id));
}

export default function History() {
  const [compras, setCompras] = useState(lerHistorico);
  const [mensagem, setMensagem] = useState("");

  function adicionarAoCarrinho(produto) {
    let carrinho;
    try {
      carrinho = JSON.parse(localStorage.getItem("foodPromotionCarrinho")) || carrinhoInicial;
      if (!Array.isArray(carrinho)) carrinho = carrinhoInicial;
    } catch { carrinho = carrinhoInicial; }

    const existente = carrinho.find((item) => item.id === produto.id);
    const atualizado = existente
      ? carrinho.map((item) => item.id === produto.id ? { ...item, quantidadeCarrinho: (item.quantidadeCarrinho || 1) + 1 } : item)
      : [...carrinho, { ...produto, quantidadeCarrinho: 1 }];
    localStorage.setItem("foodPromotionCarrinho", JSON.stringify(atualizado));
    setMensagem(`${produto.nome} foi adicionado ao carrinho.`);
  }

  function excluirDoHistorico(id) {
    const atualizadas = compras.filter((produto) => produto.id !== id);
    setCompras(atualizadas);
    localStorage.setItem("foodPromotionHistorico", JSON.stringify(atualizadas.map((produto) => produto.id)));
    setMensagem("Produto removido do histórico.");
  }

  function preco(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <main className="historico-page">
      <div className="historico-shell">
        <header className="historico-header">
          <Link to="/Home" className="historico-marca">Food Promotion</Link>
          <nav aria-label="Navegação da conta">
            <Link to="/Home" className="historico-nav">Home</Link>
            <Link to="/usuario" className="historico-nav">Meu perfil</Link>
            <Link to="/" className="historico-sair">Sair</Link>
          </nav>
        </header>

        <section className="historico-painel">
          <div className="historico-titulo"><div><p>SUA CONTA</p><h1>Histórico de compras</h1></div><span>{compras.length} produtos</span></div>
          {mensagem && <p className="historico-mensagem" role="status">{mensagem}</p>}
          {compras.length ? (
            <div className="historico-lista">
              {compras.map((produto) => (
                <article className="historico-item" key={produto.id}>
                  <img src={produto.imagem} alt={produto.nome} />
                  <div className="historico-info"><h2>{produto.nome}</h2><p>Compra realizada</p><strong>{preco(produto.preco)}</strong></div>
                  <div className="historico-acoes">
                    <button className="historico-adicionar" type="button" onClick={() => adicionarAoCarrinho(produto)}>＋ Adicionar ao carrinho</button>
                    <button className="historico-excluir" type="button" aria-label={`Excluir ${produto.nome} do histórico`} title="Excluir do histórico" onClick={() => excluirDoHistorico(produto.id)}>×</button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="historico-vazio">Seu histórico de compras está vazio.</p>}
          <footer className="historico-rodape"><Link to="/Home">Voltar aos produtos</Link></footer>
        </section>
      </div>
    </main>
  );
}

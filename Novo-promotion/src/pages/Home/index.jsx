import { useEffect, useState } from "react";
import "./styles.css";
import { carregarUsuarioLogado, encerrarSessao } from "../../mocks/mockAuth";
import { carregarProdutos } from "../../utils/produtos";
import { salvarCarrinho } from "../../utils/carrinho";
import { calcularPromocaoProduto } from "../../utils/promocoes";
import { Link, useNavigate } from "react-router-dom";

const CHAVE_SELECAO = "food-promotion-selecao";

function chaveSelecao() {
  return `${CHAVE_SELECAO}:${carregarUsuarioLogado().email.toLowerCase()}`;
}

function carregarSelecao() {
  try {
    const dadosSalvos = window.localStorage.getItem(chaveSelecao());
    if (!dadosSalvos) return {};

    const selecao = JSON.parse(dadosSalvos);
    return selecao && typeof selecao === "object" && !Array.isArray(selecao) ? selecao : {};
  } catch {
    return {};
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [produtos] = useState(carregarProdutos);
  const [selecao, setSelecao] = useState(carregarSelecao);
  const [quantidades, setQuantidades] = useState({});
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [mensagem, setMensagem] = useState("");

  function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    if (!data) return "-";
    return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
  }

  function estoqueDo(produto) {
    return Math.max(0, Number(produto.quantidade) || 0);
  }

  function quantidadeDesejada(produto) {
    const estoque = estoqueDo(produto);
    if (estoque === 0) return 0;
    return Math.min(estoque, Math.max(1, Number(quantidades[produto.id]) || 1));
  }

  function salvarSelecao(selecaoAtualizada, mensagemAtualizada) {
    if (!salvarCarrinho(selecaoAtualizada)) {
      setMensagem("Não foi possível salvar sua seleção neste navegador.");
      return;
    }

    setSelecao(selecaoAtualizada);
    setMensagem(mensagemAtualizada);
  }

  function ajustarQuantidadeDesejada(produto, variacao) {
    const estoque = estoqueDo(produto);
    setQuantidades((atuais) => ({
      ...atuais,
      [produto.id]: Math.min(estoque, Math.max(1, (Number(atuais[produto.id]) || 1) + variacao)),
    }));
  }

  function adicionarASelecao(produto) {
    const quantidadeAtual = Number(selecao[produto.id]) || 0;
    const quantidadeSolicitada = quantidadeDesejada(produto);
    const quantidadeNova = Math.min(estoqueDo(produto), quantidadeAtual + quantidadeSolicitada);

    if (quantidadeNova === quantidadeAtual) {
      setMensagem("A quantidade máxima disponível já está na sua seleção.");
      return;
    }

    const mensagemAtualizada = quantidadeNova < quantidadeAtual + quantidadeSolicitada
      ? "Adicionamos à seleção até o limite disponível em estoque."
      : `${produto.nome} adicionado à seleção.`;

    salvarSelecao({ ...selecao, [produto.id]: quantidadeNova }, mensagemAtualizada);
  }

  function alterarSelecao(produto, variacao) {
    const quantidadeAtual = Number(selecao[produto.id]) || 0;
    const quantidadeNova = Math.min(estoqueDo(produto), Math.max(0, quantidadeAtual + variacao));
    const selecaoAtualizada = { ...selecao };

    if (quantidadeNova === 0) {
      delete selecaoAtualizada[produto.id];
    } else {
      selecaoAtualizada[produto.id] = quantidadeNova;
    }

    salvarSelecao(selecaoAtualizada, quantidadeNova ? "Seleção atualizada." : `${produto.nome} removido da seleção.`);
  }

  function irParaCarrinho() {
    if (produtosSelecionados.length > 0) navigate("/carrinho");
  }

  const produtosDisponiveis = produtos
    .map((produto) => ({ produto, promocao: calcularPromocaoProduto(produto) }))
    .filter(({ promocao }) => !promocao.indisponivel);
  const categorias = [...new Set(produtosDisponiveis.map(({ produto }) => produto.categoria).filter(Boolean))];
  const termoBusca = busca.trim().toLocaleLowerCase("pt-BR");
  const produtosFiltrados = produtosDisponiveis.filter(({ produto }) => {
    const correspondeBusca = `${produto.nome} ${produto.categoria || ""}`.toLocaleLowerCase("pt-BR").includes(termoBusca);
    return correspondeBusca && (categoria === "Todas" || produto.categoria === categoria);
  });
  const produtosSelecionados = produtosDisponiveis.filter(({ produto }) => Number(selecao[produto.id]) > 0);
  const totalItens = produtosSelecionados.reduce((total, { produto }) => total + Number(selecao[produto.id]), 0);
  const totalSelecao = produtosSelecionados.reduce(
    (total, { produto, promocao }) => total + promocao.precoComDesconto * Number(selecao[produto.id]),
    0,
  );

  useEffect(() => {
    const idsDisponiveis = new Set(
      produtos
        .filter((produto) => !calcularPromocaoProduto(produto).indisponivel)
        .map((produto) => String(produto.id)),
    );
    const selecaoDisponivel = Object.fromEntries(
      Object.entries(selecao).filter(([id, quantidade]) => idsDisponiveis.has(id) && Number(quantidade) > 0),
    );

    if (JSON.stringify(selecaoDisponivel) !== JSON.stringify(selecao)) {
      salvarCarrinho(selecaoDisponivel);
    }
  }, [produtos, selecao]);

  return (
    <main className="produtos-page">
      <header className="produtos-header">
        <div className="brand">
          <h1>Food Promotion</h1>
        </div>

        <div className="home-account-actions">
          <Link className="selection-access" to="/carrinho">Carrinho <span>{totalItens}</span></Link>
          <Link to="/perfil" className="profile-access-button">Meu perfil</Link>
          <Link to="/" className="logout" onClick={encerrarSessao}>Sair</Link>
        </div>
      </header>

      <section className="produtos-container">
        <div className="produtos-title">
          <div>
            <h2>Produtos</h2>
            <p>Produtos disponíveis para sua próxima compra.</p>
          </div>

          <span className="total-produtos">{produtosDisponiveis.length} produtos</span>
        </div>

        <div className="loja-filtros">
          <label className="visually-hidden" htmlFor="buscar-produto">Buscar produtos</label>
          <input
            id="buscar-produto"
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar produto ou categoria"
          />
          <label className="visually-hidden" htmlFor="filtrar-categoria">Filtrar por categoria</label>
          <select id="filtrar-categoria" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
            <option value="Todas">Todas as categorias</option>
            {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="loja-conteudo">
          <div className="produtos-grid">
            {produtosFiltrados.map(({ produto, promocao }) => {
              const estoque = estoqueDo(produto);
              const quantidade = quantidadeDesejada(produto);

              return (
                <article className="produto-card" key={produto.id}>
                  <div className="produto-imagem">
                    {produto.imagem
                      ? <img src={produto.imagem} alt={produto.nome} />
                      : <span className="produto-sem-imagem">{produto.categoria || "Produto"}</span>}
                  </div>

                  <div className="produto-conteudo">
                    <span className="produto-categoria">{produto.categoria || "Produto"}</span>
                    <h3>{produto.nome}</h3>
                    <div className="produto-preco-linha">
                      {promocao.percentualDesconto > 0 && (
                        <span className="produto-desconto-badge">-{promocao.percentualDesconto}%</span>
                      )}
                      {promocao.percentualDesconto > 0 && (
                        <del className="produto-preco-original">{formatarPreco(promocao.precoBase)}</del>
                      )}
                      <strong className="produto-preco">{formatarPreco(promocao.precoComDesconto)}</strong>
                      {promocao.percentualDesconto >= 75 && (
                        <span className="produto-oferta-relampago">
                          {promocao.percentualDesconto === 80 ? "Liquidação de hoje" : "Oferta relâmpago"}
                        </span>
                      )}
                    </div>

                    <div className="produto-info">
                      <div><span>Em estoque</span><strong>{estoque} un.</strong></div>
                      <div><span>Vencimento</span><strong>{formatarData(produto.dataVencimento)}</strong></div>
                    </div>

                    <div className="produto-compra">
                      <div className="produto-stepper" aria-label={`Quantidade de ${produto.nome}`}>
                        <button type="button" aria-label={`Diminuir quantidade de ${produto.nome}`} onClick={() => ajustarQuantidadeDesejada(produto, -1)} disabled={quantidade <= 1}>-</button>
                        <output>{quantidade}</output>
                        <button type="button" aria-label={`Aumentar quantidade de ${produto.nome}`} onClick={() => ajustarQuantidadeDesejada(produto, 1)} disabled={quantidade >= estoque}>+</button>
                      </div>
                      <button className="adicionar-selecao" type="button" onClick={() => adicionarASelecao(produto)} disabled={estoque === 0}>
                        {estoque === 0 ? "Indisponível" : "Adicionar à seleção"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            {produtosFiltrados.length === 0 && <p className="loja-vazio">Nenhum produto encontrado.</p>}
          </div>

          <aside className="selecao-panel" id="minha-selecao" aria-labelledby="selecao-titulo">
            <div className="selecao-heading">
              <h2 id="selecao-titulo">Minha seleção</h2>
              <span>{totalItens} {totalItens === 1 ? "item" : "itens"}</span>
            </div>

            {produtosSelecionados.length === 0 ? (
              <p className="selecao-vazia">Sua seleção está vazia.</p>
            ) : (
              <ul className="selecao-lista">
                {produtosSelecionados.map(({ produto, promocao }) => (
                  <li className="selecao-item" key={produto.id}>
                    <div className="selecao-item-info">
                      <strong>{produto.nome}</strong>
                      <span>{selecao[produto.id]} x {formatarPreco(promocao.precoComDesconto)}</span>
                    </div>
                    <div className="selecao-item-acoes">
                      <button type="button" aria-label={`Diminuir ${produto.nome}`} onClick={() => alterarSelecao(produto, -1)}>-</button>
                      <span>{selecao[produto.id]}</span>
                      <button type="button" aria-label={`Aumentar ${produto.nome}`} onClick={() => alterarSelecao(produto, 1)} disabled={Number(selecao[produto.id]) >= estoqueDo(produto)}>+</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="selecao-total">
              <span>Total estimado</span>
              <strong>{formatarPreco(totalSelecao)}</strong>
            </div>
            <p className="selecao-nota">Valores sujeitos à confirmação na loja.</p>
            {mensagem && <p className="selecao-mensagem" role="status">{mensagem}</p>}
            <div className="selecao-acoes">
              <button
                className="comprar-selecao"
                type="button"
                onClick={irParaCarrinho}
                disabled={produtosSelecionados.length === 0}
              >
                Comprar
              </button>
              <button
                className="limpar-selecao"
                type="button"
                onClick={() => salvarSelecao({}, "Seleção limpa.")}
                disabled={produtosSelecionados.length === 0}
              >
                Limpar seleção
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

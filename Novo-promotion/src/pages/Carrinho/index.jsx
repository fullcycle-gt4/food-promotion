import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { encerrarSessao } from '../../mocks/mockAuth'
import { carregarCarrinho, salvarCarrinho } from '../../utils/carrinho'
import { carregarProdutos } from '../../utils/produtos'
import { calcularPromocaoProduto } from '../../utils/promocoes'
import './carrinho.css'

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Carrinho() {
  const navigate = useNavigate()
  const [produtos] = useState(carregarProdutos)
  const [carrinho, setCarrinho] = useState(carregarCarrinho)
  const [mensagem, setMensagem] = useState('')

  const produtosDisponiveis = produtos
    .map((produto) => ({ produto, promocao: calcularPromocaoProduto(produto) }))
    .filter(({ promocao }) => !promocao.indisponivel)
  const itens = produtosDisponiveis.filter(({ produto }) => Number(carrinho[produto.id]) > 0)
  const quantidadeTotal = itens.reduce((total, { produto }) => total + Number(carrinho[produto.id]), 0)
  const totalCompra = itens.reduce(
    (total, { produto, promocao }) => total + promocao.precoComDesconto * Number(carrinho[produto.id]),
    0,
  )

  useEffect(() => {
    const produtosDisponiveis = produtos
      .map((produto) => ({ produto, promocao: calcularPromocaoProduto(produto) }))
      .filter(({ promocao }) => !promocao.indisponivel);
    const estoqueDisponivel = new Map(
      produtosDisponiveis.map(({ produto }) => [String(produto.id), Math.max(0, Number(produto.quantidade) || 0)]),
    )
    const carrinhoDisponivel = Object.fromEntries(
      Object.entries(carrinho)
        .map(([id, quantidade]) => [id, Math.min(estoqueDisponivel.get(id) || 0, Number(quantidade))])
        .filter(([id, quantidade]) => estoqueDisponivel.has(id) && quantidade > 0),
    )

    if (JSON.stringify(carrinhoDisponivel) !== JSON.stringify(carrinho)) salvarCarrinho(carrinhoDisponivel)
  }, [produtos, carrinho])

  function atualizarCarrinho(carrinhoAtualizado, proximaMensagem) {
    if (!salvarCarrinho(carrinhoAtualizado)) {
      setMensagem('Não foi possível atualizar o carrinho neste navegador.')
      return false
    }

    setCarrinho(carrinhoAtualizado)
    setMensagem(proximaMensagem)
    return true
  }

  function alterarQuantidade(produto, variacao) {
    const quantidadeAtual = Number(carrinho[produto.id]) || 0
    const estoque = Math.max(0, Number(produto.quantidade) || 0)
    const novaQuantidade = Math.min(estoque, Math.max(0, quantidadeAtual + variacao))
    const carrinhoAtualizado = { ...carrinho }

    if (novaQuantidade === 0) {
      delete carrinhoAtualizado[produto.id]
    } else {
      carrinhoAtualizado[produto.id] = novaQuantidade
    }

    atualizarCarrinho(carrinhoAtualizado, novaQuantidade ? 'Quantidade atualizada.' : 'Produto removido do carrinho.')
  }

  function limparCarrinho() {
    atualizarCarrinho({}, 'Carrinho limpo.')
  }

  function aceitarItens() {
    if (itens.length === 0) return
    navigate('/finalizacao')
  }

  return (
    <div className="carrinho-page">
      <header className="carrinho-header">
        <Link className="carrinho-brand" to="/Home">
          <span aria-hidden="true">F</span>
          Food Promotion
        </Link>
        <nav aria-label="Navegação da conta">
          <Link to="/Home">Continuar comprando</Link>
          <Link to="/perfil">Meu perfil</Link>
          <Link to="/" onClick={encerrarSessao}>Sair</Link>
        </nav>
      </header>

      <main className="carrinho-main">
        <div className="carrinho-heading">
          <span>ÁREA DO CLIENTE</span>
          <h1>Meu carrinho</h1>
          <p>Confira os produtos selecionados e o valor da compra.</p>
        </div>

        {mensagem && <p className="carrinho-mensagem" role="status">{mensagem}</p>}

        <div className="carrinho-layout">
          <section className="carrinho-itens" aria-labelledby="carrinho-itens-titulo">
            <div className="carrinho-itens-heading">
              <h2 id="carrinho-itens-titulo">Produtos selecionados</h2>
              <span>{quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}</span>
            </div>

            {itens.length === 0 ? (
              <div className="carrinho-vazio">
                <p>Seu carrinho está vazio.</p>
                <Link to="/Home">Ver produtos</Link>
              </div>
            ) : (
              <ul className="carrinho-lista">
                {itens.map(({ produto, promocao }) => {
                  const quantidade = Number(carrinho[produto.id])
                  const estoque = Math.max(0, Number(produto.quantidade) || 0)

                  return (
                    <li className="carrinho-item" key={produto.id}>
                      <div className="carrinho-produto-imagem">
                        {produto.imagem
                          ? <img src={produto.imagem} alt="" />
                          : <span aria-hidden="true">{produto.categoria || 'Produto'}</span>}
                      </div>
                      <div className="carrinho-produto-detalhes">
                        <span>{produto.categoria || 'Produto'}</span>
                        <h3>{produto.nome}</h3>
                        <p>
                          {promocao.percentualDesconto > 0 && <del>{formatarPreco(promocao.precoBase)} </del>}
                          <strong>{formatarPreco(promocao.precoComDesconto)} por unidade</strong>
                          {promocao.percentualDesconto > 0 && <span> (-{promocao.percentualDesconto}%)</span>}
                        </p>
                      </div>
                      <div className="carrinho-quantidade" aria-label={`Quantidade de ${produto.nome}`}>
                        <button type="button" aria-label={`Diminuir ${produto.nome}`} onClick={() => alterarQuantidade(produto, -1)}>−</button>
                        <output>{quantidade}</output>
                        <button type="button" aria-label={`Aumentar ${produto.nome}`} onClick={() => alterarQuantidade(produto, 1)} disabled={quantidade >= estoque}>+</button>
                      </div>
                      <strong className="carrinho-subtotal-item">{formatarPreco(promocao.precoComDesconto * quantidade)}</strong>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <aside className="carrinho-resumo" aria-labelledby="carrinho-resumo-titulo">
            <h2 id="carrinho-resumo-titulo">Resumo da compra</h2>
            <div className="carrinho-resumo-linha">
              <span>Produtos ({quantidadeTotal})</span>
              <strong>{formatarPreco(totalCompra)}</strong>
            </div>
            <div className="carrinho-resumo-total">
              <span>Total da compra</span>
              <strong>{formatarPreco(totalCompra)}</strong>
            </div>
            <p>O valor é uma estimativa e será confirmado na loja.</p>
            <button className="carrinho-finalizar" type="button" onClick={aceitarItens} disabled={itens.length === 0}>
              Aceitar itens e continuar
            </button>
            <button className="carrinho-limpar" type="button" onClick={limparCarrinho} disabled={itens.length === 0}>
              Limpar carrinho
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}
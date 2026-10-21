import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { encerrarSessao } from '../../mocks/mockAuth'
import { carregarCarrinho, salvarCarrinho } from '../../utils/carrinho'
import { carregarProdutos } from '../../utils/produtos'
import { calcularPromocaoProduto } from '../../utils/promocoes'
import '../Carrinho/carrinho.css'
import './finalizacao.css'

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function carregarResumo() {
  const carrinho = carregarCarrinho()
  const produtos = carregarProdutos()

  return produtos
    .map((produto) => ({
      produto,
      promocao: calcularPromocaoProduto(produto),
      quantidade: Number(carrinho[produto.id]) || 0,
    }))
    .filter(({ promocao, quantidade }) => !promocao.indisponivel && quantidade > 0)
    .map(({ produto, promocao, quantidade }) => ({
      produto,
      promocao,
      quantidade: Math.min(quantidade, Math.max(0, Number(produto.quantidade) || 0)),
    }))
    .filter(({ quantidade }) => quantidade > 0)
}

export default function Finalizacao() {
  const [itens] = useState(carregarResumo)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0)
  const totalCompra = itens.reduce(
    (total, { promocao, quantidade }) => total + promocao.precoComDesconto * quantidade,
    0,
  )

  function confirmarPedido() {
    if (itens.length === 0 || pedidoConfirmado) return

    if (!salvarCarrinho({})) {
      setMensagem('Não foi possível confirmar o pedido neste navegador. Tente novamente.')
      return
    }

    setPedidoConfirmado(true)
    setMensagem('')
  }

  if (itens.length === 0 && !pedidoConfirmado) {
    return <Navigate to="/carrinho" replace />
  }

  return (
    <div className="carrinho-page">
      <header className="carrinho-header">
        <Link className="carrinho-brand" to="/Home">
          <span aria-hidden="true">F</span>
          Food Promotion
        </Link>
        <nav aria-label="Navegação da conta">
          {!pedidoConfirmado && <Link to="/carrinho">Voltar ao carrinho</Link>}
          <Link to="/perfil">Meu perfil</Link>
          <Link to="/" onClick={encerrarSessao}>Sair</Link>
        </nav>
      </header>

      <main className="carrinho-main">
        <div className="carrinho-heading">
          <span>ÁREA DO CLIENTE</span>
          <h1>{pedidoConfirmado ? 'Pedido confirmado' : 'Finalização da compra'}</h1>
          <p>
            {pedidoConfirmado
              ? 'Sua seleção foi confirmada no modo demonstrativo.'
              : 'Revise os itens e confirme seu pedido.'}
          </p>
        </div>

        {pedidoConfirmado ? (
          <section className="finalizacao-confirmacao" role="status">
            <span className="finalizacao-icone" aria-hidden="true">✓</span>
            <div>
              <h2>Obrigado pela sua compra!</h2>
              <p>
                {quantidadeTotal} {quantidadeTotal === 1 ? 'item confirmado' : 'itens confirmados'}.
                {' '}Total: <strong>{formatarPreco(totalCompra)}</strong>.
              </p>
              <p>Nenhum pagamento foi processado. Esta é uma confirmação demonstrativa.</p>
              <Link className="carrinho-finalizar finalizacao-continuar" to="/Home">
                Voltar às ofertas
              </Link>
            </div>
          </section>
        ) : (
          <>
            {mensagem && <p className="finalizacao-erro" role="alert">{mensagem}</p>}

            <div className="carrinho-layout">
              <section className="carrinho-itens" aria-labelledby="finalizacao-itens-titulo">
                <div className="carrinho-itens-heading">
                  <h2 id="finalizacao-itens-titulo">Itens do pedido</h2>
                  <span>{quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}</span>
                </div>

                <ul className="finalizacao-lista">
                  {itens.map(({ produto, promocao, quantidade }) => (
                    <li className="finalizacao-item" key={produto.id}>
                      <div className="carrinho-produto-imagem">
                        {produto.imagem
                          ? <img src={produto.imagem} alt="" />
                          : <span aria-hidden="true">{produto.categoria || 'Produto'}</span>}
                      </div>
                      <div className="carrinho-produto-detalhes">
                        <span>{produto.categoria || 'Produto'}</span>
                        <h3>{produto.nome}</h3>
                        <p>{quantidade} × {formatarPreco(promocao.precoComDesconto)}</p>
                      </div>
                      <strong className="carrinho-subtotal-item">
                        {formatarPreco(promocao.precoComDesconto * quantidade)}
                      </strong>
                    </li>
                  ))}
                </ul>
              </section>

              <aside className="carrinho-resumo" aria-labelledby="finalizacao-resumo-titulo">
                <h2 id="finalizacao-resumo-titulo">Resumo do pedido</h2>
                <div className="carrinho-resumo-linha">
                  <span>Produtos ({quantidadeTotal})</span>
                  <strong>{formatarPreco(totalCompra)}</strong>
                </div>
                <div className="carrinho-resumo-total">
                  <span>Total do pedido</span>
                  <strong>{formatarPreco(totalCompra)}</strong>
                </div>
                <p>Esta confirmação é demonstrativa. Nenhum pagamento será processado.</p>
                <button
                  className="carrinho-finalizar"
                  type="button"
                  onClick={confirmarPedido}
                  disabled={itens.length === 0}
                >
                  Confirmar pedido
                </button>
                <Link className="carrinho-limpar finalizacao-voltar" to="/carrinho">
                  Voltar ao carrinho
                </Link>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

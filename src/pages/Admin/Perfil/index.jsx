import { useState } from 'react'
import { Link } from 'react-router-dom'
import { carregarProdutos, salvarProdutos } from '../../../utils/produtos'
import './perfil.css'

const CHAVE_PERFIL = 'food-promotion-perfil-admin'
const PERFIL_PADRAO = {
  nome: 'Admin Manager',
  email: 'admin@foodpromotion.com',
  telefone: '',
}

function carregarPerfil() {
  try {
    const perfilSalvo = window.localStorage.getItem(CHAVE_PERFIL)
    return perfilSalvo ? { ...PERFIL_PADRAO, ...JSON.parse(perfilSalvo) } : PERFIL_PADRAO
  } catch {
    return PERFIL_PADRAO
  }
}

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(data) {
  if (!data) return '-'
  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

export default function PerfilAdmin() {
  const [perfil, setPerfil] = useState(carregarPerfil)
  const [mensagemPerfil, setMensagemPerfil] = useState('')
  const [produtos, setProdutos] = useState(carregarProdutos)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [erroProduto, setErroProduto] = useState('')

  function salvarPerfil(event) {
    event.preventDefault()
    try {
      window.localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil))
      setMensagemPerfil('Dados atualizados.')
    } catch {
      setMensagemPerfil('Não foi possível salvar os dados neste navegador.')
    }
  }

  function abrirEdicao(produto) {
    setProdutoEditando({ ...produto })
    setErroProduto('')
  }

  function salvarProduto(event) {
    event.preventDefault()
    const produtosAtualizados = produtos.map((produto) =>
      produto.id === produtoEditando.id ? produtoEditando : produto,
    )

    if (!salvarProdutos(produtosAtualizados)) {
      setErroProduto('Não foi possível salvar as alterações.')
      return
    }

    setProdutos(produtosAtualizados)
    setProdutoEditando(null)
  }

  return (
    <div className="perfil-shell">
      <aside className="perfil-sidebar">
        <Link className="perfil-brand" to="/produtos">
          <span className="perfil-brand-mark" aria-hidden="true">F</span>
          <span>Food <span>Promotion</span></span>
        </Link>

        <nav aria-label="Navegação administrativa">
          <Link to="/produtos"><span aria-hidden="true">⌂</span>Produtos</Link>
          <Link to="/produtos/novo"><span aria-hidden="true">＋</span>Cadastrar produto</Link>
          <Link to="/relatorios"><span aria-hidden="true">▤</span>Relatórios</Link>
          <Link to="/perfil" className="active" aria-current="page"><span aria-hidden="true">●</span>Perfil</Link>
        </nav>

        <div className="perfil-sidebar-user">
          <div className="perfil-avatar-small" aria-hidden="true">AM</div>
          <div><strong>{perfil.nome}</strong><span>Administrador</span></div>
        </div>
      </aside>

      <main className="perfil-main">
        <header className="perfil-page-header">
          <div>
            <span className="perfil-eyebrow">CONTA ADMINISTRATIVA</span>
            <h1>Perfil do administrador</h1>
            <p>Gerencie seus dados e os produtos cadastrados.</p>
          </div>
          <Link className="perfil-view-store" to="/produtos">Voltar aos produtos <span aria-hidden="true">→</span></Link>
        </header>

        <section className="perfil-section" aria-labelledby="dados-perfil-titulo">
          <div className="perfil-section-heading">
            <div>
              <h2 id="dados-perfil-titulo">Dados do administrador</h2>
              <p>Informações de acesso à conta.</p>
            </div>
            <span className="perfil-role">Administrador</span>
          </div>

          <form className="perfil-form" onSubmit={salvarPerfil}>
            <label>Nome
              <input value={perfil.nome} onChange={(event) => setPerfil({ ...perfil, nome: event.target.value })} required />
            </label>
            <label>E-mail
              <input type="email" value={perfil.email} onChange={(event) => setPerfil({ ...perfil, email: event.target.value })} required />
            </label>
            <label>Telefone
              <input type="tel" value={perfil.telefone} onChange={(event) => setPerfil({ ...perfil, telefone: event.target.value })} />
            </label>
            <div className="perfil-form-actions">
              {mensagemPerfil && <span role="status">{mensagemPerfil}</span>}
              <button className="perfil-primary-button" type="submit">Salvar alterações</button>
            </div>
          </form>
        </section>

        <section className="perfil-section produtos-admin-section" aria-labelledby="produtos-perfil-titulo">
          <div className="perfil-section-heading">
            <div>
              <h2 id="produtos-perfil-titulo">Produtos cadastrados</h2>
              <p>{produtos.length} itens no catálogo.</p>
            </div>
            <Link className="perfil-primary-button" to="/produtos/novo">Cadastrar produto</Link>
          </div>

          <div className="perfil-products-table-wrap">
            <table className="perfil-products-table">
              <thead>
                <tr><th scope="col">Produto</th><th scope="col">Categoria</th><th scope="col">Preço</th><th scope="col">Estoque</th><th scope="col">Vencimento</th><th scope="col"><span className="visually-hidden">Ações</span></th></tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <th scope="row">{produto.nome}</th>
                    <td>{produto.categoria || '-'}</td>
                    <td>{formatarPreco(produto.preco)}</td>
                    <td>{produto.quantidade} un.</td>
                    <td>{formatarData(produto.dataVencimento)}</td>
                    <td><button className="perfil-edit-button" type="button" onClick={() => abrirEdicao(produto)}>Editar</button></td>
                  </tr>
                ))}
                {produtos.length === 0 && <tr><td colSpan="6">Nenhum produto cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {produtoEditando && (
        <div className="perfil-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setProdutoEditando(null)
        }}>
          <section className="perfil-modal" role="dialog" aria-modal="true" aria-labelledby="editar-produto-titulo">
            <div className="perfil-modal-heading">
              <div><span className="perfil-eyebrow">CATÁLOGO</span><h2 id="editar-produto-titulo">Editar produto</h2></div>
              <button className="perfil-close-button" type="button" aria-label="Fechar" onClick={() => setProdutoEditando(null)}>×</button>
            </div>
            <form className="perfil-form" onSubmit={salvarProduto}>
              <label>Nome do produto
                <input value={produtoEditando.nome} onChange={(event) => setProdutoEditando({ ...produtoEditando, nome: event.target.value })} required />
              </label>
              <div className="perfil-form-grid">
                <label>Preço (R$)
                  <input type="number" min="0" step="0.01" value={produtoEditando.preco} onChange={(event) => setProdutoEditando({ ...produtoEditando, preco: event.target.value })} required />
                </label>
                <label>Quantidade
                  <input type="number" min="0" step="1" value={produtoEditando.quantidade} onChange={(event) => setProdutoEditando({ ...produtoEditando, quantidade: event.target.value })} required />
                </label>
              </div>
              <label>Data de validade
                <input type="date" value={produtoEditando.dataVencimento || ''} onChange={(event) => setProdutoEditando({ ...produtoEditando, dataVencimento: event.target.value })} required />
              </label>
              {erroProduto && <p className="perfil-form-error" role="alert">{erroProduto}</p>}
              <div className="perfil-modal-actions">
                <button className="perfil-secondary-button" type="button" onClick={() => setProdutoEditando(null)}>Cancelar</button>
                <button className="perfil-primary-button" type="submit">Salvar produto</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
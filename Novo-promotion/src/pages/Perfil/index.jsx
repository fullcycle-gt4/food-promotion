import { useState } from 'react'
import { Link } from 'react-router-dom'
import { carregarUsuarioLogado, encerrarSessao, salvarUsuarioLogado } from '../../mocks/mockAuth'
import { carregarCarrinho } from '../../utils/carrinho'
import './perfil.css'

const CHAVE_PERFIL_CLIENTE = 'food-promotion-perfil-cliente'

function carregarPerfil() {
  const usuario = carregarUsuarioLogado()
  const perfilPadrao = { ...usuario, telefone: '', endereco: '' }
  const chavePerfil = `${CHAVE_PERFIL_CLIENTE}:${usuario.email.toLowerCase()}`

  try {
    const perfilSalvo = window.localStorage.getItem(chavePerfil)
    return perfilSalvo ? { ...perfilPadrao, ...JSON.parse(perfilSalvo) } : perfilPadrao
  } catch {
    return perfilPadrao
  }
}

function iniciais(nome) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toLocaleUpperCase('pt-BR') || 'C'
}

export default function PerfilCliente() {
  const [perfil, setPerfil] = useState(carregarPerfil)
  const [mensagem, setMensagem] = useState('')
  const [quantidadeCarrinho] = useState(() =>
    Object.values(carregarCarrinho()).reduce((total, quantidade) => total + quantidade, 0),
  )

  function salvarPerfil(event) {
    event.preventDefault()
    const perfilAtualizado = {
      ...perfil,
      nome: perfil.nome.trim(),
      email: perfil.email.trim().toLowerCase(),
    }
    const chavePerfil = `${CHAVE_PERFIL_CLIENTE}:${perfilAtualizado.email}`

    try {
      window.localStorage.setItem(chavePerfil, JSON.stringify(perfilAtualizado))
      salvarUsuarioLogado({ nome: perfilAtualizado.nome, email: perfilAtualizado.email })
      setPerfil(perfilAtualizado)
      setMensagem('Dados atualizados.')
    } catch {
      setMensagem('Não foi possível salvar os dados neste navegador.')
    }
  }

  return (
    <div className="cliente-perfil-page">
      <header className="cliente-perfil-header">
        <Link className="cliente-perfil-brand" to="/Home">
          <span aria-hidden="true">F</span>
          Food Promotion
        </Link>
        <nav aria-label="Navegação da conta">
          <Link to="/Home">Produtos</Link>
          <Link
            className="cliente-perfil-cart-link"
            to="/carrinho"
            aria-label={`Carrinho, ${quantidadeCarrinho} ${quantidadeCarrinho === 1 ? 'item' : 'itens'}`}
            title="Carrinho"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="cliente-perfil-cart-count" aria-hidden="true">{quantidadeCarrinho}</span>
          </Link>
          <Link to="/" onClick={encerrarSessao}>Sair</Link>
        </nav>
      </header>

      <main className="cliente-perfil-main">
        <div className="cliente-perfil-heading">
          <span className="cliente-perfil-eyebrow">MINHA CONTA</span>
          <h1>Meu perfil</h1>
        </div>

        <section className="cliente-perfil-panel" aria-labelledby="cliente-perfil-titulo">
          <div className="cliente-perfil-summary">
            <div className="cliente-perfil-avatar" aria-hidden="true">{iniciais(perfil.nome)}</div>
            <div>
              <h2 id="cliente-perfil-titulo">{perfil.nome}</h2>
              <p>{perfil.email}</p>
            </div>
            <span className="cliente-perfil-role">Cliente</span>
          </div>

          <form className="cliente-perfil-form" onSubmit={salvarPerfil}>
            <label>
              Nome completo
              <input value={perfil.nome} onChange={(event) => setPerfil({ ...perfil, nome: event.target.value })} autoComplete="name" required />
            </label>
            <label>
              E-mail
              <input type="email" value={perfil.email} onChange={(event) => setPerfil({ ...perfil, email: event.target.value })} autoComplete="email" required />
            </label>
            <label>
              Telefone
              <input type="tel" value={perfil.telefone} onChange={(event) => setPerfil({ ...perfil, telefone: event.target.value })} autoComplete="tel" />
            </label>
            <label>
              Endereço
              <input value={perfil.endereco} onChange={(event) => setPerfil({ ...perfil, endereco: event.target.value })} autoComplete="street-address" />
            </label>
            <div className="cliente-perfil-actions">
              {mensagem && <span role="status">{mensagem}</span>}
              <button type="submit">Salvar alterações</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
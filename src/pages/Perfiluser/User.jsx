import { Link } from "react-router-dom";
import { useState } from "react";
import { mockProdutos } from "../../mocks/mockProdutos";
import "./User.css";

const ultimosComprados = [mockProdutos[3], mockProdutos[1]];
const itensCarrinho = [mockProdutos[0], mockProdutos[5]];

function User() {
  const [editando, setEditando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [foto, setFoto] = useState(() => localStorage.getItem("foodPromotionFoto") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("foodPromotionEmail") || "teste@gmail.com");
  const [dados, setDados] = useState(() => ({
    nomePerfil: localStorage.getItem("foodPromotionNomePerfil") || "sergio.silva",
    telefone: localStorage.getItem("foodPromotionTelefone") || "(11) 98765-4321",
    endereco: localStorage.getItem("foodPromotionEndereco") || "Rua das Flores, 123 · Apto 4, São Paulo/SP",
  }));

  function atualizarCampo(event) {
    const valor = event.target.name === "telefone" ? formatarTelefone(event.target.value) : event.target.value;
    setDados({ ...dados, [event.target.name]: valor });
    setSalvo(false);
  }

  function formatarTelefone(valor) {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);
    if (!digitos) return "";
    if (digitos.length <= 2) return `(${digitos}`;
    if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  function atualizarEmail(event) {
    setEmail(event.target.value);
    setSalvo(false);
  }

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      const imagem = String(leitor.result);
      setFoto(imagem);
      localStorage.setItem("foodPromotionFoto", imagem);
    };
    leitor.readAsDataURL(arquivo);
  }

  function salvarDados(event) {
    event.preventDefault();
    localStorage.setItem("foodPromotionNomePerfil", dados.nomePerfil);
    localStorage.setItem("foodPromotionEmail", email);
    localStorage.setItem("foodPromotionTelefone", dados.telefone);
    localStorage.setItem("foodPromotionEndereco", dados.endereco);
    setEditando(false);
    setSalvo(true);
  }

  function preco(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const totalCarrinho = itensCarrinho.reduce((total, produto) => total + Number(produto.preco), 0);

  return (
    <main className="usuario-page">
      <div className="usuario-shell">
        <header className="usuario-header">
          <Link to="/Home" className="usuario-marca">Food Promotion</Link>
          <nav aria-label="Navegação principal">
            <Link to="/Home" className="usuario-home">⌂ <span>Home</span></Link>
            <Link to="/" className="usuario-sair">Sair</Link>
          </nav>
        </header>

        <section className="usuario-painel">
          <div className="usuario-titulo">
            <div>
              <p className="usuario-eyebrow">SUA CONTA</p>
              <h1>Perfil do Usuário</h1>
              <p>Visualize suas informações, compras recentes e seu carrinho.</p>
            </div>
            <span className="usuario-verificado" aria-label="Conta verificada">✓</span>
          </div>

          <section className="usuario-dados" aria-labelledby="dados-titulo">
            <div className="usuario-avatar" aria-hidden="true">{foto ? <img src={foto} alt="" /> : "👤"}</div>
            {editando && (
              <label className="usuario-foto-botao">Colocar imagem
                <input type="file" accept="image/*" onChange={selecionarFoto} />
              </label>
            )}
            <h2 id="dados-titulo">Sérgio Silva</h2>
            <p className="usuario-nome-perfil">@{dados.nomePerfil}</p>
            {editando ? (
              <form className="usuario-edicao" onSubmit={salvarDados}>
                <label className="usuario-campo"><span>Nome completo (não editável)</span><input value="Sérgio Silva" disabled /></label>
                <label className="usuario-campo"><span>Nome de perfil</span><input name="nomePerfil" value={dados.nomePerfil} onChange={atualizarCampo} required /></label>
                <label className="usuario-campo"><span>✉ E-mail</span><input type="email" value={email} onChange={atualizarEmail} required /></label>
                <label className="usuario-campo"><span>☎ Telefone celular</span><input name="telefone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="(11) 98765-4321" maxLength={15} pattern={`\\(\\d{2}\\) \\d{5}-\\d{4}`} title="Digite um celular completo no formato (DD) 99999-9999" value={dados.telefone} onChange={atualizarCampo} required /></label>
                <label className="usuario-campo"><span>⌖ Endereço</span><input name="endereco" value={dados.endereco} onChange={atualizarCampo} required /></label>
                <div className="usuario-edicao-acoes"><button className="usuario-botao" type="submit">Salvar alterações</button><button className="usuario-cancelar" type="button" onClick={() => setEditando(false)}>Cancelar</button></div>
              </form>
            ) : (
              <>
                <div className="usuario-campos">
                  <div className="usuario-campo"><span>✉ E-mail</span><strong>{email}</strong></div>
                  <div className="usuario-campo"><span>☎ Telefone</span><strong>{dados.telefone}</strong></div>
                  <div className="usuario-campo"><span>⌖ Endereço</span><strong>{dados.endereco}</strong></div>
                </div>
                <button className="usuario-botao usuario-editar" type="button" onClick={() => { setEditando(true); setSalvo(false); }}>Editar dados</button>
                {salvo && <p className="usuario-salvo" role="status">Dados atualizados com sucesso.</p>}
              </>
            )}
          </section>

          <section className="usuario-lista" aria-labelledby="compras-titulo">
            <div className="usuario-secao-titulo"><h2 id="compras-titulo">Últimos produtos comprados</h2><span>2 compras</span></div>
            <div className="usuario-produtos">
              {ultimosComprados.map((produto) => (
                <article className="usuario-produto" key={produto.id}>
                  <img src={produto.imagem} alt={produto.nome} />
                  <div><h3>{produto.nome}</h3><p>Compra concluída</p><strong>{preco(produto.preco)}</strong></div>
                </article>
              ))}
            </div>
          </section>

          <section className="usuario-lista usuario-carrinho" aria-labelledby="carrinho-titulo">
            <div className="usuario-secao-titulo"><h2 id="carrinho-titulo">Meu carrinho</h2><span>{itensCarrinho.length} itens</span></div>
            <div className="usuario-carrinho-itens">
              {itensCarrinho.map((produto) => (
                <div className="usuario-carrinho-item" key={produto.id}>
                  <span>{produto.nome}</span><strong>{preco(produto.preco)}</strong>
                </div>
              ))}
            </div>
            <div className="usuario-total"><span>Total</span><strong>{preco(totalCarrinho)}</strong></div>
          </section>

          <footer className="usuario-rodape"><Link to="/Home" className="usuario-botao">Voltar aos produtos</Link></footer>
        </section>
      </div>
    </main>
  );
}

export default User;

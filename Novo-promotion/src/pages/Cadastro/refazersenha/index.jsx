import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./refazersenha.css";

function Refazersenha() {
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem("emailRecuperacao")) {
            navigate("/esqueceu-senha", { replace: true });
        }
    }, [navigate]);

    function redefinirSenha(event) {
        event.preventDefault();
        setErro("");
        setSucesso(false);

        if (senha.length < 8) {
            setErro("A senha deve ter pelo menos 8 caracteres.");
            return;
        }
        if (senha !== confirmacao) {
            setErro("As senhas não conferem.");
            return;
        }

        setSucesso(true);
        sessionStorage.removeItem("emailRecuperacao");
    }

    function voltarAoLogin() {
        navigate("/");
    }

    return (
        <main className="container">
            <form onSubmit={redefinirSenha}>
                <h1>Refazer senha</h1>
                <p className="reset-instructions">
                    Crie uma nova senha com pelo menos 8 caracteres.
                </p>

                <div className="input-box">
                    <input
                        type="password"
                        name="senha"
                        placeholder="Nova senha"
                        autoComplete="new-password"
                        minLength={8}
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        required
                    />
                    <i className="bx bxs-lock-alt" aria-hidden="true"></i>
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        name="confirmacao"
                        placeholder="Confirme a nova senha"
                        autoComplete="new-password"
                        value={confirmacao}
                        onChange={(event) => setConfirmacao(event.target.value)}
                        required
                    />
                    <i className="bx bxs-lock-alt" aria-hidden="true"></i>
                </div>

                {erro && <p className="reset-message reset-error" role="alert">{erro}</p>}
                {sucesso && (
                    <p className="reset-message" role="status">
                        Senha validada. Sem backend, ela não será salva na conta.
                    </p>
                )}

                {!sucesso ? (
                    <button type="submit" className="login">Salvar nova senha</button>
                ) : (
                    <button type="button" className="login" onClick={voltarAoLogin}>
                        Voltar ao login
                    </button>
                )}

                <div className="register-link">
                    <p><Link to="/">Cancelar e voltar ao login</Link></p>
                </div>
            </form>
        </main>
    );
}

export default Refazersenha;



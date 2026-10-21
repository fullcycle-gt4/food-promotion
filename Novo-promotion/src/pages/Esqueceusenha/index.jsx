import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Esqueusenha.css";

const CODIGO_DEMO = "123456";

function Esqueusenha() {
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [segundosRestantes, setSegundosRestantes] = useState(0);
    const [erro, setErro] = useState("");
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (segundosRestantes === 0) return undefined;

        const timer = window.setTimeout(() => {
            setSegundosRestantes((segundos) => segundos - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [segundosRestantes]);

    function enviarCodigo() {
        setErro("");
        setCodigoEnviado(true);
        setSegundosRestantes(60);
    }

    function confirmarCodigo(event) {
        event.preventDefault();
        if (!codigoEnviado || codigo !== CODIGO_DEMO) {
            setErro("Código inválido. Para testar, use 123456.");
            return;
        }

        sessionStorage.setItem("emailRecuperacao", email);
        navigate("/refazer-senha");
    }

    return (
        <main className="container">
            <form onSubmit={confirmarCodigo}>
                <h1>Esqueceu a senha?</h1>
                <p className="recovery-instructions">
                    Informe seu e-mail e confirme o código para redefinir sua senha.
                </p>

                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        autoComplete="email"
                        aria-label="E-mail"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <i className="bx bxs-envelope" aria-hidden="true"></i>
                </div>

                <button
                    type="button"
                    className="login send-code"
                    onClick={enviarCodigo}
                    disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || segundosRestantes > 0}
                >
                    {segundosRestantes > 0
                        ? `Enviar novamente em ${segundosRestantes}s`
                        : "Enviar código para o e-mail"}
                </button>

                {segundosRestantes > 0 && (
                    <p className="demo-code">Código de demonstração: {CODIGO_DEMO}</p>
                )}

                <div className="input-box">
                    <input
                        type="text"
                        name="codigo"
                        placeholder="Código de acesso"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        aria-label="Código de acesso"
                        value={codigo}
                        onChange={(event) => setCodigo(event.target.value)}
                        required
                    />
                    <i className="bx bx-key" aria-hidden="true"></i>
                </div>

                {erro && <p className="recovery-error" role="alert">{erro}</p>}

                <button type="submit" className="login">
                    Confirmar código
                </button>

                <div className="register-link">
                    <p>Lembrou sua senha? <Link to="/">Voltar ao login</Link></p>
                </div>
            </form>
        </main>
    );
}

export default Esqueusenha;





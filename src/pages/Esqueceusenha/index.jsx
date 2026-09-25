import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Esqueusenha.css";

function Esqueusenha() {
    const [email, setEmail] = useState("");
    const [segundosRestantes, setSegundosRestantes] = useState(0);

    useEffect(() => {
        if (segundosRestantes === 0) return undefined;

        const timer = window.setTimeout(() => {
            setSegundosRestantes((segundos) => segundos - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [segundosRestantes]);

    function enviarCodigo(event) {
        event.preventDefault();
        setSegundosRestantes(60);
    }

    return (
        <main className="container">
            <form onSubmit={(event) => event.preventDefault()}>
                <h1>
                    Esqueceu a senha?
                    <br />
                    Food Promotion
                </h1>

                <p className="recovery-instructions">
                    Informe seu e-mail e o código de acesso enviado para ele
                    para confirmar a redefinição da senha.
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

                <div className="input-box">
                    <input
                        type="text"
                        name="codigo"
                        placeholder="Código de acesso"
                        autoComplete="one-time-code"
                        aria-label="Código de acesso enviado por e-mail"
                        required
                    />
                    <i className="bx bx-key" aria-hidden="true"></i>
                </div>

                <button type="submit" className="login">
                    Confirmar código
                </button>

                <div className="register-link">
                    <p>
                        Lembrou sua senha? <Link to="/">Voltar ao login</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}

export default Esqueusenha;


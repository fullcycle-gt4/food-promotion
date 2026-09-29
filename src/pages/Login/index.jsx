import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PasswordField from "../../components/PasswordField";


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        if (email.trim().toLowerCase() === "teste@gmail.com" && senha === "12345678") {
            localStorage.setItem("foodPromotionEmail", email.trim());
            navigate("/Home");
            return;
        }
        setErro("Email ou senha inválidos.");
    }

    return (
        <main className="container">
            <form onSubmit={handleSubmit}>
                <h1>
                    Login
                    <br />
                    Food Promotion
                </h1>

                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Usuário"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <i className="bx bxs-user"></i>
                </div>

                <PasswordField
                    placeholder="Senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    required
                />

                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" />
                        Lembrar-me
                    </label>

                    <Link to="/esqueceu-senha">
                        Esqueceu a senha?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="login"
                >
                    Entrar
                </button>

                {erro && <p role="alert">{erro}</p>}

                <div className="register-link">
                    <p>
                        Não tem uma conta?{" "}
                        <Link to="/cadastro">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}

export default Login;

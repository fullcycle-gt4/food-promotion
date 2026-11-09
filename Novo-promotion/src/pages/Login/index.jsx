import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { identificarTipoUsuario, salvarUsuarioLogado } from "../../mocks/mockAuth";

function Login() {
    const navigate = useNavigate();

    function entrar(event) {
        event.preventDefault();
        const dados = new FormData(event.currentTarget);
        const email = String(dados.get("email")).trim().toLowerCase();
        const nome = email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .split(/\s+/)
            .filter(Boolean)
            .map((parte) => parte.charAt(0).toLocaleUpperCase("pt-BR") + parte.slice(1))
            .join(" ");

        const tipo = identificarTipoUsuario(email);
        salvarUsuarioLogado({ nome, email, tipo });
        navigate(tipo === "admin" ? "/admin/perfil" : "/Home");
    }

    return (
        <main className="container">
            <form onSubmit={entrar}>
                <h1>
                    Login
                    <br />
                    Food Promotion
                </h1>

                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Usuário"
                        required
                    />
                    <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        name="senha"
                        autoComplete="current-password"
                        placeholder="Senha"
                        required
                    />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" />
                        Lembrar-me
                    </label>

                    <Link to="/esqueceu-senha">
                        Esqueceu a senha?
                    </Link>
                </div>

                <button type="submit" className="login">Entrar</button>

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

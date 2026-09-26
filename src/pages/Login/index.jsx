import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
    return (
        <main className="container">
            <form>
                <h1>
                    Login
                    <br />
                    Food Promotion
                </h1>

                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Usuário"
                        required
                    />
                    <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                    <input
                        type="password"
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

                <button
                    type="submit"
                    className="login"
                >
                    <Link to="/Home">Entrar</Link>
                </button>

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

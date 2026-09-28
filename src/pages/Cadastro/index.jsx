import "./Cadastro.css";
import { Link } from "react-router-dom";

function Cadastro() {
    return (
        <main className="container">

            <form>

                <h1>
                    Cadastro
                    <br />
                    Food Promotion
                </h1>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Nome"
                        required
                    />
                    <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                    <input
                        type="email"
                        placeholder="E-mail"
                        required
                    />
                    <i className="bx bxs-envelope"></i>
                </div>

                <div className="input-box">
                    <input
                        type="date"
                        required
                    />
                    <i className="bx bxs-calendar"></i>
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Endereço"
                        required
                    />
                    <i className="bx bxs-map"></i>
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Senha"
                        required
                    />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Confirme sua senha"
                        required
                    />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className="remember-forgot">
                    <label>
                        <input
                            type="checkbox"
                            required
                        />
                        Aceito os termos
                    </label>
                </div>

                <button
                    type="submit"
                    className="login"
                >
                    Cadastrar
                </button>

                <div className="register-link">
                    <p>
                        Já possui uma conta?{" "}
                        <Link to="/">
                            Entrar
                        </Link>
                    </p>
                </div>

            </form>

        </main>
    );
}

export default Cadastro;

import "./Login.css";
import { Router, Link } from "react-router-dom";
function App() {
  return (
    <main className="container">
      <form>
        <h1>
          <br />
          Login
          <br />
          Food Promotion
        </h1>

        {/* Usuário */}
        <div className="input-box">
          <input
            type="email"
            placeholder="Usuário"
            required
          />
          <i className="bx bxs-user"></i>
        </div>

        {/* Senha */}
        <div className="input-box">
          <input
            type="password"
            placeholder="Senha"
            required
          />
          <i className="bx bxs-lock-alt"></i>
        </div>

        {/* Lembrar e recuperar senha */}
        <div className="remember-forgot">
          <label>
            <input type="checkbox" name="remember" />
            Lembrar-me
          </label>

          <a href="#">Esqueceu a senha?</a>
        </div>

        {/* Botão */}
        <button  type="submit" className="login">
          Entrar
        </button>

        {/* Cadastro */}
        <div className="register-link">
          <p>
            Criar conta{" "}
            <a href="#">Cadastre-se</a>
          </p>
        </div>
      </form>
    </main>
  );
}

export default App;


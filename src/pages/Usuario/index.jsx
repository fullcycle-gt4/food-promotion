import { Link } from "react-router-dom";

export default function Usuario() {
    return (
        <main className="container">
            <section>
                <h1>Tela do usuário</h1>
                <p>Login realizado com sucesso.</p>
                <Link to="/">Sair</Link>
            </section>
        </main>
    );
}

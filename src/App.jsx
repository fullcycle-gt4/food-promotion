import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueuseSenha from "./pages/Esqueceusenha";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/esqueceu-senha" element={<EsqueuseSenha />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

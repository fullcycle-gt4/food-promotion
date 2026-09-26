import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueuseSenha from "./pages/Esqueceusenha";
import Refazersenha from "./pages/Cadastro/refazersenha";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/esqueceu-senha" element={<EsqueuseSenha />} />
                <Route path="/refazer-senha" element={<Refazersenha />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

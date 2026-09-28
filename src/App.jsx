import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Usuario from "./pages/Usuario";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/usuario" element={<Usuario />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;

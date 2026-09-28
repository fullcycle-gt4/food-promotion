import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CadastroProduto } from './pages/Admin/CadastroProduto'
import Cadastro from './pages/Cadastro'
import Refazersenha from './pages/Cadastro/refazersenha'
import EsqueuseSenha from './pages/Esqueceusenha'
import Home from './pages/Home'
import Login from './pages/Login'
import Relatorios from './pages/Relatorios'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/produtos" element={<Home />} />
        <Route path="/produtos/novo" element={<CadastroProduto />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueceu-senha" element={<EsqueuseSenha />} />
        <Route path="/refazer-senha" element={<Refazersenha />} />
        <Route path="/clientes" element={<Navigate to="/relatorios" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;

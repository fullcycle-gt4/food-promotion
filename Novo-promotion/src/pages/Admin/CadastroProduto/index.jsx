import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { carregarProdutos, salvarProdutos } from '../../../utils/produtos'

export function CadastroProduto() {
  const navigate = useNavigate();
  const [erro, setErro] = useState('')
  const [produto, setProduto] = useState({
    nome: '',
    categoria: '',
    preco: '',
    quantidade: '',
    dataVencimento: '',
  });

  // Atualiza os campos conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoProduto = {
      ...produto,
      id: Date.now(),
      nome: produto.nome.trim(),
      categoria: produto.categoria.trim(),
      preco: Number(produto.preco),
      quantidade: Number(produto.quantidade),
    }

    if (!salvarProdutos([...carregarProdutos(), novoProduto])) {
      setErro('Não foi possível salvar o produto neste navegador.')
      return
    }

    navigate('/admin/perfil#produtos-perfil-titulo')
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Produto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input
            type="text"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoria</label>
          <input
            type="text"
            name="categoria"
            value={produto.categoria}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="preco"
            value={produto.preco}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantidade</label>
          <input
            type="number"
            min="0"
            step="1"
            name="quantidade"
            value={produto.quantidade}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
          <input
            type="date"
            name="dataVencimento"
            value={produto.dataVencimento}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {erro && <p role="alert">{erro}</p>}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-200"
        >
          Finalizar Cadastro
        </button>
      </form>
    </div>
  );
}

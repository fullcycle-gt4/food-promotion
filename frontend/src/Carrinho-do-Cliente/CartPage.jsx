import React, { useState } from 'react';

export default function CartPage() {
  // Estado inicial simulando os produtos selecionados pelo usuário
  const [carrinho, setCarrinho] = useState([
    { id: 1, nome: "Fone de Ouvido Bluetooth", preco: 150.00, quantidade: 1, imagem: "https://via.placeholder.com/80" },
    { id: 2, nome: "Mouse Gamer Ergonômico", preco: 89.90, quantidade: 2, imagem: "https://via.placeholder.com/80" }
  ]);

  const valorFrete = 15.00;

  // Formata valores para a moeda BRL (R$)
  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Atualizar quantidade de um item específico
  const alterarQuantidade = (id, delta) => {
    setCarrinho(prev =>
      prev.map(item => {
        if (item.id === id) {
          const novaQtd = item.quantidade + delta;
          return novaQtd > 0 ? { ...item, quantidade: novaQtd } : null;
        }
        return item;
      }).filter(Boolean) // Remove caso a quantidade chegue a 0
    );
  };

  // Remover um produto específico do carrinho
  const removerItem = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  // Limpar todo o carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
  };

  // Finalizar compra
  const finalizarCompra = () => {
    if (carrinho.length === 0) return;
    alert("Compra finalizada com sucesso! Redirecionando para o pagamento...");
  };

  // Cálculos dinâmicos
  const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const totalGeral = subtotal > 0 ? subtotal + valorFrete : 0;
  const carrinhoVazio = carrinho.length === 0;

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 font-sans text-gray-800">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Seu Carrinho de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lista de Produtos Selecionados */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Produtos Selecionados</h2>
            
            {carrinhoVazio ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">O seu carrinho está vazio.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {carrinho.map(produto => (
                  <div key={produto.id} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img src={produto.imagem} alt={produto.nome} className="w-16 h-16 object-cover rounded border" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{produto.nome}</h3>
                        <p className="text-sm text-gray-500">Preço Unit.: {formatarMoeda(produto.preco)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      {/* Controle de Quantidade */}
                      <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                        <button 
                          onClick={() => alterarQuantidade(produto.id, -1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition"
                        >-</button>
                        <span className="px-3 py-1 font-medium text-sm">{produto.quantidade}</span>
                        <button 
                          onClick={() => alterarQuantidade(produto.id, 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition"
                        >+</button>
                      </div>

                      {/* Subtotal do Item e Remover */}
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">
                          {formatarMoeda(produto.preco * produto.quantidade)}
                        </span>
                        <button 
                          onClick={() => removerItem(produto.id)} 
                          className="text-red-500 hover:text-red-700 text-xs mt-1 transition"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumo da Compra */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Resumo da Compra</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatarMoeda(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>{carrinhoVazio ? formatarMoeda(0) : formatarMoeda(valorFrete)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Valor Total</span>
                <span className="text-blue-600">{formatarMoeda(totalGeral)}</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <button 
                onClick={finalizarCompra}
                disabled={carrinhoVazio}
                className={`w-full font-semibold py-3 rounded-lg transition duration-200 shadow ${
                  carrinhoVazio 
                    ? 'bg-blue-300 text-white cursor-not-allowed opacity-50' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Finalizar Compra
              </button>
              <button 
                onClick={limparCarrinho}
                disabled={carrinhoVazio}
                className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
                  carrinhoVazio 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Limpar Carrinho
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
// Dados mockados de produtos (com datas de vencimento fictícias em relação a uma data de referência)
const produtosMock = [
  { id: 1, nome: "Arroz 5kg", precoBase: 25.00, dataVencimento: "2026-10-20" }, // 21 dias (16 a 30 dias)
  { id: 2, nome: "Leite 1L", precoBase: 5.50, dataVencimento: "2026-10-10" },   // 11 dias (8 a 15 dias)
  { id: 3, nome: "Iogurte Natural", precoBase: 4.00, dataVencimento: "2026-10-04" }, // 5 dias (3 a 7 dias)
  { id: 4, nome: "Sanduíche Natural", precoBase: 12.00, dataVencimento: "2026-10-01" }, // 2 dias (1 a 2 dias)
  { id: 5, nome: "Pão de Forma", precoBase: 8.00, dataVencimento: "2026-09-29" },  // Hoje (0 dias)
  { id: 6, nome: "Iogurte Vencido", precoBase: 4.50, dataVencimento: "2026-09-25" } // Vencido (< 0 dias)
];

/**
 * Calcula a diferença em dias entre duas datas (desconsiderando horas).
 */
function calcularDiferencaDias(dataVencimentoStr, dataReferencia = new Date()) {
  const vencimento = new Date(dataVencimentoStr + "T00:00:00");
  const referencia = new Date(dataReferencia.getFullYear(), dataReferencia.getMonth(), dataReferencia.getDate());
  const diffTime = vencimento - referencia;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Aplica a regra de desconto de acordo com a proximidade do vencimento.
 * @param {Object} produto - Objeto do produto contendo precoBase e dataVencimento
 * @param {Date} [dataReferencia=new Date()] - Data atual de referência para o cálculo
 * @returns {Object} Produto atualizado com preço final, desconto aplicado e status
 */
function processarDescontoProduto(produto, dataReferencia = new Date()) {
  const diasRestantes = calcularDiferencaDias(produto.dataVencimento, dataReferencia);
  
  let percentualDesconto = 0;
  let status = "Disponível";

  // Regras de Negócio
  if (diasRestantes < 0) {
    return {
      ...produto,
      diasRestantes,
      percentualDesconto: 0,
      precoFinal: 0,
      status: "Indisponível (Removido do catálogo)"
    };
  } else if (diasRestantes === 0) {
    percentualDesconto = 80; // Vence hoje
    status = "Liquidação Total";
  } else if (diasRestantes >= 1 && diasRestantes <= 2) {
    percentualDesconto = 75; // Oferta relâmpago
    status = "Oferta Relâmpago";
  } else if (diasRestantes >= 3 && diasRestantes <= 7) {
    percentualDesconto = 60;
  } else if (diasRestantes >= 8 && diasRestantes <= 15) {
    percentualDesconto = 40;
  } else if (diasRestantes >= 16 && diasRestantes <= 30) {
    percentualDesconto = 20;
  } else {
    // Mais de 30 dias: sem desconto promocional por vencimento próximo
    percentualDesconto = 0;
  }

  const valorDesconto = produto.precoBase * (percentualDesconto / 100);
  const precoFinal = Number((produto.precoBase - valorDesconto).toFixed(2));

  return {
    ...produto,
    diasRestantes,
    percentualDesconto,
    precoFinal,
    status
  };
}

/**
 * Filtra e processa o catálogo público, removendo itens vencidos automaticamente.
 */
function processarCatalogoPublico(produtos, dataReferencia = new Date()) {
  return produtos
    .map(produto => processarDescontoProduto(produto, dataReferencia))
    .filter(produto => produto.diasRestantes >= 0); // Remove automaticamente os vencidos
}

// --- Exemplo de Execução ---
// Simulando que a data de hoje é 29 de setembro de 2026
const dataHoje = new Date("2026-09-29T00:00:00");
const catalogoAtualizado = processarCatalogoPublico(produtosMock, dataHoje);

console.log("Catálogo Público Atualizado:");
console.table(catalogoAtualizado);
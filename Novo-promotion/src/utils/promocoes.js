import { calcularPromocaoPorVencimento } from '../../shared/promocoes.js'

export { calcularDiasParaVencimento } from '../../shared/promocoes.js'

export function calcularPromocaoProduto(produto, hoje = new Date()) {
  return calcularPromocaoPorVencimento(produto.preco, produto.dataVencimento, hoje)
}

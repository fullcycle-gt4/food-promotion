import { calcularPromocaoPorVencimento } from '../../../shared/promocoes.js'

export function mapearProdutoParaApi(produto, hoje = new Date()) {
  const promocao = calcularPromocaoPorVencimento(produto.originalPrice, produto.expiresAt, hoje)
  if (promocao.indisponivel) return null

  return {
    ...produto,
    originalPrice: promocao.precoBase,
    promoPrice: promocao.precoComDesconto,
    discount: promocao.percentualDesconto,
  }
}

export function mapearProdutosParaApi(produtos, hoje = new Date()) {
  return produtos
    .map((produto) => mapearProdutoParaApi(produto, hoje))
    .filter(Boolean)
}

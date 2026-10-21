import { fixtures } from '../fixtures/index.js'
import { mapearProdutosParaApi } from '../mappers/product.mapper.js'
import { ApiError } from '../errors/api-error.js'

function produtosDisponiveis() {
  return mapearProdutosParaApi(fixtures.products)
}

export function listarCategoriasDoCatalogo() {
  return fixtures.categories.map((category) => ({ ...category }))
}

export function listarProdutosDoCatalogo({ category, search, sort, onlyAvailable, page, pageSize }) {
  let products = produtosDisponiveis()
  if (category) products = products.filter((product) => product.category === category)
  if (search) {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    products = products.filter((product) =>
      `${product.name} ${product.brand || ''}`.toLocaleLowerCase('pt-BR').includes(term))
  }
  if (onlyAvailable) products = products.filter((product) => product.stock > 0)
  if (sort === 'expiresAt') products.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))
  if (sort === 'discount') products.sort((a, b) => b.discount - a.discount)

  const total = products.length
  const offset = (page - 1) * pageSize

  return {
    data: products.slice(offset, offset + pageSize),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

export function buscarProdutoPorId(productId) {
  const product = produtosDisponiveis().find((item) => item.id === productId)
  if (!product) {
    throw new ApiError({
      status: 404,
      code: 'PRODUCT_NOT_FOUND',
      message: 'Produto não encontrado ou indisponível no catálogo público.',
    })
  }
  return product
}

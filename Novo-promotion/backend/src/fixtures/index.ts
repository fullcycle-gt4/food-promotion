import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { mapearPedidoParaApi } from '../mappers/order.mapper.js'
import { mapearProdutosParaApi } from '../mappers/product.mapper.js'
import { mapearUsuarioParaApi } from '../mappers/user.mapper.js'

const diretorioMocks = new URL('../../mocks/', import.meta.url)

function carregarJsonFixture(nome) {
  const caminho = fileURLToPath(new URL(nome, diretorioMocks))
  return JSON.parse(readFileSync(caminho, 'utf8'))
}

export const fixtures = {
  categories: carregarJsonFixture('categories.json'),
  enums: carregarJsonFixture('enums.json'),
  orders: carregarJsonFixture('orders.json'),
  products: carregarJsonFixture('products.json'),
  store: carregarJsonFixture('store.json'),
  users: carregarJsonFixture('users.json'),
}

export function carregarDadosApi(hoje = new Date()) {
  const idsClientes = new Set(fixtures.users.map((usuario) => usuario.id))
  const idsProdutos = new Set(fixtures.products.map((produto) => produto.id))
  const pedidos = fixtures.orders.map((pedido) => mapearPedidoParaApi(pedido, fixtures.users, fixtures.products))

  for (const pedido of pedidos) {
    if (!idsClientes.has(pedido.clientId)) {
      throw new Error(`Pedido ${pedido.id} referencia cliente inexistente: ${pedido.clientId}.`)
    }

    for (const item of pedido.items) {
      if (!idsProdutos.has(item.productId)) {
        throw new Error(`Pedido ${pedido.id} referencia produto inexistente: ${item.productId}.`)
      }
    }
  }

  return {
    categories: fixtures.categories.map((categoria) => ({ ...categoria })),
    enums: structuredClone(fixtures.enums),
    orders: pedidos,
    products: mapearProdutosParaApi(fixtures.products, hoje),
    store: { ...fixtures.store },
    users: fixtures.users.map(mapearUsuarioParaApi),
  }
}

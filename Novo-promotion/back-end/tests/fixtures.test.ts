import assert from 'node:assert/strict'
import test from 'node:test'
import { carregarDadosApi, fixtures } from '../src/fixtures/index.js'
import { mapearProdutoParaApi } from '../src/mappers/product.mapper.js'

const HOJE = '2026-10-05'

test('mapeia produtos para o contrato API e recalcula descontos por vencimento', () => {
  const dados = carregarDadosApi(HOJE)
  const suco = mapearProdutoParaApi({ ...fixtures.products.find((produto) => produto.id === 7), expiresAt: '2026-10-06' }, HOJE)
  const chocolate = mapearProdutoParaApi({ ...fixtures.products.find((produto) => produto.id === 5), expiresAt: '2026-10-13' }, HOJE)

  assert.equal(dados.products.length, 8)
  assert.equal(dados.products.every((produto) => produto.expiresAt === '2027-01-05'), true)
  assert.equal(dados.products.every((produto) => produto.discount === 0), true)
  assert.equal(suco.discount, 75)
  assert.equal(suco.promoPrice, 3.73)
  assert.equal(chocolate.discount, 40)
  assert.equal(chocolate.promoPrice, 5.99)
  assert.equal('name' in suco, true)
  assert.equal('originalPrice' in suco, true)
  assert.equal('expiresAt' in suco, true)
})

test('não expõe senha no mapeamento público de usuários', () => {
  const dados = carregarDadosApi(HOJE)

  assert.equal(dados.users.length, 5)
  assert.equal(dados.users.every((usuario) => !Object.hasOwn(usuario, 'password')), true)
})

test('todos os pedidos apontam para clientes e produtos existentes', () => {
  const dados = carregarDadosApi(HOJE)
  const idsClientes = new Set(dados.users.map((usuario) => usuario.id))
  const idsProdutos = new Set(fixtures.products.map((produto) => produto.id))

  assert.equal(dados.orders.length, 5)
  for (const pedido of dados.orders) {
    assert.equal(idsClientes.has(pedido.clientId), true)
    for (const item of pedido.items) assert.equal(idsProdutos.has(item.productId), true)
  }
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { calcularPromocaoProduto } from '../src/utils/promocoes.js'

const DATA_ATUAL = '2026-10-05'

function dataRelativa(dias) {
  const data = new Date(`${DATA_ATUAL}T00:00:00Z`)
  data.setUTCDate(data.getUTCDate() + dias)
  return data.toISOString().slice(0, 10)
}

test('aplica o desconto correto nos limites de cada faixa', () => {
  const casos = [
    [31, 0],
    [30, 20],
    [16, 20],
    [15, 40],
    [8, 40],
    [7, 60],
    [3, 60],
    [2, 75],
    [1, 75],
    [0, 80],
  ]

  for (const [dias, desconto] of casos) {
    const promocao = calcularPromocaoProduto({ preco: 100, dataVencimento: dataRelativa(dias) }, DATA_ATUAL)

    assert.equal(promocao.diasParaVencimento, dias)
    assert.equal(promocao.percentualDesconto, desconto)
    assert.equal(promocao.precoComDesconto, 100 - desconto)
    assert.equal(promocao.indisponivel, false)
  }
})

test('marca produtos vencidos como indisponíveis', () => {
  const promocao = calcularPromocaoProduto({ preco: 100, dataVencimento: dataRelativa(-1) }, DATA_ATUAL)

  assert.equal(promocao.indisponivel, true)
  assert.equal(promocao.precoComDesconto, null)
})

test('não aplica descontos além de 30 dias', () => {
  const promocao = calcularPromocaoProduto({ preco: 34.9, dataVencimento: dataRelativa(31) }, DATA_ATUAL)

  assert.equal(promocao.percentualDesconto, 0)
  assert.equal(promocao.precoComDesconto, 34.9)
})

test('trata datas inexistentes como indisponíveis', () => {
  const promocao = calcularPromocaoProduto({ preco: 10, dataVencimento: '2026-02-30' }, DATA_ATUAL)

  assert.equal(promocao.indisponivel, true)
  assert.equal(promocao.diasParaVencimento, null)
})

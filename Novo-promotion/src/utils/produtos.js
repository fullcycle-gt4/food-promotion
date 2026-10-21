import { mockProdutos } from '../mocks/mockProdutos'

const CHAVE_PRODUTOS = 'food-promotion-produtos'

export function carregarProdutos() {
	try {
		const dadosSalvos = window.localStorage.getItem(CHAVE_PRODUTOS)
		if (!dadosSalvos) return mockProdutos

		const produtos = JSON.parse(dadosSalvos)
		return Array.isArray(produtos) ? produtos : mockProdutos
	} catch {
		return mockProdutos
	}
}

export function salvarProdutos(produtos) {
	try {
		window.localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos))
		return true
	} catch {
		return false
	}
}
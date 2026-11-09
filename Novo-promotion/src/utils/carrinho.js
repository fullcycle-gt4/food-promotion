import { carregarUsuarioLogado } from '../mocks/mockAuth'

const CHAVE_CARRINHO = 'food-promotion-selecao'

function obterChaveCarrinho() {
	return `${CHAVE_CARRINHO}:${carregarUsuarioLogado().email.toLowerCase()}`
}

export function carregarCarrinho() {
	try {
		const dadosSalvos = window.localStorage.getItem(obterChaveCarrinho())
		if (!dadosSalvos) return {}

		const carrinho = JSON.parse(dadosSalvos)
		if (!carrinho || typeof carrinho !== 'object' || Array.isArray(carrinho)) return {}

		return Object.fromEntries(
			Object.entries(carrinho)
				.filter(([, quantidade]) => Number.isFinite(Number(quantidade)) && Number(quantidade) > 0)
				.map(([id, quantidade]) => [id, Number(quantidade)]),
		)
	} catch {
		return {}
	}
}

export function salvarCarrinho(carrinho) {
	try {
		window.localStorage.setItem(obterChaveCarrinho(), JSON.stringify(carrinho))
		return true
	} catch {
		return false
	}
}
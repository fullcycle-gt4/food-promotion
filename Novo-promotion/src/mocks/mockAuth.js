const CHAVE_USUARIO_LOGADO = 'food-promotion-usuario-logado'
const EMAIL_ADMIN = 'admin@foodpromotion.com'
const USUARIO_PADRAO = {
	nome: 'Admin Manager',
	email: 'admin@foodpromotion.com',
	tipo: 'admin',
}

export function identificarTipoUsuario(email) {
	return email.trim().toLowerCase() === EMAIL_ADMIN ? 'admin' : 'cliente'
}

export function salvarUsuarioLogado(usuario) {
	try {
		const email = usuario.email.trim().toLowerCase()
		const tipo = usuario.tipo || identificarTipoUsuario(email)
		window.sessionStorage.setItem(CHAVE_USUARIO_LOGADO, JSON.stringify({ ...usuario, email, tipo }))
		return true
	} catch {
		return false
	}
}

export function obterUsuarioLogado() {
	try {
		const usuarioSalvo = window.sessionStorage.getItem(CHAVE_USUARIO_LOGADO)
		if (!usuarioSalvo) return null

		const usuario = JSON.parse(usuarioSalvo)
		if (typeof usuario.email !== 'string' || !usuario.email) return null

		return {
			nome: usuario.nome || usuario.email.split('@')[0],
			email: usuario.email,
			tipo: usuario.tipo || identificarTipoUsuario(usuario.email),
		}
	} catch {
		return null
	}
}

export function carregarUsuarioLogado() {
	return obterUsuarioLogado() || USUARIO_PADRAO
}

export function encerrarSessao() {
	try {
		window.sessionStorage.removeItem(CHAVE_USUARIO_LOGADO)
	} catch {
		return false
	}

	return true
}

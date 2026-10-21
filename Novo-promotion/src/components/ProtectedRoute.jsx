import { Navigate } from 'react-router-dom'
import { obterUsuarioLogado } from '../mocks/mockAuth'

export default function ProtectedRoute({ tipo, children }) {
	const usuario = obterUsuarioLogado()

	if (!usuario) return <Navigate to="/" replace />
	if (tipo && usuario.tipo !== tipo) {
		return <Navigate to={usuario.tipo === 'admin' ? '/admin/perfil' : '/Home'} replace />
	}

	return children
}

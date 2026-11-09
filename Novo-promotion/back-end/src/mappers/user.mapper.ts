export function mapearUsuarioParaApi(usuario) {
  const usuarioPublico = { ...usuario }
  delete usuarioPublico.password
  return usuarioPublico
}

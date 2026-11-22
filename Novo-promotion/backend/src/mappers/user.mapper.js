export function mapearUsuarioParaApi(usuario) {
    const usuarioPublico = { ...usuario };
    delete usuarioPublico.password;
    return usuarioPublico;
}
//# sourceMappingURL=user.mapper.js.map
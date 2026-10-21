export function mapearPedidoParaApi(pedido, usuarios, produtos) {
  const idsUsuarios = new Set(usuarios.map((usuario) => usuario.id))
  const idsProdutos = new Set(produtos.map((produto) => produto.id))

  if (!idsUsuarios.has(pedido.clientId)) {
    throw new Error(`Pedido ${pedido.id} referencia cliente inexistente: ${pedido.clientId}.`)
  }

  for (const item of pedido.items) {
    if (!idsProdutos.has(item.productId)) {
      throw new Error(`Pedido ${pedido.id} referencia produto inexistente: ${item.productId}.`)
    }
  }

  return {
    ...pedido,
    items: pedido.items.map((item) => ({ ...item })),
  }
}

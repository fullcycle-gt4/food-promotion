import {
  buscarProdutoPorId,
  listarCategoriasDoCatalogo,
  listarProdutosDoCatalogo,
} from '../services/catalog.service.js'
import { validarIdProduto, validarConsultaCatalogo } from '../validators/catalog.validator.js'
import { responderSucesso } from '../utils/api-response.js'

export function listarCategorias(request, response) {
  return responderSucesso(response, listarCategoriasDoCatalogo())
}

export function listarProdutos(request, response) {
  const filtros = validarConsultaCatalogo(request.query)
  const resultado = listarProdutosDoCatalogo(filtros)
  return responderSucesso(response, resultado.data, { pagination: resultado.pagination })
}

export function obterProduto(request, response) {
  const productId = validarIdProduto(request.params.id)
  return responderSucesso(response, buscarProdutoPorId(productId))
}

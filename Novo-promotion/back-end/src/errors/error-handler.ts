import { ApiError } from './api-error.js'
import { responderErro } from '../utils/api-response.js'

export function rotaNaoEncontrada(request, response) {
  return responderErro(response, {
    status: 404,
    code: 'ROUTE_NOT_FOUND',
    message: 'A rota solicitada não foi encontrada.',
  })
}

export function tratarErro(error, request, response, next) {
  if (response.headersSent) return next(error)

  if (error instanceof ApiError) {
    return responderErro(response, {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    })
  }

  if (error.type === 'entity.parse.failed') {
    return responderErro(response, {
      status: 400,
      code: 'INVALID_JSON',
      message: 'O corpo da requisição contém JSON inválido.',
    })
  }

  if (error.type === 'entity.too.large') {
    return responderErro(response, {
      status: 413,
      code: 'PAYLOAD_TOO_LARGE',
      message: 'O corpo da requisição excede o limite permitido.',
    })
  }

  if (error.status === 400) {
    return responderErro(response, {
      status: 400,
      code: 'BAD_REQUEST',
      message: 'A requisição não pôde ser processada.',
    })
  }

  console.error(`[${request.id}] Erro não tratado na API:`, error)
  return responderErro(response, {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'Ocorreu um erro interno no servidor.',
  })
}

import { responderSucesso } from '../utils/api-response.js'

export function healthHandler(request, response) {
  return responderSucesso(response, {
    status: 'ok',
    service: 'food-promotion-api',
    version: 'v1',
  })
}

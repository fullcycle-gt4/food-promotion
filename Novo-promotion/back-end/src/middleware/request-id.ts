import { randomUUID } from 'node:crypto'

export function requestId(request, response, next) {
  request.id = randomUUID()
  response.locals.requestId = request.id
  response.setHeader('X-Request-Id', request.id)
  next()
}

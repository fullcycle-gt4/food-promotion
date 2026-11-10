export function responderSucesso(response, data, meta = {}) {
  return response.json({
    data,
    meta: {
      ...meta,
      requestId: response.locals.requestId,
    },
  })
}

export function responderErro(response, { status = 500, code = 'INTERNAL_ERROR', message, details }) {
  const error = {
    code,
    message,
    requestId: response.locals.requestId,
  }

  if (details !== undefined) error.details = details

  return response.status(status).json({ error })
}

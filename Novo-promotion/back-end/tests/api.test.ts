import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../src/app.js'

test('expõe contratos REST versionados com envelopes e documentação OpenAPI', async () => {
  const server = app.listen(0, '127.0.0.1')
  await new Promise((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })

  const baseUrl = `http://127.0.0.1:${server.address().port}`

  try {
    const healthResponse = await fetch(`${baseUrl}/api/v1/health`)
    const health = await healthResponse.json()
    assert.equal(healthResponse.status, 200)
    assert.equal(health.data.status, 'ok')
    assert.match(health.meta.requestId, /^[\da-f-]{36}$/)
    assert.equal(healthResponse.headers.get('x-request-id'), health.meta.requestId)

    const legacyHealthResponse = await fetch(`${baseUrl}/api/health`)
    assert.equal(legacyHealthResponse.status, 200)
    assert.equal((await legacyHealthResponse.json()).data.status, 'ok')

    const productsResponse = await fetch(`${baseUrl}/api/v1/products?page=1&pageSize=1`)
    const products = await productsResponse.json()
    assert.equal(productsResponse.status, 200)
    assert.equal(products.data.length, 1)
    assert.equal(products.meta.pagination.page, 1)
    assert.equal(products.meta.pagination.pageSize, 1)
    assert.equal(typeof products.meta.pagination.total, 'number')
    assert.equal(products.meta.requestId, productsResponse.headers.get('x-request-id'))

    const categoriesResponse = await fetch(`${baseUrl}/api/v1/categories`)
    const categories = await categoriesResponse.json()
    assert.equal(categoriesResponse.status, 200)
    assert.ok(categories.data.length > 0)

    const validationResponse = await fetch(`${baseUrl}/api/v1/products?page=0`)
    const validation = await validationResponse.json()
    assert.equal(validationResponse.status, 400)
    assert.equal(validation.error.code, 'VALIDATION_ERROR')
    assert.ok(validation.error.details.length > 0)
    assert.equal(validation.error.requestId, validationResponse.headers.get('x-request-id'))

    const missingResponse = await fetch(`${baseUrl}/api/v1/products/999999`)
    const missing = await missingResponse.json()
    assert.equal(missingResponse.status, 404)
    assert.equal(missing.error.code, 'PRODUCT_NOT_FOUND')

    const unknownRouteResponse = await fetch(`${baseUrl}/api/v1/unknown`)
    const unknownRoute = await unknownRouteResponse.json()
    assert.equal(unknownRouteResponse.status, 404)
    assert.equal(unknownRoute.error.code, 'ROUTE_NOT_FOUND')

    const invalidJsonResponse = await fetch(`${baseUrl}/api/v1/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json',
    })
    const invalidJson = await invalidJsonResponse.json()
    assert.equal(invalidJsonResponse.status, 400)
    assert.equal(invalidJson.error.code, 'INVALID_JSON')

    const specResponse = await fetch(`${baseUrl}/api/openapi.json`)
    const spec = await specResponse.json()
    assert.equal(spec.openapi, '3.1.0')
    assert.ok(spec.paths['/products'].get)
    assert.ok(spec.paths['/products/{id}'].get)

    const docsResponse = await fetch(`${baseUrl}/api/docs/`)
    assert.equal(docsResponse.status, 200)
    assert.match(await docsResponse.text(), /swagger-ui/)
  } finally {
    server.closeAllConnections()
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }
})

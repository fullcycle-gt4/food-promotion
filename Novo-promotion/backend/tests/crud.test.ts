import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { after, test } from 'node:test'
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const databaseUrl = 'file:./crud.test.db'
const testDatabase = resolve('crud.test.db')
const databaseSidecars = ['-journal', '-shm', '-wal'].map((suffix) => `${testDatabase}${suffix}`)

process.env.DATABASE_URL = databaseUrl
execFileSync(
  process.execPath,
  [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
  { env: process.env, stdio: 'inherit' },
)

const [{ default: app }, { prisma }] = await Promise.all([
  import('../src/app.js'),
  import('../src/config/prisma.js'),
])

after(async () => {
  await prisma.$disconnect()
  for (const file of [testDatabase, ...databaseSidecars]) {
    if (existsSync(file)) rmSync(file)
  }
})

test('mantém as rotas CRUD de usuários e publicações na API unificada', async () => {
  const server = app.listen(0, '127.0.0.1')
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })

  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  const baseUrl = `http://127.0.0.1:${address.port}`
  const email = `crud-${Date.now()}@example.com`

  try {
    const invalidUserResponse = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalido' }),
    })
    assert.equal(invalidUserResponse.status, 400)

    const createUserResponse = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: 'Cliente de teste' }),
    })
    assert.equal(createUserResponse.status, 201)
    const user = await createUserResponse.json()
    assert.equal(user.email, email)
    assert.equal(user.name, 'Cliente de teste')

    const duplicateResponse = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    assert.equal(duplicateResponse.status, 409)

    const updateUserResponse = await fetch(`${baseUrl}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Cliente atualizado' }),
    })
    assert.equal(updateUserResponse.status, 200)
    assert.equal((await updateUserResponse.json()).name, 'Cliente atualizado')

    const createPostResponse = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Oferta', authorId: user.id }),
    })
    assert.equal(createPostResponse.status, 201)
    const post = await createPostResponse.json()
    assert.equal(post.title, 'Oferta')
    assert.equal(post.author.id, user.id)

    const missingUserResponse = await fetch(`${baseUrl}/users/999999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Inexistente' }),
    })
    assert.equal(missingUserResponse.status, 404)

    const deletePostResponse = await fetch(`${baseUrl}/posts/${post.id}`, { method: 'DELETE' })
    assert.equal(deletePostResponse.status, 204)

    const deleteUserResponse = await fetch(`${baseUrl}/users/${user.id}`, { method: 'DELETE' })
    assert.equal(deleteUserResponse.status, 204)
  } finally {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }
})

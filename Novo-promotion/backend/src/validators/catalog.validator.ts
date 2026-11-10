import { ApiError } from '../errors/api-error.js'

const TAMANHO_PAGINA_PADRAO = 20
const TAMANHO_PAGINA_MAXIMO = 100

function erroValidacao(campo, message) {
  throw new ApiError({
    status: 400,
    code: 'VALIDATION_ERROR',
    message: 'Um ou mais parâmetros são inválidos.',
    details: [{ field: campo, message }],
  })
}

function lerInteiroPositivo(value, fallback, campo, maximo = Number.MAX_SAFE_INTEGER) {
  if (value === undefined) return fallback
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    erroValidacao(campo, 'Informe um número inteiro maior que zero.')
  }

  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed > maximo) {
    erroValidacao(campo, `O valor máximo permitido é ${maximo}.`)
  }

  return parsed
}

function lerBooleano(value, fallback, campo) {
  if (value === undefined) return fallback
  if (value === 'true') return true
  if (value === 'false') return false
  erroValidacao(campo, 'Informe true ou false.')
}

export function validarConsultaCatalogo(query) {
  const { category, search, sort: requestedSort } = query
  const sort = requestedSort || 'expiresAt'

  if (category !== undefined && (typeof category !== 'string' || category.length > 100)) {
    erroValidacao('category', 'A categoria deve ter até 100 caracteres.')
  }
  if (search !== undefined && (typeof search !== 'string' || search.length > 100)) {
    erroValidacao('search', 'A busca deve ter até 100 caracteres.')
  }
  if (!['expiresAt', 'discount'].includes(sort)) {
    erroValidacao('sort', 'Os valores aceitos são expiresAt e discount.')
  }

  return {
    category,
    search,
    sort,
    onlyAvailable: lerBooleano(query.onlyAvailable, true, 'onlyAvailable'),
    page: lerInteiroPositivo(query.page, 1, 'page'),
    pageSize: lerInteiroPositivo(
      query.pageSize,
      TAMANHO_PAGINA_PADRAO,
      'pageSize',
      TAMANHO_PAGINA_MAXIMO,
    ),
  }
}

export function validarIdProduto(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    erroValidacao('id', 'O identificador deve ser um número inteiro maior que zero.')
  }
  const productId = Number(value)
  if (!Number.isSafeInteger(productId)) {
    erroValidacao('id', 'O identificador deve ser um número inteiro maior que zero.')
  }
  return productId
}

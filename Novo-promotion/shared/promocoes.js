const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000

function inicioDoDiaUtc(data) {
  if (data instanceof Date) {
    if (Number.isNaN(data.getTime())) return null
    return Date.UTC(data.getFullYear(), data.getMonth(), data.getDate())
  }

  if (typeof data !== 'string') return null

  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data)
  if (!partes) return null

  const ano = Number(partes[1])
  const mes = Number(partes[2])
  const dia = Number(partes[3])
  const timestamp = Date.UTC(ano, mes - 1, dia)
  const dataVerificada = new Date(timestamp)

  if (
    dataVerificada.getUTCFullYear() !== ano
    || dataVerificada.getUTCMonth() !== mes - 1
    || dataVerificada.getUTCDate() !== dia
  ) {
    return null
  }

  return timestamp
}

export function calcularDiasParaVencimento(dataVencimento, hoje = new Date()) {
  const vencimento = inicioDoDiaUtc(dataVencimento)
  const dataAtual = inicioDoDiaUtc(hoje)

  if (vencimento === null || dataAtual === null) return null

  return Math.trunc((vencimento - dataAtual) / MILISSEGUNDOS_POR_DIA)
}

export function calcularPromocaoPorVencimento(precoBaseInformado, dataVencimento, hoje = new Date()) {
  const diasParaVencimento = calcularDiasParaVencimento(dataVencimento, hoje)
  const precoBase = Number(precoBaseInformado)
  const precoValido = Number.isFinite(precoBase) && precoBase >= 0
  const indisponivel = diasParaVencimento === null || diasParaVencimento < 0 || !precoValido

  if (indisponivel) {
    return {
      diasParaVencimento,
      percentualDesconto: 0,
      precoBase,
      precoComDesconto: null,
      indisponivel: true,
    }
  }

  let percentualDesconto = 0
  if (diasParaVencimento === 0) percentualDesconto = 80
  else if (diasParaVencimento <= 2) percentualDesconto = 75
  else if (diasParaVencimento <= 7) percentualDesconto = 60
  else if (diasParaVencimento <= 15) percentualDesconto = 40
  else if (diasParaVencimento <= 30) percentualDesconto = 20

  const precoComDesconto = Math.round((precoBase * (1 - percentualDesconto / 100) + Number.EPSILON) * 100) / 100

  return {
    diasParaVencimento,
    percentualDesconto,
    precoBase,
    precoComDesconto,
    indisponivel: false,
  }
}

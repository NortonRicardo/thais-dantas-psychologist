/**
 * Máscaras para inputs (CPF, telefone, salário).
 * Use nas mudanças de valor para exibir formatado e ao enviar use os unmask/parse.
 */

const onlyDigits = (s: string) => s.replace(/\D/g, '')

/** Exibição de CPF (já formatado ou bruto). Retorna "—" se vazio. */
export function displayCpf(cpf: string): string {
  return cpf || '—'
}

/** Formata CPF: 000.000.000-00 (máx. 11 dígitos). */
export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export function unmaskCpf(value: string): string {
  return onlyDigits(value).slice(0, 11)
}

/** Formata telefone: (00) 00000-0000 ou (00) 0000-0000. */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function unmaskPhone(value: string): string {
  return onlyDigits(value).slice(0, 11)
}

/** Formata valor monetário para exibição em input: R$ 1.234,56. */
export function maskCurrencyInput(value: string): string {
  const d = onlyDigits(value)
  if (d.length === 0) return ''
  const intPart = d.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0'
  const decPart = d.slice(-2).padStart(2, '0')
  return `R$ ${intPart},${decPart}`
}

/** Converte string mascarada (R$ 1.234,56) para número em centavos ou valor inteiro. Retorna 0 se inválido. */
export function parseCurrency(value: string): number {
  const d = onlyDigits(value)
  if (d.length === 0) return 0
  return Number(d) / 100
}

/** Formata número para exibição: R$ 1.234,56 (para uso em labels/read-only). */
export function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/** Converte valor numérico para string no formato do input mascarado (para initial value). */
export function currencyToMaskedInput(value: number): string {
  if (value === 0) return ''
  const fixed = value.toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$ ${withDots},${decPart}`
}

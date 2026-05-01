/** Formata data ISO para pt-BR (dd/mm/aaaa). Retorna "—" se null/undefined ou inválido. */
export function formatDate(iso: string | null | undefined): string {
  if (iso == null || iso === '') return '—'
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

/** Converte data ISO para value de input[type=date] (yyyy-mm-dd). Retorna '' se null/undefined ou inválido. */
export function toDateInputValue(iso: string | null | undefined): string {
  if (iso == null || iso === '') return ''
  try {
    const d = new Date(iso)
    return d.toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

/** Formata string yyyy-mm-dd para exibição pt-BR (dd/mm/aaaa). Retorna '' se vazio ou inválido. */
export function formatDateInputDisplay(value: string): string {
  if (value == null || value === '') return ''
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return value
  return `${match[3]}/${match[2]}/${match[1]}`
}

/** Formata Date para exibição longa pt-BR (ex.: "20 de maio de 1990"). */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

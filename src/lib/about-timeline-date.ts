/** Valor do input HTML `type="month"` (YYYY-MM), sempre 1º dia UTC. */

export function monthInputFromIso(iso: string): string {
  const d = new Date(iso)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/** Ano exibido na linha do tempo pública (somente o ano). */
export function displayYearFromIso(iso: string): string {
  return String(new Date(iso).getUTCFullYear())
}

export function parseMonthInputToUtcDate(value: string): Date | null {
  const t = value?.trim()
  if (!t || !/^\d{4}-\d{2}$/.test(t)) return null
  const [y, m] = t.split('-').map(Number)
  if (m < 1 || m > 12 || y < 1000 || y > 9999) return null
  return new Date(Date.UTC(y, m - 1, 1))
}

/** Listagem no gestor: mês abreviado + ano (UTC). */
export function formatMonthYearPtUtc(iso: string): string {
  const d = new Date(iso)
  return d
    .toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .replace('.', '')
}

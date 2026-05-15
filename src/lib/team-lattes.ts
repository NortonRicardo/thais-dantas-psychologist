/** Normaliza URL do Currículo Lattes (CNPq) ou retorna null se vazio / inválida. */
export function normalizeLattesUrl(raw: string | null | undefined): string | null {
  const t = raw?.trim()
  if (!t) return null
  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`
  try {
    const u = new URL(withScheme)
    const hostNorm = u.hostname.replace(/^www\./i, '').toLowerCase()
    const ok =
      hostNorm === 'lattes.cnpq.br' ||
      hostNorm === 'buscatextual.cnpq.br' ||
      hostNorm.endsWith('.lattes.cnpq.br')
    if (!ok) return null
    u.hash = ''
    return u.toString().replace(/\/+$/, '') || null
  } catch {
    return null
  }
}

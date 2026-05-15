/** Normaliza URL do LinkedIn ou retorna null se vazio / inválida. */
export function normalizeLinkedinUrl(raw: string | null | undefined): string | null {
  const t = raw?.trim()
  if (!t) return null
  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`
  try {
    const u = new URL(withScheme)
    const host = u.hostname.replace(/^www\./i, '').toLowerCase()
    if (!host.includes('linkedin.')) return null
    u.hash = ''
    return u.toString().replace(/\/+$/, '') || null
  } catch {
    return null
  }
}

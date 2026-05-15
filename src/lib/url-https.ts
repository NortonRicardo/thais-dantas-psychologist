/** Remove `http(s)://` e barras iniciais — valor exibido após o prefixo fixo `https://`. */
export function stripUrlScheme(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^\/+/, '')
}

/** Monta URL absoluta com `https://` para persistir ou enviar à API. */
export function toHttpsStored(suffix: string): string {
  const t = stripUrlScheme(suffix)
  if (!t) return ''
  return `https://${t}`
}

const MAX_LENGTH = 160

/** Deriva um teaser em texto puro a partir do HTML do corpo do artigo. */
export function deriveExcerpt(html: string, maxLength = MAX_LENGTH): string {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`
}

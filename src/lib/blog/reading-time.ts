const WORDS_PER_MINUTE = 200

/** Estima o tempo de leitura (min) a partir do HTML do corpo do artigo. */
export function estimateReadTimeMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean)
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE))
}

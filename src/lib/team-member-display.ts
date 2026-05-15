/** Nome público: tratamento + nome (sem tratamento = só o nome). */
export function teamMemberDisplayName(
  name: string,
  namePrefixLabel?: string | null
): string {
  const n = name.trim()
  const p = namePrefixLabel?.trim()
  if (!p) return n
  return `${p} ${n}`.trim()
}

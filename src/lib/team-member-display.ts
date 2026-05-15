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

/** Área + instituição (sem grau), para tabelas com coluna de grau separada. */
export function teamMemberQualificationFormationLine(input: {
  qualification: string
  formationInstitution?: string | null
}): string {
  const parts: string[] = []
  const q = input.qualification.trim()
  const f = input.formationInstitution?.trim()
  if (q) parts.push(q)
  if (f) parts.push(f)
  return parts.join(' · ')
}

/** Linha de atuação/formação: grau · qualificação · instituição (omite partes vazias). */
export function teamMemberProfessionalLine(input: {
  degreeLevelLabel?: string | null
  qualification: string
  formationInstitution?: string | null
}): string {
  const parts: string[] = []
  const d = input.degreeLevelLabel?.trim()
  const q = input.qualification.trim()
  const f = input.formationInstitution?.trim()
  if (d) parts.push(d)
  if (q) parts.push(q)
  if (f) parts.push(f)
  return parts.join(' · ')
}

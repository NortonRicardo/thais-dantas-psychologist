/** Selo na tabela do gestor — aceita cor curta (bg-sky-500) ou classe completa legada */
export function projectCategoryManagerBadgeClasses(storedColor: string) {
  const c = storedColor.trim()
  if (c.includes('text-') && c.includes('border-')) return c
  const m = /^bg-([a-z]+)-(\d+)$/.exec(c)
  if (!m) return 'bg-slate-500/15 text-slate-300 border-slate-500/30'
  const fam = m[1]
  const shade = m[2]
  return `bg-${fam}-${shade}/15 text-${fam}-300 border-${fam}-500/30`
}

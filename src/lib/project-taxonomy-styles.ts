import { COLOR_HEX_MAP } from '@/components/constants/colors'

/** Obtém chave `bg-família-número` a partir de valor curto ou de classe badge completa */
export function extractBgColorKey(color: string): string {
  const c = color.trim()
  const m = /^bg-([a-z]+)-(\d+)/.exec(c)
  if (m) return `bg-${m[1]}-${m[2]}`
  return 'bg-slate-500'
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ]
}

/** Estilos do selo de categoria na página pública /projetos */
export function defaultCategoryChipsFromManagerColor(managerColor: string) {
  const hex = COLOR_HEX_MAP[extractBgColorKey(managerColor)] ?? '#64748b'
  const [r, g, b] = hexToRgb(hex)
  return {
    chipBg: `rgba(${r},${g},${b},0.18)`,
    chipBorder: `rgba(${r},${g},${b},0.4)`,
    chipText: `rgb(${Math.min(255, r + 55)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 45)})`,
  }
}

/** Pill + filtros do tema na página pública */
export function defaultThemeStylesFromManagerColor(managerColor: string) {
  const hex = COLOR_HEX_MAP[extractBgColorKey(managerColor)] ?? '#3b82f6'
  const [r, g, b] = hexToRgb(hex)
  return {
    pillColor: `rgba(${r},${g},${b},0.6)`,
    filterBg: `rgba(${r},${g},${b},0.08)`,
    filterBorder: `rgba(${r},${g},${b},0.25)`,
    filterText: `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 45)}, ${Math.min(255, b + 35)})`,
    filterActiveBg: `rgba(${r},${g},${b},0.22)`,
  }
}

export function slugifyThemeSlug(name: string) {
  return (
    name
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'tema'
  )
}

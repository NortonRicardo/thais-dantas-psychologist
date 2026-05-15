import type { LucideIcon } from 'lucide-react'
import * as Lucide from 'lucide-react'

function isLucideIcon(v: unknown): v is LucideIcon {
  if (typeof v === 'function') return true
  if (
    typeof v === 'object' &&
    v !== null &&
    'render' in v &&
    typeof (v as { render?: unknown }).render === 'function'
  )
    return true
  return false
}

function lucideExportExists(name: string): boolean {
  return isLucideIcon((Lucide as Record<string, unknown>)[name])
}

/** Converte chave salva (ex.: `cloud-sun`, `Cpu`) para nome do export Lucide. */
export function iconKeyToLucideExportName(iconKey: string): string {
  const k = iconKey.trim()
  if (!k) return 'Layers'
  if (lucideExportExists(k)) return k
  const fromSegments = k
    .split(/[-_]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
  return fromSegments
}

/** Resolve ícone por chave de cadastro; `fallback` quando o nome não existe no pacote. */
export function getLucideIconNamed(
  iconKey: string,
  fallback: LucideIcon = Lucide.Layers
): LucideIcon {
  const name = iconKeyToLucideExportName(iconKey)
  const C = (Lucide as Record<string, unknown>)[name]
  if (isLucideIcon(C)) return C
  return fallback
}

export function getLucideIcon(name: string): LucideIcon {
  const C = (Lucide as Record<string, unknown>)[name]
  if (isLucideIcon(C)) return C
  return Lucide.Cpu as LucideIcon
}

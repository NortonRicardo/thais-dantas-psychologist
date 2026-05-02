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

export function getLucideIcon(name: string): LucideIcon {
  const C = (Lucide as Record<string, unknown>)[name]
  if (isLucideIcon(C)) return C
  return Lucide.Cpu as LucideIcon
}

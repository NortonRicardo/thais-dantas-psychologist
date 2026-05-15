'use client'

import { createElement, useDeferredValue, useMemo, useState } from 'react'
import * as Lucide from 'lucide-react'
import { ChevronDown, CircleOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const LUCIDE_ICON_NAMES = Object.keys(Lucide)
  .filter(k => /^[A-Z]/.test(k) && !k.endsWith('Icon'))
  .sort((a, b) => a.localeCompare(b))

function resolveIcon(name: string): LucideIcon {
  const C = (Lucide as Record<string, unknown>)[name]
  if (typeof C === 'function') return C as LucideIcon
  if (
    typeof C === 'object' &&
    C !== null &&
    'render' in C &&
    typeof (C as { render?: unknown }).render === 'function'
  )
    return C as unknown as LucideIcon
  return Lucide.Cpu as LucideIcon
}

type Props = {
  value: string
  onChange: (iconName: string) => void
  disabled?: boolean
  /** Versão mais baixa e densa (cards de módulo no gestor). */
  compact?: boolean
}

export function LucideIconPicker({
  value,
  onChange,
  disabled,
  compact,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query.trim().toLowerCase())

  const filtered = useMemo(() => {
    if (!deferred) return LUCIDE_ICON_NAMES.slice(0, compact ? 80 : 96)
    const hits = LUCIDE_ICON_NAMES.filter(n =>
      n.toLowerCase().includes(deferred)
    )
    return hits.slice(0, compact ? 96 : 144)
  }, [deferred, compact])

  const trimmedValue = value?.trim() ?? ''
  const resolvedIconName =
    trimmedValue && LUCIDE_ICON_NAMES.includes(trimmedValue)
      ? trimmedValue
      : null
  const hasIcon = resolvedIconName !== null

  const iconPreview = compact ? 18 : 16
  const gridBtn = compact ? 'h-8 w-8' : 'h-10 w-10'
  const gridIconSz = compact ? 15 : 18

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {compact ? (
          <button
            type="button"
            disabled={disabled}
            title={hasIcon ? resolvedIconName : 'Sem ícone'}
            aria-label={
              hasIcon
                ? `Escolher ícone do módulo (atual: ${resolvedIconName})`
                : 'Escolher ícone do módulo (nenhum ícone selecionado)'
            }
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40',
              hasIcon
                ? 'border-white/15 bg-white/5 hover:bg-white/12'
                : 'border-dashed border-white/25 bg-white/[0.03] hover:border-white/35 hover:bg-white/8'
            )}
          >
            {hasIcon ? (
              createElement(resolveIcon(resolvedIconName), {
                size: iconPreview,
                strokeWidth: 1.5,
              })
            ) : (
              <CircleOff
                className="text-white/30"
                size={iconPreview}
                strokeWidth={1.5}
                aria-hidden
              />
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            title={hasIcon ? resolvedIconName : 'Sem ícone'}
            aria-label={
              hasIcon
                ? `Ícone: ${resolvedIconName}. Abrir lista.`
                : 'Nenhum ícone. Abrir lista.'
            }
            className={cn(
              'flex w-full items-center justify-between gap-2 rounded-md border border-white/15 bg-white/5 px-2 py-1.5 text-white transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40'
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                  hasIcon
                    ? 'bg-white/10'
                    : 'border border-dashed border-white/20 bg-white/[0.04]'
                )}
              >
                {hasIcon ? (
                  createElement(resolveIcon(resolvedIconName), {
                    size: iconPreview,
                    strokeWidth: 1.5,
                  })
                ) : (
                  <CircleOff
                    className="text-white/35"
                    size={iconPreview}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                )}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/35" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="border-white/10 bg-[#071525] p-2.5 text-white shadow-xl"
        style={{ width: `min(100vw - 2rem, ${compact ? '18rem' : '22rem'})` }}
        align="start"
      >
        <Input
          placeholder="Buscar ícone…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={cn(
            'mb-2 border-white/15 bg-white/5 text-white placeholder:text-white/35',
            compact ? 'h-8 text-xs' : 'text-sm'
          )}
        />
        <ScrollArea
          className={cn(
            compact ? 'max-h-44' : 'max-h-52',
            'overscroll-contain'
          )}
        >
          <div
            className={cn(
              'grid gap-1 pr-1',
              compact ? 'grid-cols-7' : 'grid-cols-6'
            )}
          >
            {filtered.map(name => {
              const selected = hasIcon && name === trimmedValue
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-colors',
                    gridBtn,
                    selected
                      ? 'bg-orange-800/90 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/12 hover:text-white'
                  )}
                >
                  {createElement(resolveIcon(name), {
                    size: gridIconSz,
                    strokeWidth: 1.5,
                  })}
                </button>
              )
            })}
          </div>
        </ScrollArea>
        {hasIcon && (
          <button
            type="button"
            className="mt-2 w-full rounded-md border border-white/10 bg-white/[0.04] py-1.5 text-[0.7rem] text-white/50 transition-colors hover:bg-white/10 hover:text-white/75"
            onClick={() => {
              onChange('')
              setOpen(false)
            }}
          >
            Remover ícone
          </button>
        )}
        {filtered.length === 0 && (
          <p className="py-3 text-center text-[0.65rem] text-white/40">
            Nenhum ícone com esse termo.
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}

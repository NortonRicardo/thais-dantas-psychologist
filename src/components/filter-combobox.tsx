'use client'

import React, { useRef, useState } from 'react'
import { ChevronDown, Plus, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

export function FilterCombobox({
  value,
  onChange,
  placeholder,
  clearLabel,
  options,
  width = 'w-44',
  showClear = true,
  light = false,
  popoverClassName,
  renderOption,
  labelForValue,
  renderValue,
  allowCreate = false,
  createLabel,
  footer,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  clearLabel: string
  options: string[]
  width?: string
  /** Se false, oculta o rodapé «limpar» (ex.: campo obrigatório). */
  showClear?: boolean
  /** Modo claro — para uso em modais/fundos claros. */
  light?: boolean
  /** Classe extra para o PopoverContent (ex.: cor de fundo customizada). */
  popoverClassName?: string
  renderOption?: (opt: string) => React.ReactNode
  /** Quando `value` não é legível (ex.: id), exibir rótulo no botão. */
  labelForValue?: (value: string) => string
  /** Conteúdo customizado do botão quando há valor (ex.: bolinha + título). */
  renderValue?: (value: string) => React.ReactNode
  /** Permite criar uma opção nova quando a busca não corresponde a nenhuma existente. */
  allowCreate?: boolean
  /** Rótulo customizado da linha de criação (padrão: `Criar "{search}"`). */
  createLabel?: (search: string) => string
  /** Conteúdo extra fixo no rodapé do popover (ex.: botão "Nova categoria"). */
  footer?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(o => {
    const display = labelForValue?.(o) ?? o
    return display.toLowerCase().includes(search.toLowerCase())
  })

  const trimmedSearch = search.trim()
  const hasExactMatch = options.some(
    o => (labelForValue?.(o) ?? o).toLowerCase() === trimmedSearch.toLowerCase()
  )
  const showCreateRow =
    allowCreate && trimmedSearch.length > 0 && !hasExactMatch

  function select(v: string) {
    onChange(v)
    setOpen(false)
    setSearch('')
  }

  const triggerLabel = value
    ? labelForValue
      ? labelForValue(value)
      : value
    : ''

  return (
    <Popover
      open={open}
      onOpenChange={o => {
        setOpen(o)
        if (o) setTimeout(() => inputRef.current?.focus(), 0)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex h-9 min-w-0 ${width} items-center justify-between gap-2 rounded-md border px-3 py-0 text-sm outline-none shadow-[0_2px_6px_rgba(0,0,0,0.15)] ${
            light
              ? 'border-[#2D2D2D]/15 bg-[#ede8e1] hover:bg-[#2D2D2D]/4 focus:border-[#556040]/40'
              : 'border-white/10 bg-white/5 hover:bg-white/[0.08] focus:border-white/20'
          }`}
        >
          <span
            className={`flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left ${
              light
                ? value
                  ? 'text-[#2D2D2D]/80'
                  : 'text-[#2D2D2D]/35'
                : value
                  ? 'text-white/80'
                  : 'text-white/25'
            }`}
          >
            {value && renderValue ? (
              <span className="flex min-w-0 flex-1 overflow-hidden">
                {renderValue(value)}
              </span>
            ) : value ? (
              <span className="block min-w-0 flex-1 truncate">
                {triggerLabel}
              </span>
            ) : (
              <span className="block min-w-0 flex-1 truncate">
                {placeholder}
              </span>
            )}
          </span>
          <ChevronDown
            size={13}
            className={`shrink-0 ${light ? 'text-[#2D2D2D]/30' : 'text-white/30'}`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          'scheme-dark flex max-h-[70vh] w-[var(--radix-popover-trigger-width)] min-w-0 flex-col overflow-hidden border-white/10 p-0 text-white shadow-xl',
          popoverClassName ?? 'bg-[#1e2a14]'
        )}
      >
        <div className="shrink-0 border-b border-white/10 px-2 py-2">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-md bg-white/5 py-1.5 pl-7 pr-2 text-sm text-white/80 placeholder:text-white/25 outline-none"
            />
          </div>
        </div>

        <ScrollArea
          type="always"
          className="h-52 w-full shrink-0 overscroll-contain"
        >
          <div className="p-1">
            <button
              type="button"
              onClick={() => select('')}
              className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${!value ? 'bg-white/10 text-white/90' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
            >
              {placeholder}
            </button>

            {filtered.length === 0 && !showCreateRow && (
              <p className="py-2 text-center text-xs text-white/25">
                Nenhum resultado
              </p>
            )}

            {filtered.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => select(opt)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${value === opt ? 'bg-white/10 text-white/90' : 'text-white/60 hover:bg-white/5 hover:text-white/80'}`}
              >
                {renderOption
                  ? renderOption(opt)
                  : (labelForValue?.(opt) ?? opt)}
              </button>
            ))}

            {showCreateRow && (
              <button
                type="button"
                onClick={() => select(trimmedSearch)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white/90"
              >
                <Plus size={12} className="shrink-0" />
                {createLabel
                  ? createLabel(trimmedSearch)
                  : `Criar "${trimmedSearch}"`}
              </button>
            )}
          </div>
        </ScrollArea>

        {footer && <div className="shrink-0 border-t border-white/10 p-1">{footer}</div>}

        {showClear && value && (
          <div className="border-t border-white/10 p-1">
            <button
              type="button"
              onClick={() => select('')}
              className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-white/35 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              <X size={11} /> {clearLabel}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

'use client'

import React, { useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function FilterCombobox({
  value,
  onChange,
  placeholder,
  clearLabel,
  options,
  width = 'w-44',
  renderOption,
  labelForValue,
  renderValue,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  clearLabel: string
  options: string[]
  width?: string
  renderOption?: (opt: string) => React.ReactNode
  /** Quando `value` não é legível (ex.: id), exibir rótulo no botão. */
  labelForValue?: (value: string) => string
  /** Conteúdo customizado do botão quando há valor (ex.: bolinha + título). */
  renderValue?: (value: string) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(o => {
    const display = labelForValue?.(o) ?? o
    return display.toLowerCase().includes(search.toLowerCase())
  })

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
          className={`flex ${width} items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none hover:bg-white/[0.08] focus:border-white/20`}
        >
          <span
            className={`flex min-w-0 items-center gap-2 ${value ? 'text-white/80' : 'text-white/25'}`}
          >
            {value && renderValue ? (
              renderValue(value)
            ) : value ? (
              <span className="truncate">{triggerLabel}</span>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </span>
          <ChevronDown size={13} className="shrink-0 text-white/30" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={`${width} border-white/10 bg-[#071525] p-0 shadow-xl`}
      >
        <div className="border-b border-white/10 px-2 py-2">
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

        <div className="max-h-52 overflow-y-auto p-1">
          <button
            type="button"
            onClick={() => select('')}
            className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${!value ? 'bg-white/10 text-white/90' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
          >
            {placeholder}
          </button>

          {filtered.length === 0 && (
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
              {renderOption ? renderOption(opt) : opt}
            </button>
          ))}
        </div>

        {value && (
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

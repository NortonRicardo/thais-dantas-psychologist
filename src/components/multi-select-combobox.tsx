'use client'

import React, { useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MultiSelectCombobox({
  values,
  onChange,
  placeholder,
  options,
  width = 'w-full',
  renderOption,
  renderSelectedValue,
  labelForValue,
  maxVisible = 2,
}: {
  values: string[]
  onChange: (v: string[]) => void
  placeholder: string
  options: string[]
  width?: string
  renderOption?: (opt: string) => React.ReactNode
  /** Como renderizar cada item selecionado visível no trigger */
  renderSelectedValue?: (value: string) => React.ReactNode
  labelForValue?: (value: string) => string
  /** Quantos itens mostrar antes do +N (default 2) */
  maxVisible?: number
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(o => {
    const display = labelForValue?.(o) ?? o
    return display.toLowerCase().includes(search.toLowerCase())
  })

  function toggle(v: string) {
    onChange(
      values.includes(v) ? values.filter(x => x !== v) : [...values, v]
    )
  }

  const visible = values.slice(0, maxVisible ?? 2)
  const extra = values.length - visible.length

  return (
    <Popover
      open={open}
      onOpenChange={o => {
        setOpen(o)
        if (o) setTimeout(() => inputRef.current?.focus(), 0)
        if (!o) setSearch('')
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex h-9 min-w-0 ${width} items-center justify-between gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-0 text-sm outline-none hover:bg-white/[0.08] focus:border-white/20`}
        >
          <span
            className={`flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left ${values.length > 0 ? 'text-white/80' : 'text-white/25'}`}
          >
            {values.length === 0 ? (
              <span className="block min-w-0 flex-1 truncate">{placeholder}</span>
            ) : (
              <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                {renderSelectedValue ? (
                  visible.map((v, i) => (
                    <React.Fragment key={v}>
                      {i > 0 && <span className="shrink-0 text-white/30">,</span>}
                      <span className="flex min-w-0 shrink items-center gap-1.5 overflow-hidden">
                        {renderSelectedValue(v)}
                      </span>
                    </React.Fragment>
                  ))
                ) : (
                  <span className="block min-w-0 truncate">
                    {visible.map(v => labelForValue?.(v) ?? v).join(', ')}
                  </span>
                )}
                {extra > 0 && (
                  <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[0.65rem] text-white/50">
                    +{extra}
                  </span>
                )}
              </span>
            )}
          </span>
          <ChevronDown size={13} className="shrink-0 text-white/30" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="scheme-dark flex max-h-[70vh] w-[var(--radix-popover-trigger-width)] min-w-0 flex-col overflow-hidden border-white/10 bg-[#071525] p-0 text-white shadow-xl"
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

        <ScrollArea type="always" className="h-52 w-full shrink-0 overscroll-contain">
          <div className="p-1">
            {filtered.length === 0 && (
              <p className="py-2 text-center text-xs text-white/25">
                Nenhum resultado
              </p>
            )}
            {filtered.map(opt => {
              const selected = values.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    selected
                      ? 'bg-white/10 text-white/90'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                    {selected && <Check size={13} className="text-orange-400" />}
                  </span>
                  {renderOption ? renderOption(opt) : (labelForValue?.(opt) ?? opt)}
                </button>
              )
            })}
          </div>
        </ScrollArea>

        {values.length > 0 && (
          <div className="border-t border-white/10 p-1">
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-white/35 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              <X size={11} /> Limpar seleção
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

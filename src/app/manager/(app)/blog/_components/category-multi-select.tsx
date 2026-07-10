'use client'

import { useRef, useState } from 'react'
import { ChevronDown, Pencil, Plus, X } from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

type Category = { id: string; name: string }

export function CategoryMultiSelect({
  categories,
  selectedIds,
  onChange,
  onRequestCreate,
  onRequestEdit,
}: {
  categories: Category[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  onRequestCreate: () => void
  onRequestEdit: (category: Category) => void
}) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = categories.filter(c => selectedIds.includes(c.id))

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(v => v !== id)
        : [...selectedIds, id]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-left text-sm outline-none transition-colors hover:bg-white/[0.08] focus:border-white/20"
        >
          {selected.length === 0 ? (
            <span className="text-white/25">Selecione categorias…</span>
          ) : (
            <span className="flex flex-1 flex-wrap gap-1.5 py-0.5">
              {selected.map(c => (
                <span
                  key={c.id}
                  className="flex items-center gap-1 rounded-full bg-white/10 py-0.5 pl-2 pr-1 text-xs text-white/80"
                >
                  {c.name}
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={e => {
                      e.stopPropagation()
                      toggle(c.id)
                    }}
                    className="flex size-4 items-center justify-center rounded-full text-white/40 hover:bg-white/15 hover:text-white/80"
                  >
                    <X size={10} />
                  </span>
                </span>
              ))}
            </span>
          )}
          <ChevronDown size={13} className="shrink-0 text-white/30" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="scheme-dark flex max-h-[70vh] w-[var(--radix-popover-trigger-width)] min-w-0 flex-col overflow-hidden border-white/10 bg-[#1e2a14] p-0 text-white shadow-xl"
        onOpenAutoFocus={e => {
          e.preventDefault()
          inputRef.current?.focus()
        }}
      >
        <ScrollArea
          type="always"
          className="h-52 w-full shrink-0 overscroll-contain"
        >
          <div className="p-1">
            {categories.length === 0 ? (
              <p className="py-2 text-center text-xs text-white/25">
                Nenhuma categoria
              </p>
            ) : (
              categories.map(c => (
                <div
                  key={c.id}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/80"
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggle(c.id)}
                      className="size-3.5 shrink-0 rounded accent-emerald-500"
                    />
                    <span className="truncate">{c.name}</span>
                  </label>
                  <button
                    type="button"
                    title="Editar categoria"
                    onClick={() => onRequestEdit(c)}
                    className="shrink-0 rounded p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/70"
                  >
                    <Pencil size={11} />
                  </button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="shrink-0 border-t border-white/10 p-1">
          <button
            type="button"
            onClick={onRequestCreate}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white/90"
          >
            <Plus size={12} className="shrink-0" />
            Nova categoria
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

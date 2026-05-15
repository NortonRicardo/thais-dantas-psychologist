'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ImageIcon, Search, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { EventDialog, type EventRow } from './event-dialog'

const PAGE_SIZE = 10

const TYPE_COLORS: Record<string, string> = {
  Conferência: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Workshop: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Seminário: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Desafio: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Minicurso: 'bg-green-500/15 text-green-300 border-green-500/30',
  Defesa: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Palestra: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Mesa-Redonda': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  Encontro: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return { date, time }
}

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

function FilterCombobox({
  value,
  onChange,
  placeholder,
  clearLabel,
  options,
  width = 'w-44',
  renderOption,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  clearLabel: string
  options: string[]
  width?: string
  renderOption?: (opt: string) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  function select(v: string) {
    onChange(v)
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={o => { setOpen(o); if (o) setTimeout(() => inputRef.current?.focus(), 0) }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex ${width} items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none hover:bg-white/[0.08] focus:border-white/20`}
        >
          <span className={value ? 'text-white/80' : 'text-white/25'}>
            {value || placeholder}
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
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
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
            <p className="py-2 text-center text-xs text-white/25">Nenhum resultado</p>
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
              className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-white/35 hover:bg-white/5 hover:text-white/60 transition-colors"
            >
              <X size={11} /> {clearLabel}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export function EventsTable() {
  const [rows, setRows] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filterTitle, setFilterTitle] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterSpeaker, setFilterSpeaker] = useState('')

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setRows(data)
    } catch {
      toast.error('Erro ao carregar eventos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' })
      toast.success('Evento removido.')
      fetchEvents()
    } catch {
      toast.error('Erro ao remover evento.')
    }
  }

  const filtered = rows.filter(row => {
    if (filterTitle && !row.title.toLowerCase().includes(filterTitle.toLowerCase())) return false
    if (filterType && row.type !== filterType) return false
    if (filterSpeaker && !(row.speaker ?? '').toLowerCase().includes(filterSpeaker.toLowerCase())) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = buildPages(page, totalPages)

  function handleFilterChange(setter: (v: string) => void) {
    return (v: string) => { setter(v); setPage(1) }
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white/90">Eventos</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Gerencie palestras, workshops e encontros do laboratório.
          </p>
        </div>
        <EventDialog onSuccess={fetchEvents} />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrar por título..."
            value={filterTitle}
            onChange={e => handleFilterChange(setFilterTitle)(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-8 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/20"
          />
          {filterTitle && (
            <button onClick={() => handleFilterChange(setFilterTitle)('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X size={13} />
            </button>
          )}
        </div>

        <FilterCombobox
          value={filterType}
          onChange={handleFilterChange(setFilterType)}
          placeholder="Todos os tipos"
          clearLabel="Limpar tipo"
          options={Object.keys(TYPE_COLORS)}
          renderOption={t => (
            <>
              <span className={`h-1.5 w-1.5 rounded-full ${TYPE_COLORS[t]?.split(' ')[0]}`} />
              {t}
            </>
          )}
        />

        <FilterCombobox
          value={filterSpeaker}
          onChange={handleFilterChange(setFilterSpeaker)}
          placeholder="Todos os palestrantes"
          clearLabel="Limpar palestrante"
          options={[...new Set(rows.map(r => r.speaker).filter(Boolean) as string[])].sort()}
          width="w-52"
        />
      </div>

      <div
        className="w-full overflow-x-auto rounded-xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)',
        }}
      >
        <Table className="min-w-[1000px] [table-layout:fixed]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[35%]">
                Título
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[13%]">
                Tipo
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[14%] text-center">
                Data
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[20%]">
                Palestrante
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[10%] text-center">
                Destaque
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[8%] text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.07]">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && filtered.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-white/30"
                >
                  {rows.length === 0 ? 'Nenhum evento cadastrado ainda.' : 'Nenhum evento encontrado para os filtros aplicados.'}
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paged.map(row => (
                <TableRow
                  key={row.id}
                  className="border-white/[0.07] transition-colors hover:bg-white/[0.04]"
                >
                  <TableCell className="font-medium text-white/90">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5">
                        {row.imageMimeType ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/api/events/${row.id}/image?t=${new Date(row.updatedAt).getTime()}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon size={14} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[220px] overflow-hidden">
                        <span className="block truncate">
                          {row.title}
                        </span>
                        {row.organizer && (
                          <span className="block truncate text-[0.7rem] text-white/35 mt-0.5">
                            {row.organizer}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`border text-[0.65rem] uppercase tracking-wide ${TYPE_COLORS[row.type] ?? 'bg-white/10 text-white/60 border-white/20'}`}
                    >
                      {row.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-white/60 text-center">
                    {(() => {
                      const { date, time } = formatDate(row.date)
                      return (
                        <>
                          <span className="block">{date}</span>
                          <span className="block text-white/35 text-xs">
                            {time}
                          </span>
                        </>
                      )
                    })()}
                  </TableCell>

                  <TableCell className="text-sm text-white/55 max-w-[160px]">
                    <div className="overflow-hidden">
                      <span className="truncate block">{row.speaker ?? '—'}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    {row.featured ? (
                      <span className="text-[#00d4ff] text-xs font-semibold">
                        ✦ Sim
                      </span>
                    ) : (
                      <span className="text-white/25 text-xs">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <EventDialog event={row} onSuccess={fetchEvents} />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/50 hover:text-rose-400 hover:bg-rose-400/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#071525] border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover evento?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/50">
                              &ldquo;{row.title}&rdquo; será removido
                              permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                              onClick={() => handleDelete(row.id)}
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault()
                  setPage(p => Math.max(1, p - 1))
                }}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? 'pointer-events-none opacity-40'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }
              />
            </PaginationItem>

            {pages.map((p, i) =>
              p === 'ellipsis' ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis className="text-white/30" />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={e => {
                      e.preventDefault()
                      setPage(p)
                    }}
                    className={
                      p === page
                        ? 'bg-orange-800 text-orange-50 border-0 hover:bg-orange-700'
                        : 'text-white/60 hover:text-white hover:bg-white/10 border-0'
                    }
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault()
                  setPage(p => Math.min(totalPages, p + 1))
                }}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages
                    ? 'pointer-events-none opacity-40'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

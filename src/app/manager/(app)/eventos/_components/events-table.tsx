'use client'

import { useCallback, useEffect, useState } from 'react'
import { ImageIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

export function EventsTable() {
  const [rows, setRows] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

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

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = buildPages(page, totalPages)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <EventDialog onSuccess={fetchEvents} />
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
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[35%]">
                Título
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                Tipo
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold text-center">
                Data
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                Palestrante
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold text-center">
                Destaque
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold text-right">
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

            {!loading && rows.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-white/30"
                >
                  Nenhum evento cadastrado ainda.
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

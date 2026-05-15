'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

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
import { formatMonthYearPtUtc } from '@/lib/about-timeline-date'
import {
  TimelineEntryDialog,
  type TimelineEntryRow,
} from './timeline-entry-dialog'
import { readApiError } from '@/lib/read-api-error'

const PAGE_SIZE = 10

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

export function TimelineTable() {
  const [rows, setRows] = useState<TimelineEntryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchEntries = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true)
    try {
      const res = await fetch('/api/about-timeline')
      const data = await res.json()
      setRows(
        data.map(
          (r: {
            id: string
            date: string | Date
            title: string
            description: string
            updatedAt: string | Date
          }) => ({
            id: r.id,
            date:
              typeof r.date === 'string'
                ? r.date
                : new Date(r.date).toISOString(),
            title: r.title,
            description: r.description,
            updatedAt:
              typeof r.updatedAt === 'string'
                ? r.updatedAt
                : new Date(r.updatedAt).toISOString(),
          })
        )
      )
    } catch {
      toast.error('Erro ao carregar linha do tempo.')
    } finally {
      if (!opts?.silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/about-timeline/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok && res.status !== 204) {
        throw new Error(await readApiError(res))
      }
      toast.success('Marco removido.')
      await fetchEntries({ silent: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover marco.')
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = buildPages(page, totalPages)

  return (
    <div className="space-y-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-white/90">Sobre Nós</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Gerencie os marcos da linha do tempo exibida na página pública Sobre
            Nós.
          </p>
        </div>
        <div className="flex shrink-0 self-end sm:self-auto">
          <TimelineEntryDialog onSuccess={fetchEntries} />
        </div>
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
        <Table className="min-w-[720px] [table-layout:fixed]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold whitespace-nowrap w-[15%]">
                Data
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[25%]">
                Título
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[45%]">
                Descrição
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[15%] text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.07]">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && rows.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-sm text-white/30"
                >
                  Nenhum marco cadastrado ainda.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paged.map(row => (
                <TableRow
                  key={row.id}
                  className="border-white/[0.07] transition-colors hover:bg-white/[0.04]"
                >
                  <TableCell className="text-sm text-white/75 whitespace-nowrap capitalize">
                    {formatMonthYearPtUtc(row.date)}
                  </TableCell>
                  <TableCell className="font-medium text-white/90 max-w-[200px]">
                    <div className="overflow-hidden">
                      <span className="line-clamp-2">{row.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-white/45 max-w-md">
                    <div className="overflow-hidden">
                      <span className="line-clamp-2">{row.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TimelineEntryDialog
                        entry={row}
                        onSuccess={fetchEntries}
                      />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/50 hover:text-rose-400 hover:bg-rose-400/10"
                            disabled={deletingId !== null}
                            aria-busy={deletingId === row.id ? true : undefined}
                          >
                            {deletingId === row.id ? (
                              <Loader2
                                size={14}
                                className="animate-spin text-rose-400/90"
                                aria-hidden
                              />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#071525] border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover marco?</AlertDialogTitle>
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
                              disabled={deletingId !== null}
                              onClick={e => {
                                e.preventDefault()
                                void handleDelete(row.id)
                              }}
                            >
                              {deletingId === row.id ? 'A remover…' : 'Remover'}
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

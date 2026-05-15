'use client'

import { useCallback, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
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
import { TeamDegreeLevelDialog, type TeamDegreeLevelRow } from './team-degree-level-dialog'

const PAGE_SIZE = 10

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

export function TeamDegreeLevelsTable() {
  const [rows, setRows] = useState<TeamDegreeLevelRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/team/degree-levels')
      const data = await res.json()
      setRows(
        data.map(
          (r: {
            id: string
            label: string
            updatedAt: string | Date
          }) => ({
            id: r.id,
            label: r.label,
            updatedAt:
              typeof r.updatedAt === 'string'
                ? r.updatedAt
                : new Date(r.updatedAt).toISOString(),
          })
        )
      )
    } catch {
      toast.error('Erro ao carregar graus acadêmicos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRows()
  }, [fetchRows])

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/team/degree-levels/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(typeof err.error === 'string' ? err.error : 'Erro ao remover')
      }
      toast.success('Grau removido.')
      fetchRows()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover grau.')
    }
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = buildPages(page, totalPages)

  return (
    <div className="space-y-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-white/90">Graus acadêmicos</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Graduação, mestrado, doutorado, pós-doutorado, etc. — usados na ficha do membro e na página
            pública.
          </p>
        </div>
        <div className="flex shrink-0 self-end sm:self-start sm:pt-0.5">
          <TeamDegreeLevelDialog onSuccess={fetchRows} />
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
        <Table className="min-w-[480px] [table-layout:fixed]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[70%]">
                Grau
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[30%] text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.07]">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && rows.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell
                  colSpan={2}
                  className="py-12 text-center text-sm text-white/30"
                >
                  Nenhum grau cadastrado ainda.
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
                    <span className="text-white/80">{row.label}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TeamDegreeLevelDialog degreeLevel={row} onSuccess={fetchRows} />
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
                            <AlertDialogTitle>Remover grau?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/50">
                              &ldquo;{row.label}&rdquo; será removido permanentemente.
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
